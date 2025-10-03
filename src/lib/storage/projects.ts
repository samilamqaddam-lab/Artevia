import {openDB, type IDBPDatabase} from 'idb';

type ProjectStore = {
  id: string;
  name: string;
  productId: string;
  canvas: Record<string, unknown>;
  previewDataUrl?: string;
  updatedAt: number;
};

type ArteviaDB = IDBPDatabase<{projects: ProjectStore}>;

const DB_NAME = 'artevia-projects';
const STORE_NAME = 'projects';
const DB_VERSION = 1;

async function getDb(): Promise<ArteviaDB> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {keyPath: 'id'});
        store.createIndex('productId', 'productId', {unique: false});
        store.createIndex('updatedAt', 'updatedAt', {unique: false});
      }
    }
  }) as Promise<ArteviaDB>;
}

export async function upsertProject(project: ProjectStore) {
  const db = await getDb();
  await db.put(STORE_NAME, project);
}

export async function deleteProject(id: string) {
  const db = await getDb();
  await db.delete(STORE_NAME, id);
}

export async function getProject(id: string): Promise<ProjectStore | undefined> {
  const db = await getDb();
  return db.get(STORE_NAME, id) ?? undefined;
}

export async function listProjects(): Promise<ProjectStore[]> {
  const db = await getDb();
  const all = await db.getAll(STORE_NAME);
  return all.sort((a, b) => b.updatedAt - a.updatedAt);
}

export type {ProjectStore};
