import {customAppendChild, customRemoveChild, remove, render, replace} from '../utils/render.js';

import FilmCardView from '../view/film-card-view';
import FilmDetailsView from '../view/film-details-view';

export default class MoviePresenter {
  #movieListContainer = null;
  #changeData = null;

  #movieCardComponent = null;
  #movieDetailsComponent = null;

  #movie = null;

  constructor(movieListContainer, changeData) {
    this.#movieListContainer = movieListContainer;
    this.#changeData = changeData;
  }

  init = (movie) => {
    this.#movie = movie;

    const prevMovieCardComponent = this.#movieCardComponent;
    const prevMovieDetailsComponent = this.#movieDetailsComponent;

    this.#movieCardComponent = new FilmCardView(movie);
    this.#movieDetailsComponent = new FilmDetailsView(movie);

    this.#movieCardComponent.setPopupClickHandler(this.#handlePopupOpen);
    this.#movieCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#movieCardComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#movieCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#movieDetailsComponent.setPopupCloseHandler(this.#handlePopupClose);

    if (prevMovieCardComponent === null || prevMovieDetailsComponent === null) {
      render(this.#movieListContainer, this.#movieCardComponent);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (this.#movieListContainer.element.contains(prevMovieCardComponent.element)) {
      replace(this.#movieCardComponent, prevMovieCardComponent);
    }

    if (this.#movieListContainer.element.contains(prevMovieDetailsComponent.element)) {
      replace(this.#movieDetailsComponent, prevMovieDetailsComponent);
    }

    remove(prevMovieCardComponent);
    remove(prevMovieDetailsComponent);
  }

  #openPopup = () => {
    const bodyElement = document.querySelector('body');
    customAppendChild(bodyElement, this.#movieDetailsComponent);
    bodyElement.classList.add('hide-overflow');
  };

  #closePopup = () => {
    const bodyElement = document.querySelector('body');
    customRemoveChild(this.#movieDetailsComponent);
    bodyElement.classList.remove('hide-overflow');
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handlePopupOpen = () => {
    this.#openPopup();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleWatchlistClick = () => {
    this.#changeData({...this.#movie, userDetails: {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist}});
  }

  #handleAlreadyWatchedClick = () => {
    this.#changeData({...this.#movie, userDetails: {...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched}});
  }

  #handleFavoriteClick = () => {
    this.#changeData({...this.#movie, userDetails: {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite}});
  }

  #handlePopupClose = () => {
    this.#closePopup();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy = () => {
    remove(this.#movieCardComponent);
    remove(this.#movieDetailsComponent);
  }

}
