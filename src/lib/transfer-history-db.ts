export type TransferHistoryItem = {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: string;
  direction: "send" | "receive";
  speed: number;
  eta: string;
  createdAt: number;
};

const DB_NAME = "swiftdrop-history-db";
const STORE_NAME = "transfers";
const DB_VERSION = 1;

const openDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

export const saveTransferHistory = async (items: TransferHistoryItem[]): Promise<void> => {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    for (const item of items.slice(0, 100)) {
      store.put(item);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
};

export const loadTransferHistory = async (): Promise<TransferHistoryItem[]> => {
  const db = await openDb();
  const items = await new Promise<TransferHistoryItem[]>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve((request.result || []) as TransferHistoryItem[]);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return items.sort((a, b) => b.createdAt - a.createdAt);
};
