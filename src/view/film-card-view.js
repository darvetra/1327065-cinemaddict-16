import AbstractView from './abstract-view.js';
import {convertYearDate} from '../utils/date';

const createFilmCardTemplate = (movie = {}) => {
  const {filmInfo, comments, userDetails} = movie;
  const {title, totalRating, poster, release, runtime, genre, description} = filmInfo;
  const {watchlist, alreadyWatched, favorite} = userDetails;

  const releaseDate = convertYearDate(release.date);
  const mainGenre = genre.slice(0, 1);
  const commentsLength = comments.length;

  const watchListClassName = watchlist
    ? 'film-card__controls-item--add-to-watchlist film-card__controls-item--active'
    : 'film-card__controls-item--add-to-watchlist';

  const watchedClassName = alreadyWatched
    ? 'film-card__controls-item--mark-as-watched film-card__controls-item--active'
    : 'film-card__controls-item--mark-as-watched';

  const favoriteClassName = favorite
    ? 'film-card__controls-item--favorite film-card__controls-item--active'
    : 'film-card__controls-item--favorite';

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate}</span>
        <span class="film-card__duration">${runtime}m</span>
        <span class="film-card__genre">${mainGenre}</span>
      </p>
      <img src="./images/posters/${poster}" alt="${title}" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <span class="film-card__comments">${commentsLength} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item ${watchListClassName}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item ${watchedClassName}" type="button">Mark as watched</button>
      <button class="film-card__controls-item ${favoriteClassName}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCardView extends AbstractView {
  #movie  = null;

  constructor(movie) {
    super();
    this.#movie  = movie ;
  }

  get template() {
    return createFilmCardTemplate(this.#movie);
  }

  setPopupClickHandler = (callback) => {
    this._callback.popupClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#popupClickHandler);
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  #popupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.popupClick();
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
