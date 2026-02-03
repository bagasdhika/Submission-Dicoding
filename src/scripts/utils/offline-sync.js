import { StoryIDB } from '../data/story-idb';
import { addStory } from '../data/api';
import { getToken } from './auth';
import { showToast } from './toast';

const syncOfflineStories = async () => {
  const token = getToken();
  if (!token) return;

  const offlineStories = await StoryIDB.getAllStories();
  if (!offlineStories.length) return;

  for (const story of offlineStories) {
    try {
      const formData = new FormData();
      formData.append('description', story.description);
      formData.append('photo', story.photo);

      if (story.lat && story.lon) {
        formData.append('lat', story.lat);
        formData.append('lon', story.lon);
      }

      await addStory(formData, token);
      await StoryIDB.deleteStory(story.id);
    } catch (error) {
      console.error('Sync gagal:', error);
    }
  }

  showToast('Story offline berhasil disinkronkan', 'success');
};

export default syncOfflineStories;
