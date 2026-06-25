import { useEffect, useMemo, useRef, useState } from "react";
import { Peer, DataConnection } from "peerjs";
import QRCode from "qrcode";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { CHUNK_SIZE, MAX_FILE_SIZE, defaultDeviceName, estimateEta, formatBytes, makeAvatarLabel, randomRoomCode, sanitizeDeviceName, sha256Hex } from "@/lib/share-utils";
import { loadTransferHistory, saveTransferHistory } from "@/lib/transfer-history-db";

type Presence = {
  peer_id: string;
  device_name: string;
  avatar: string;
  room_code: string | null;
  updated_at: string;
};

type Transfer = {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: "pending" | "sending" | "receiving" | "completed" | "paused" | "error" | "declined";
  speed: number;
  eta: string;
  direction: "send" | "receive";
  error?: string;
};

type OutgoingState = {
  file: File;
  transferId: string;
  accepted: boolean;
  sentBytes: number;
  paused: boolean;
  startedAt: number;
  nextIndex: number;
};

type IncomingState = {
  transferId: string;
  name: string;
  size: number;
  mimeType: string;
  chunks: ArrayBuffer[];
  receivedBytes: number;
  startedAt: number;
};

type ControlMessage =
  | { t: "offer"; id: string; name: string; size: number; mimeType: string; senderName: string }
  | { t: "resume-request"; id: string; offset: number }
  | { t: "chunk-ack"; id: string; offset: number }
  | { t: "chunk-nack"; id: string; index: number; offset: number; reason: string }
  | { t: "complete"; id: string; senderName: string }
  | { t: "decline"; id: string }
  | { t: "accept"; id: string }
  | { t: "chunk"; id: string; index: number; offset: number; checksum: string; payload: ArrayBuffer };

const HISTORY_KEY = "p2p-transfer-history-v1";
const DEVICE_NAME_KEY = "p2p-device-name-v1";
const screenStyle = "min-h-screen bg-[radial-gradient(circle_at_top,_#12203b_0%,_#080b16_35%,_#05070d_100%)] text-white";

const uploadReceivedToCloud = async (file: File, senderName: string, receiverName: string) => {
  const storagePath = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${file.name}`;
  await supabase.storage.from("shared-files").upload(storagePath, file, { upsert: false });
  await supabase.from("shared_files").insert({
    file_name: file.name,
    file_size: file.size,
    file_type: file.type || "application/octet-stream",
    storage_path: storagePath,
    sender_name: senderName,
    receiver_name: receiverName,
  });
};

const isControlMessage = (value: unknown): value is ControlMessage =>
  typeof value === "object" && value !== null && "t" in value;

const Share = () => {
  const navigate = useNavigate();
  const [peerId, setPeerId] = useState("");
  const [deviceName, setDeviceName] = useState(localStorage.getItem(DEVICE_NAME_KEY) || defaultDeviceName());
  const [presence, setPresence] = useState<Presence[]>([]);
  const [connectedPeer, setConnectedPeer] = useState<Presence | null>(null);
  const [roomCode, setRoomCode] = useState(randomRoomCode());
  const [joinCode, setJoinCode] = useState("");
  const [joinPeerId, setJoinPeerId] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [fullDropActive, setFullDropActive] = useState(false);
  const [incomingOffer, setIncomingOffer] = useState<null | { transferId: string; name: string; size: number; mimeType: string; senderName: string }>(null);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [reconnectStatus, setReconnectStatus] = useState("");

  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);
  const outgoingRef = useRef<OutgoingState | null>(null);
  const incomingRef = useRef<IncomingState | null>(null);
  const heartbeatTimer = useRef<number | null>(null);
  const reconnectTimer = useRef<number | null>(null);
  const reconnectAttemptRef = useRef(0);
  const retryIndexRef = useRef<number | null>(null);
  const retryBudgetRef = useRef<Record<number, number>>({});

  const nearbyDevices = useMemo(() => presence.filter((d) => d.peer_id !== peerId), [presence, peerId]);

  useEffect(() => {
    const peer = new Peer();
    peerRef.current = peer;

    const onOpen = (id: string) => {
      setPeerId(id);
    };

    const onConnection = (conn: DataConnection) => {
      reconnectAttemptRef.current = 0;
      if (reconnectTimer.current) window.clearTimeout(reconnectTimer.current);
      setReconnectStatus("");
      bindConnection(conn);
      setConnectedPeer({
        peer_id: conn.peer,
        device_name: conn.metadata?.deviceName || "Nearby Device",
        avatar: makeAvatarLabel(conn.metadata?.deviceName || "Nearby Device"),
        room_code: null,
        updated_at: new Date().toISOString(),
      });
    };

    peer.on("open", onOpen);
    peer.on("connection", onConnection);
    return () => {
      if (heartbeatTimer.current) window.clearInterval(heartbeatTimer.current);
      if (reconnectTimer.current) window.clearTimeout(reconnectTimer.current);
      peer.destroy();
    };
  // Peer object is created once for this page lifecycle.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(DEVICE_NAME_KEY, sanitizeDeviceName(deviceName));
  }, [deviceName]);

  useEffect(() => {
    if (!peerId) return;
    const writePresence = async () => {
      await supabase.from("peer_presence").upsert({
        peer_id: peerId,
        device_name: sanitizeDeviceName(deviceName),
        avatar: makeAvatarLabel(deviceName),
        room_code: roomCode,
        updated_at: new Date().toISOString(),
      });
      const { data } = await supabase
        .from("peer_presence")
        .select("*")
        .gte("updated_at", new Date(Date.now() - 20_000).toISOString())
        .order("updated_at", { ascending: false });
      setPresence((data || []) as Presence[]);
    };
    writePresence();
    heartbeatTimer.current = window.setInterval(writePresence, 5000);
    return () => {
      if (heartbeatTimer.current) window.clearInterval(heartbeatTimer.current);
    };
  }, [peerId, deviceName, roomCode]);

  useEffect(() => {
    const sync = localStorage.getItem(HISTORY_KEY);
    if (sync) setTransfers((JSON.parse(sync) as Transfer[]).slice(0, 8));
    loadTransferHistory()
      .then((rows) => {
        if (rows.length) {
          setTransfers((prev) =>
            [...rows.map((row) => ({ ...row, status: row.status as Transfer["status"] } as Transfer)), ...prev]
              .slice(0, 15),
          );
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const peer = params.get("peer");
    if (code) setJoinCode(code.toUpperCase());
    if (peer) setJoinPeerId(peer);
  }, []);

  useEffect(() => {
    if (!peerId || !joinPeerId || joinPeerId === peerId || connectedPeer) return;
    connectToPeer(joinPeerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerId, joinPeerId]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(transfers.slice(0, 25)));
    void saveTransferHistory(
      transfers.slice(0, 50).map((item) => ({
        id: item.id,
        name: item.name,
        size: item.size,
        progress: item.progress,
        status: item.status,
        direction: item.direction,
        speed: item.speed,
        eta: item.eta,
        createdAt: Date.now(),
      })),
    );
  }, [transfers]);

  useEffect(() => {
    if (!roomCode || !peerId) return;
    const url = `${window.location.origin}/share?code=${encodeURIComponent(roomCode)}&peer=${encodeURIComponent(peerId)}`;
    QRCode.toDataURL(url, { margin: 0, width: 150 }).then(setQrCode).catch(() => setQrCode(""));
  }, [roomCode, peerId]);

  useEffect(() => {
    const onDragEnter = (ev: DragEvent) => {
      ev.preventDefault();
      setFullDropActive(true);
    };
    const onDrop = () => setFullDropActive(false);
    const onLeave = () => setFullDropActive(false);
    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("drop", onDrop);
    window.addEventListener("dragleave", onLeave);
    return () => {
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("drop", onDrop);
      window.removeEventListener("dragleave", onLeave);
    };
  }, []);

  const upsertTransfer = (transfer: Transfer) => {
    setTransfers((prev) => [transfer, ...prev.filter((item) => item.id !== transfer.id)]);
  };

  const patchTransfer = (id: string, patch: Partial<Transfer>) => {
    setTransfers((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const bindConnection = (conn: DataConnection) => {
    connRef.current = conn;
    conn.on("open", () => {});
    conn.on("close", () => {
      if (connectedPeer) scheduleReconnect(connectedPeer.peer_id);
    });
    conn.on("error", () => {
      if (outgoingRef.current) patchTransfer(outgoingRef.current.transferId, { status: "error", error: "Connection error" });
    });
    conn.on("data", async (raw) => {
      if (raw instanceof ArrayBuffer) {
        const incoming = incomingRef.current;
        if (!incoming) return;
        incoming.chunks.push(raw);
        incoming.receivedBytes += raw.byteLength;
        const elapsed = (Date.now() - incoming.startedAt) / 1000;
        const speed = incoming.receivedBytes / Math.max(elapsed, 0.2);
        patchTransfer(incoming.transferId, {
          status: "receiving",
          progress: (incoming.receivedBytes / incoming.size) * 100,
          speed,
          eta: estimateEta(incoming.size - incoming.receivedBytes, speed),
        });
        conn.send({ t: "chunk-ack", id: incoming.transferId, offset: incoming.receivedBytes });
        return;
      }

      if (!isControlMessage(raw)) return;
      const data = raw;
      if (data.t === "offer") {
        setIncomingOffer({
          transferId: data.id,
          name: data.name,
          size: data.size,
          mimeType: data.mimeType,
          senderName: data.senderName,
        });
      }
      if (data.t === "resume-request" && outgoingRef.current?.transferId === data.id) {
        outgoingRef.current.sentBytes = data.offset;
        void pumpChunks();
      }
      if (data.t === "chunk-ack" && outgoingRef.current?.transferId === data.id) {
        outgoingRef.current.sentBytes = Math.max(outgoingRef.current.sentBytes, data.offset);
        retryIndexRef.current = null;
      }
      if (data.t === "chunk-nack" && outgoingRef.current?.transferId === data.id) {
        const used = retryBudgetRef.current[data.index] || 0;
        if (used > 4) {
          patchTransfer(data.id, { status: "error", error: "Chunk retries exceeded." });
          return;
        }
        retryBudgetRef.current[data.index] = used + 1;
        retryIndexRef.current = data.index;
      }
      if (data.t === "accept" && outgoingRef.current?.transferId === data.id) {
        outgoingRef.current.accepted = true;
        void pumpChunks();
      }
      if (data.t === "chunk" && incomingRef.current?.transferId === data.id) {
        const incoming = incomingRef.current;
        const computed = await sha256Hex(data.payload);
        if (computed !== data.checksum) {
          conn.send({ t: "chunk-nack", id: data.id, index: data.index, offset: data.offset, reason: "checksum-mismatch" });
          return;
        }
        if (incoming.receivedBytes !== data.offset) {
          conn.send({ t: "resume-request", id: data.id, offset: incoming.receivedBytes });
          return;
        }
        incoming.chunks.push(data.payload);
        incoming.receivedBytes += data.payload.byteLength;
        const elapsed = (Date.now() - incoming.startedAt) / 1000;
        const speed = incoming.receivedBytes / Math.max(elapsed, 0.2);
        patchTransfer(incoming.transferId, {
          status: "receiving",
          progress: (incoming.receivedBytes / incoming.size) * 100,
          speed,
          eta: estimateEta(incoming.size - incoming.receivedBytes, speed),
        });
        conn.send({ t: "chunk-ack", id: incoming.transferId, offset: incoming.receivedBytes });
      }
      if (data.t === "complete" && incomingRef.current?.transferId === data.id) {
        const incoming = incomingRef.current;
        const file = new File(incoming.chunks, incoming.name, { type: incoming.mimeType });
        patchTransfer(incoming.transferId, { status: "completed", progress: 100, eta: "0s", speed: 0 });
        incomingRef.current = null;
        await uploadReceivedToCloud(file, data.senderName || "Unknown", sanitizeDeviceName(deviceName));
      }
      if (data.t === "decline") {
        patchTransfer(data.id, { status: "declined", error: "Receiver declined this transfer." });
      }
    });
  };

  const connectToPeer = (targetPeerId: string, target?: Presence) => {
    if (!peerRef.current) return;
    const conn = peerRef.current.connect(targetPeerId, {
      reliable: true,
      metadata: { deviceName: sanitizeDeviceName(deviceName) },
    });
    bindConnection(conn);
    setConnectedPeer(target || null);
    setReconnectStatus("");
    reconnectAttemptRef.current = 0;
  };

  const scheduleReconnect = (targetPeerId: string) => {
    reconnectAttemptRef.current += 1;
    const backoffMs = Math.min(2000 * 2 ** (reconnectAttemptRef.current - 1), 20000);
    setReconnectStatus(`Reconnecting in ${(backoffMs / 1000).toFixed(1)}s (attempt ${reconnectAttemptRef.current})`);
    reconnectTimer.current = window.setTimeout(() => {
      if (!peerRef.current) return;
      const conn = peerRef.current.connect(targetPeerId, {
        reliable: true,
        metadata: { deviceName: sanitizeDeviceName(deviceName) },
      });
      bindConnection(conn);
      setReconnectStatus(`Reconnecting... (attempt ${reconnectAttemptRef.current})`);
    }, backoffMs);
  };

  const connectByRoom = async () => {
    if (!joinCode.trim()) return;
    const { data } = await supabase
      .from("peer_presence")
      .select("*")
      .eq("room_code", joinCode.trim().toUpperCase())
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data?.peer_id) connectToPeer(data.peer_id, data as Presence);
  };

  const sendFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    const conn = connRef.current;
    if (!conn || !connectedPeer) return;

    for (const file of list) {
      if (file.size > MAX_FILE_SIZE) continue;
      const transferId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      upsertTransfer({
        id: transferId,
        name: file.name,
        size: file.size,
        progress: 0,
        status: "pending",
        speed: 0,
        eta: "--",
        direction: "send",
      });
      conn.send({ t: "offer", id: transferId, name: file.name, size: file.size, mimeType: file.type, senderName: sanitizeDeviceName(deviceName) });
      outgoingRef.current = {
        file,
        transferId,
        accepted: false,
        sentBytes: 0,
        paused: false,
        startedAt: Date.now(),
        nextIndex: 0,
      };
    }
  };

  const acceptIncoming = () => {
    if (!incomingOffer || !connRef.current) return;
    incomingRef.current = {
      transferId: incomingOffer.transferId,
      name: incomingOffer.name,
      size: incomingOffer.size,
      mimeType: incomingOffer.mimeType,
      chunks: [],
      receivedBytes: 0,
      startedAt: Date.now(),
    };
    upsertTransfer({
      id: incomingOffer.transferId,
      name: incomingOffer.name,
      size: incomingOffer.size,
      progress: 0,
      status: "receiving",
      speed: 0,
      eta: "--",
      direction: "receive",
    });
    connRef.current.send({ t: "accept", id: incomingOffer.transferId });
    connRef.current.send({ t: "resume-request", id: incomingOffer.transferId, offset: 0 });
    setIncomingOffer(null);
  };

  const declineIncoming = () => {
    if (!incomingOffer || !connRef.current) return;
    connRef.current.send({ t: "decline", id: incomingOffer.transferId });
    setIncomingOffer(null);
  };

  const pauseTransfer = () => {
    if (outgoingRef.current) {
      outgoingRef.current.paused = true;
      patchTransfer(outgoingRef.current.transferId, { status: "paused" });
    }
  };

  const resumeTransfer = () => {
    if (outgoingRef.current) {
      outgoingRef.current.paused = false;
      patchTransfer(outgoingRef.current.transferId, { status: "sending" });
      void pumpChunks();
    }
  };

  const pumpChunks = async () => {
    const current = outgoingRef.current;
    const conn = connRef.current;
    if (!current || !conn) return;
    if (current.paused) return;
    if (!current.accepted) return;
    patchTransfer(current.transferId, { status: "sending" });
    while (current.sentBytes < current.file.size) {
      if (current.paused || conn.open === false) return;
      const preferredIndex = retryIndexRef.current ?? current.nextIndex;
      const start = preferredIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, current.file.size);
      if (start >= current.file.size) break;
      const chunk = await current.file.slice(start, end).arrayBuffer();
      const checksum = await sha256Hex(chunk);
      try {
        conn.send({ t: "chunk", id: current.transferId, index: preferredIndex, offset: start, checksum, payload: chunk });
      } catch {
        await new Promise((r) => window.setTimeout(r, 300));
        continue;
      }
      if (retryIndexRef.current === null) {
        current.nextIndex = preferredIndex + 1;
        current.sentBytes = Math.max(current.sentBytes, end);
      } else {
        await new Promise((r) => window.setTimeout(r, 150));
        continue;
      }
      const elapsed = (Date.now() - current.startedAt) / 1000;
      const speed = current.sentBytes / Math.max(elapsed, 0.2);
      patchTransfer(current.transferId, {
        progress: (current.sentBytes / current.file.size) * 100,
        speed,
        eta: estimateEta(current.file.size - current.sentBytes, speed),
      });
      await new Promise((r) => window.setTimeout(r, 8));
    }
    conn.send({ t: "complete", id: current.transferId, senderName: sanitizeDeviceName(deviceName) });
    patchTransfer(current.transferId, { status: "completed", progress: 100, eta: "0s", speed: 0 });
    outgoingRef.current = null;
  };

  return (
    <div className={screenStyle}>
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold md:text-3xl">SwiftDrop</h1>
          <Button variant="outline" onClick={() => navigate("/")}>Portfolio</Button>
        </div>

        {!connectedPeer ? (
          <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
              <p className="text-sm text-white/75">Auto discovery (radar)</p>
              <div className="relative mt-6 flex h-[360px] items-center justify-center overflow-hidden rounded-full border border-white/20 bg-gradient-to-b from-white/10 to-white/5">
                <div className="absolute h-16 w-16 rounded-full bg-cyan-400/30 blur-lg" />
                <div className="absolute h-24 w-24 animate-ping rounded-full border border-cyan-300/40" />
                <div className="absolute h-40 w-40 animate-ping rounded-full border border-blue-300/30 [animation-delay:700ms]" />
                <div className="absolute h-56 w-56 animate-ping rounded-full border border-indigo-300/20 [animation-delay:1200ms]" />
                <div className="absolute z-10 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500 font-semibold shadow-[0_0_40px_rgba(34,211,238,0.6)]">You</div>
                {nearbyDevices.slice(0, 8).map((device, index) => {
                  const angle = (Math.PI * 2 * index) / Math.max(nearbyDevices.length, 1);
                  const radius = 120 + (index % 2) * 28;
                  return (
                    <button
                      key={device.peer_id}
                      onClick={() => connectToPeer(device.peer_id, device)}
                      className="absolute z-20 h-14 w-14 rounded-full bg-white/20 text-xs font-medium shadow-lg ring-1 ring-white/30 transition hover:scale-110 hover:bg-cyan-400/35"
                      style={{ transform: `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px)` }}
                      title={device.device_name}
                    >
                      {device.avatar}
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 text-sm text-white/70">Tap a device to connect instantly.</p>
            </div>

            <div className="space-y-4 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
              <label className="text-sm text-white/80">Your device name</label>
              <Input value={deviceName} onChange={(e) => setDeviceName(e.target.value)} className="border-white/20 bg-white/10" />

              <div className="space-y-2 rounded-xl border border-white/20 p-4">
                <p className="text-sm font-medium">Fallback room connect</p>
                <div className="flex gap-2">
                  <Input value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="Room code" className="border-white/20 bg-white/5" />
                  <Button onClick={connectByRoom}>Join</Button>
                </div>
                <div className="mt-2 flex gap-2">
                  <Input value={roomCode} onChange={(e) => setRoomCode(e.target.value.toUpperCase())} className="border-white/20 bg-white/5" />
                  <Button variant="secondary" onClick={() => setRoomCode(randomRoomCode())}>New</Button>
                </div>
                {qrCode ? <img src={qrCode} alt="Room QR" className="mt-3 h-28 w-28 rounded-lg bg-white p-2" /> : null}
              </div>

              <div className="space-y-2 rounded-xl border border-white/20 p-4 text-sm text-white/70">
                <p><span className="text-white">Peer ID:</span> {peerId || "..."}</p>
                <div className="flex gap-2">
                  <Input value={joinPeerId} onChange={(e) => setJoinPeerId(e.target.value)} placeholder="Direct peer id" className="border-white/20 bg-white/5" />
                  <Button onClick={() => connectToPeer(joinPeerId)}>Connect</Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-4">
              <div>
                <p className="text-sm text-emerald-200">Connected to</p>
                <p className="text-lg font-semibold">{connectedPeer.device_name}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={pauseTransfer}>Pause</Button>
                <Button onClick={resumeTransfer}>Resume</Button>
              </div>
            </div>
            {reconnectStatus ? (
              <div className="rounded-xl border border-amber-300/40 bg-amber-400/10 px-4 py-2 text-sm text-amber-100">{reconnectStatus}</div>
            ) : null}

            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                void sendFiles(e.dataTransfer.files);
              }}
              className={`block rounded-3xl border-2 border-dashed p-12 text-center transition ${
                dragActive ? "border-cyan-300 bg-cyan-500/15 shadow-[0_0_80px_rgba(34,211,238,0.35)]" : "border-white/30 bg-white/10"
              }`}
            >
              <input type="file" multiple className="hidden" onChange={(e) => e.target.files && void sendFiles(e.target.files)} />
              <p className="text-xl font-semibold">Drop to send files</p>
              <p className="mt-2 text-sm text-white/70">or tap to upload</p>
            </label>

            <div className="grid gap-3">
              {transfers.map((t) => (
                <div key={t.id} className="rounded-2xl border border-white/20 bg-white/10 p-4 transition hover:bg-white/15">
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t.name}</p>
                      <p className="text-xs text-white/65">{formatBytes(t.size)} · {t.direction === "send" ? "Sending" : "Receiving"}</p>
                    </div>
                    <span className="text-sm capitalize">{t.status}</span>
                  </div>
                  <Progress value={t.progress} />
                  <div className="mt-2 flex items-center justify-between text-xs text-white/70">
                    <span>{Math.round(t.progress)}%</span>
                    <span>{formatBytes(t.speed)}/s</span>
                    <span>ETA {t.eta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {incomingOffer ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-[#0c1224]/95 p-5">
            <p className="text-lg font-semibold">Incoming file</p>
            <p className="mt-2 text-sm text-white/75">{incomingOffer.senderName} wants to send:</p>
            <p className="mt-2">{incomingOffer.name}</p>
            <p className="text-sm text-white/70">{formatBytes(incomingOffer.size)}</p>
            <div className="mt-4 flex gap-2">
              <Button onClick={acceptIncoming}>Accept</Button>
              <Button variant="outline" onClick={declineIncoming}>Decline</Button>
            </div>
          </div>
        </div>
      ) : null}

      {fullDropActive ? (
        <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-cyan-500/10 backdrop-blur-sm">
          <div className="rounded-3xl border border-cyan-300/50 bg-cyan-500/20 px-10 py-8 text-xl font-semibold">Drop to send files</div>
        </div>
      ) : null}
    </div>
  );
};

export default Share;
