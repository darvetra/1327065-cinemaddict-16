import AbstractView from './abstract-view.js';

const createFooterStatisticsTemplate = (movies) => `<p>${movies.length} movies inside</p>`;

export default class FooterStatisticsView extends AbstractView {
  #movies = null;

  constructor(movies) {
    super();
    this.#movies = movies;
  }

  get template() {
    return createFooterStatisticsTemplate(this.#movies);
  }
}
