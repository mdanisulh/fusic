import { openDB } from "idb";

const dbPromise = async () =>
  await openDB("Fusic", 1, {
    upgrade(db) {
      db.createObjectStore("state");
    },
  });

export async function idbGet(key: string, store = "state") {
  return (await dbPromise()).get(store, key);
}
export async function idbSet<T>(key: string, val: T, store = "state") {
  return (await dbPromise()).put(store, val, key);
}
export async function idbDel(key: string, store = "state") {
  return (await dbPromise()).delete(store, key);
}
export async function idbClear(store = "state") {
  return (await dbPromise()).clear(store);
}
export async function idbGetKeys(store = "state") {
  return (await dbPromise()).getAllKeys(store);
}
