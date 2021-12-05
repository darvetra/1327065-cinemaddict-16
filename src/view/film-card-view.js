import {convertYearDate} from '../utils/date';

export const createFilmCardTemplate = (movie = {}) => {
  const {filmInfo, comments, userDetails} = movie;

  const title = filmInfo.title;
  const totalRating = filmInfo.totalRating;
  const releaseDate = convertYearDate(filmInfo.release.date);
  const runtime = filmInfo.runtime;
  const genre = filmInfo.genre.slice(0, 1);
  const poster = filmInfo.poster;
  const description = filmInfo.description;
  const commentsLength = comments.length;

  const watchListClassName = userDetails.watchlist
    ? 'film-card__controls-item--add-to-watchlist film-card__controls-item--active'
    : 'film-card__controls-item--add-to-watchlist';

  const watchedClassName = userDetails.alreadyWatched
    ? 'film-card__controls-item--mark-as-watched film-card__controls-item--active'
    : 'film-card__controls-item--mark-as-watched';

  const favoriteClassName = userDetails.favorite
    ? 'film-card__controls-item--favorite film-card__controls-item--active'
    : 'film-card__controls-item--favorite';

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate}</span>
        <span class="film-card__duration">${runtime}m</span>
        <span class="film-card__genre">${genre}</span>
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
