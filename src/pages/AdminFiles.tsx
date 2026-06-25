import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SharedFile = {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  sender_name: string | null;
  receiver_name: string | null;
  created_at: string;
};

const ADMIN_EMAIL = "mdimam.cse9.bu@gmail.com";

const AdminFiles = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [thumbUrls, setThumbUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const bootstrap = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user?.email !== ADMIN_EMAIL) {
        navigate("/login", { replace: true });
        return;
      }
      await fetchFiles();
    };
    void bootstrap();
  }, [navigate]);

  const fetchFiles = async () => {
    setLoading(true);
    const { data } = await supabase.from("shared_files").select("*").order("created_at", { ascending: false });
    setFiles((data || []) as SharedFile[]);
    setLoading(false);
  };

  const removeFile = async (file: SharedFile) => {
    await supabase.storage.from("shared-files").remove([file.storage_path]);
    await supabase.from("shared_files").delete().eq("id", file.id);
    await fetchFiles();
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return files;
    return files.filter((f) => [f.file_name, f.sender_name, f.receiver_name].join(" ").toLowerCase().includes(q));
  }, [files, search]);

  const totalStorage = useMemo(() => filtered.reduce((sum, file) => sum + file.file_size, 0), [filtered]);

  useEffect(() => {
    const loadThumbs = async () => {
      const mediaFiles = filtered.filter((f) => f.file_type.startsWith("image/") || f.file_type.startsWith("video/")).slice(0, 20);
      const entries = await Promise.all(
        mediaFiles.map(async (file) => {
          const { data } = await supabase.storage.from("shared-files").createSignedUrl(file.storage_path, 300);
          return [file.id, data?.signedUrl || ""] as const;
        }),
      );
      setThumbUrls(Object.fromEntries(entries.filter(([, url]) => url)));
    };
    void loadThumbs();
  }, [filtered]);

  return (
    <div className="min-h-screen bg-[#090f1f] p-4 text-white md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Cloud Files Dashboard</h1>
            <p className="text-sm text-white/70">Total files: {filtered.length} · Total size: {(totalStorage / (1024 * 1024)).toFixed(1)} MB</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchFiles}>Refresh</Button>
            <Button variant="secondary" onClick={async () => {
              await supabase.auth.signOut();
              navigate("/");
            }}>Logout</Button>
          </div>
        </div>

        <div className="mb-4">
          <Input placeholder="Search by file or device" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm border-white/20 bg-white/10" />
        </div>

        <div className="overflow-auto rounded-2xl border border-white/15 bg-white/5">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="p-3">Preview</th>
                <th className="p-3">File</th>
                <th className="p-3">Type</th>
                <th className="p-3">Sender</th>
                <th className="p-3">Receiver</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="p-4" colSpan={7}>Loading files...</td></tr>
              ) : filtered.map((file) => (
                <tr key={file.id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="p-3">
                    {thumbUrls[file.id] ? (
                      file.file_type.startsWith("image/") ? (
                        <img src={thumbUrls[file.id]} alt={file.file_name} className="h-12 w-12 rounded object-cover" />
                      ) : (
                        <video src={thumbUrls[file.id]} className="h-12 w-12 rounded object-cover" muted />
                      )
                    ) : (
                      <div className="h-12 w-12 rounded bg-white/10" />
                    )}
                  </td>
                  <td className="p-3">
                    <p>{file.file_name}</p>
                    <p className="text-xs text-white/60">{(file.file_size / 1024 / 1024).toFixed(2)} MB</p>
                  </td>
                  <td className="p-3">{file.file_type}</td>
                  <td className="p-3">{file.sender_name || "-"}</td>
                  <td className="p-3">{file.receiver_name || "-"}</td>
                  <td className="p-3">{format(new Date(file.created_at), "PPp")}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button size="sm" onClick={async () => {
                        const { data } = await supabase.storage.from("shared-files").createSignedUrl(file.storage_path, 120);
                        if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                      }}>Preview</Button>
                      <Button size="sm" variant="outline" onClick={() => removeFile(file)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminFiles;
