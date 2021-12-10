import {createElement} from '../utils/render';

const createFooterStatisticsTemplate = (movies) => `<p>${movies.length} movies inside</p>`;

export default class FooterStatisticsView {
  #element = null;
  #movies = null;

  constructor(movies) {
    this.#movies = movies;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFooterStatisticsTemplate(this.#movies);
  }

  removeElement() {
    this.#element = null;
  }
}
