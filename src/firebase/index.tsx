import { useEffect, useState } from 'react';
import { getAnalytics } from 'firebase/analytics';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  Database,
  DatabaseReference,
  DataSnapshot,
  push as fbPush,
  set as fbSet,
  get,
  getDatabase,
  off,
  onValue,
  ref,
} from 'firebase/database';

let app: FirebaseApp;
let database: Database;

async function init() {
  if (app) return { app, database };

  const response = await fetch('/__/firebase/init.json');
  const config = await response.json();

  app = initializeApp(config);
  database = getDatabase(app);
  getAnalytics(app);
  getAuth(app);

  return { app, database };
}

export async function getOnce(path: string): Promise<DataSnapshot> {
  await init();
  const snapshot = await get(ref(database, path));
  return snapshot.val();
}

export async function getOn<T>(
  path: string,
  callback: (args: T) => void,
): Promise<void> {
  await init();
  onValue(ref(database, path), (snapshot) => callback(snapshot.val()));
}

export async function getOff(path: string): Promise<void> {
  await init();
  return off(ref(database, path));
}

export async function set(path: string, value: unknown): Promise<void> {
  await init();
  return fbSet(ref(database, path), value);
}

export async function push(path: string): Promise<DatabaseReference> {
  await init();
  return fbPush(ref(database, path));
}

export async function getDatabaseInstance(): Promise<Database> {
  const { database } = await init();
  return database;
}

export function getOnOff<T>(
  path: string,
  callback: (args: T) => void,
): () => void {
  getOn(path, callback);
  return () => getOff(path);
}

const db = {
  getDatabaseInstance,
  getOn,
  getOnce,
  getOff,
  push,
  set,
};

export function useDB(): {
  inited: boolean;
  db: Record<string, unknown>;
} {
  const [inited, setInited] = useState(false);

  useEffect(() => {
    if (app) {
      setInited(true);
    } else {
      init().then(() => {
        setInited(true);
      });
    }
  }, []);

  return { inited, db };
}

export default db;
