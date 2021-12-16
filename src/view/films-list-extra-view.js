import AbstractView from './abstract-view.js';

const createFilmsListExtraTemplate = (title) => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">${title}</h2>

    <div class="films-list__container">

    </div>
  </section>`
);

export default class FilmsListExtraView extends AbstractView {
  #title = null;

  constructor(title) {
    super();
    this.#title = title;
  }

  get template() {
    return createFilmsListExtraTemplate(this.#title);
  }
}
