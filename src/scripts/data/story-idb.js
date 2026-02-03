import { openDB } from 'idb';

const DB_NAME = 'dicoding-story-db';
const DB_VERSION = 1;
const STORE_NAME = 'offline-stories';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, {
        keyPath: 'id',
        autoIncrement: true,
      });
    }
  },
});

export const StoryIDB = {
  async addStory(story) {
    return (await dbPromise).add(STORE_NAME, story);
  },

  async getAllStories() {
    return (await dbPromise).getAll(STORE_NAME);
  },

  async deleteStory(id) {
    return (await dbPromise).delete(STORE_NAME, id);
  },

  async clearStories() {
    return (await dbPromise).clear(STORE_NAME);
  },
};
