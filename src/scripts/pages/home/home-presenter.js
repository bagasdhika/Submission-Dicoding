import { getStories } from '../../data/api';

export default class HomePresenter {
  constructor({ view, token, map }) {
    this._view = view;
    this._token = token;
    this._map = map;
    this._markers = [];
  }

  async loadStories() {
    this._view.showLoading();

    let response;
    try {
      response = await getStories(this._token);
    } catch {
      this._view.showError('Gagal memuat data story');
      return;
    }

    if (!response?.listStory?.length) {
      this._view.showEmpty();
      return;
    }

    this._view.clear();

    response.listStory.forEach((story) => {
      const article = this._view.createStoryItem(story);

      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon])
          .addTo(this._map)
          .bindPopup(
            `<strong>${story.name}</strong><br>${story.description}`
          );

        this._markers.push(marker);

        const focusToMarker = () => {
          this._map.setView([story.lat, story.lon], 10, {
            animate: true,
          });

          this._markers.forEach((m) => m.closePopup());
          marker.openPopup();
        };

        article.addEventListener('click', focusToMarker);
        article.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') focusToMarker();
        });
      }

      this._view.listContainer.appendChild(article);
    });
  }
}
