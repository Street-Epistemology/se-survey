import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/analytics';
import 'firebase/auth';
import { useEffect, useState } from 'react';

async function init() {
  if (firebase.apps.length) return firebase;
  const response = await fetch('/__/firebase/init.json');
  if (firebase.apps.length) return firebase;
  const responseJSON = await response.json();
  if (firebase.apps.length) return firebase;
  firebase.initializeApp(responseJSON);
  firebase.analytics();
  firebase.auth();
  return firebase;
}

export async function getOnce(
  ref: string
): Promise<firebase.database.DataSnapshot> {
  return (await (await init()).database().ref(ref).once('value')).val();
}

export async function getOn(
  ref: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (args?: any) => void,
  config?: { orderByChild: string; equalTo: string | boolean }
): Promise<void> {
  const reference = (await init()).database().ref(ref);
  let lastRef;
  if (config?.orderByChild && config?.equalTo) {
    lastRef = reference
      .orderByChild(config.orderByChild)
      .equalTo(config.equalTo);
  } else {
    lastRef = reference;
  }
  lastRef.on('value', (snap) => callback(snap.val()));
}

export async function getOff(ref: string): Promise<void> {
  (await init()).database().ref(ref).off('value');
}

export async function set(ref: string, value: unknown): Promise<void> {
  (await init()).database().ref(ref).set(value);
}

export async function push(ref: string): Promise<firebase.database.Reference> {
  return (await init()).database().ref(ref).push();
}

export async function database(): Promise<firebase.database.Database> {
  return (await init()).database();
}

export function getOnOff(
  ref: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (args?: any) => void,
  config?: { orderByChild: string; equalTo: string | boolean }
): () => void {
  getOn(ref, callback, config);
  return () => {
    getOff(ref);
  };
}

const db = {
  database,
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
    if (firebase.apps.length) {
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
