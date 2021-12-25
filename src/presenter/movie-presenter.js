import {customAppendChild, customRemoveChild, remove, render} from '../utils/render.js';

import FilmCardView from '../view/film-card-view';
import FilmDetailsView from '../view/film-details-view';

export default class MoviePresenter {
  #movieListContainer = null;

  #movieCardComponent = null;
  #movieDetailsComponent = null;

  #movie = null;

  constructor(movieListContainer) {
    this.#movieListContainer = movieListContainer;
  }

  init = (movie) => {
    this.#movie = movie;

    this.#movieCardComponent = new FilmCardView(movie);
    this.#movieDetailsComponent = new FilmDetailsView(movie);

    this.#movieCardComponent.setPopupClickHandler(this.#handlePopupOpen);
    this.#movieDetailsComponent.setFormCloseHandler(this.#handlePopupClose);

    render(this.#movieListContainer, this.#movieCardComponent);
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

  #handlePopupClose = () => {
    this.#closePopup();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy = () => {
    remove(this.#movieCardComponent);
    remove(this.#movieDetailsComponent);
  }

}
