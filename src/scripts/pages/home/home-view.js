export default class HomeView {
  constructor({ mapContainerId, listContainerId }) {
    this.mapContainerId = mapContainerId;
    this.listContainer = document.getElementById(listContainerId);
  }

  showLoading() {
    this.listContainer.innerHTML = '<p>Memuat story...</p>';
    this.listContainer.setAttribute('aria-busy', 'true');
  }

  showError(message) {
    this.listContainer.innerHTML = `<p role="alert">${message}</p>`;
    this.listContainer.setAttribute('aria-busy', 'false');
  }

  showEmpty() {
    this.listContainer.innerHTML = '<p>Belum ada story</p>';
    this.listContainer.setAttribute('aria-busy', 'false');
  }

  clear() {
    this.listContainer.innerHTML = '';
    this.listContainer.setAttribute('aria-busy', 'false');
  }

  createStoryItem(story) {
    const article = document.createElement('article');
    article.className = 'story-card';
    article.tabIndex = 0;
    article.setAttribute('role', 'button');
    article.setAttribute(
      'aria-label',
      `Story oleh ${story.name}`
    );

    article.innerHTML = `
      <div class="story-header">
        <strong>${story.name}</strong>
      </div>

      <img
        src="${story.photoUrl}"
        alt="Foto story oleh ${story.name}"
        loading="lazy"
      />

      <div class="story-body">
        <p>${story.description}</p>
        <small>${new Date(
          story.createdAt
        ).toLocaleString()}</small>
      </div>
    `;

    return article;
  }
}
