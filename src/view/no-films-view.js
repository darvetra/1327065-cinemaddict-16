import AbstractView from './abstract-view';
import {FilterType} from '../const';

const NoFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createNoFilmsTemplate = (filterType) => {
  const noFilmTextValue = NoFilmsTextType[filterType];

  return (`<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">${noFilmTextValue}</h2>
    </section>
  </section>`);
};

export default class NoFilmsView extends AbstractView{
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createNoFilmsTemplate(this._data);
  }
}
