import type { StateStorage } from 'zustand/middleware';

export const DB_NAME = 'github-stars-manager-db';
const STORE_NAME = 'app_state';
const DB_VERSION = 1;

export const canUseIndexedDB = () => typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';

const withTimeout = async <T>(promise: Promise<T>, timeoutMs = 3000): Promise<T> => {
  return await Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('IndexedDB timeout')), timeoutMs)),
  ]);
};

const safeLocalStorageGet = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

// localStorage quota is ~5MB. Data beyond this is silently truncated in some browsers.
const LOCAL_STORAGE_SIZE_LIMIT = 4.5 * 1024 * 1024; // 4.5MB safe threshold

export const safeLocalStorageSet = (key: string, value: string): void => {
  if (value.length > LOCAL_STORAGE_SIZE_LIMIT) {
    // Data too large for localStorage — skip to prevent silent truncation.
    // IndexedDB is the authoritative store; remove stale truncated localStorage copy.
    try {
      window.localStorage.removeItem(key);
    } catch { /* ignore */ }
    return;
  }
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Quota/security errors are expected in some environments; ignore.
  }
};

const safeLocalStorageRemove = (key: string): void => {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
};

const openDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const idbGet = async (key: string): Promise<string | null> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);

    req.onsuccess = () => resolve((req.result as string | undefined) ?? null);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
};

export const idbSet = async (key: string, value: string): Promise<void> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(value, key);

    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
};

const idbDelete = async (key: string): Promise<void> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(key);

    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
};

/**
 * IndexedDB-backed Zustand persist storage.
 *
 * IndexedDB is the authoritative store (no size limit, survives tab close).
 * localStorage is a secondary backup for environments without IndexedDB.
 *
 * Read:  IndexedDB first → localStorage fallback
 * Write: IndexedDB first → localStorage backup (skipped if data > 4.5MB)
 */
export const indexedDBStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (typeof window === 'undefined') return null;

    if (!canUseIndexedDB()) {
      return safeLocalStorageGet(name);
    }

    try {
      const idbValue = await withTimeout(idbGet(name));

      if (idbValue !== null) {
        safeLocalStorageSet(name, idbValue);
        return idbValue;
      }

      // IndexedDB is empty — try localStorage (first-time migration or IDB was cleared)
      const lsValue = safeLocalStorageGet(name);
      if (lsValue !== null) {
        // Migrate localStorage data to IndexedDB
        await withTimeout(idbSet(name, lsValue));
        return lsValue;
      }

      return null;
    } catch (error) {
      console.warn('[storage] IndexedDB get failed, fallback to localStorage:', error);
      return safeLocalStorageGet(name);
    }
  },

  setItem: async (name: string, value: string): Promise<void> => {
    if (typeof window === 'undefined') return;

    // Write to IndexedDB first (authoritative, no size limit).
    if (canUseIndexedDB()) {
      try {
        await withTimeout(idbSet(name, value));
      } catch (error) {
        console.warn('[storage] IndexedDB set failed:', error);
      }
    }

    // Write to localStorage as backup (skipped if data > 4.5MB to prevent truncation).
    safeLocalStorageSet(name, value);
  },

  removeItem: async (name: string): Promise<void> => {
    if (typeof window === 'undefined') return;

    safeLocalStorageRemove(name);

    if (!canUseIndexedDB()) return;

    try {
      await withTimeout(idbDelete(name));
    } catch (error) {
      console.warn('[storage] IndexedDB remove failed:', error);
    }
  },
};
