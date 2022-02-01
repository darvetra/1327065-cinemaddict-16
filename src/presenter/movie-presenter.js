import {customAppendChild, customRemoveChild, remove, render, replace} from '../utils/render.js';
import {UserAction, UpdateType} from '../const';

import FilmCardView from '../view/film-card-view';
import FilmDetailsView from '../view/film-details-view';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class MoviePresenter {
  #movieListContainer = null;
  #changeData = null;
  #changeMode = null;
  #commentsModel = null;

  #movieCardComponent = null;
  #movieDetailsComponent = null;

  #movie = null;
  #mode = Mode.DEFAULT

  constructor(movieListContainer, changeData, changeMode, commentsModel) {
    this.#movieListContainer = movieListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#commentsModel = commentsModel;
  }

  init = (movie) => {
    this.#movie = movie;

    const prevMovieCardComponent = this.#movieCardComponent;
    const prevMovieDetailsComponent = this.#movieDetailsComponent;

    this.#movieCardComponent = new FilmCardView(movie);

    this.#movieCardComponent.setPopupClickHandler(this.#handlePopupOpen);
    this.#movieCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#movieCardComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#movieCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevMovieCardComponent === null || prevMovieDetailsComponent === null) {
      render(this.#movieListContainer, this.#movieCardComponent);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (this.#mode === Mode.DEFAULT) {
      replace(this.#movieCardComponent, prevMovieCardComponent);
    }

    if (this.#mode === Mode.POPUP) {
      replace(this.#movieDetailsComponent, prevMovieDetailsComponent);
      replace(this.#movieCardComponent, prevMovieCardComponent);
    }

    remove(prevMovieCardComponent);
    remove(prevMovieDetailsComponent);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#movieDetailsComponent.reset(this.#movie);
      this.#closePopup();
    }
  }

  #openPopup = async () => {
    let movieComments;
    try {
      movieComments = await this.#commentsModel.loadComments(this.#movie.id);
    } catch (err) {
      movieComments = [];
    }

    this.#movieDetailsComponent = new FilmDetailsView(this.#movie, movieComments);

    const bodyElement = document.querySelector('body');
    customAppendChild(bodyElement, this.#movieDetailsComponent);
    bodyElement.classList.add('hide-overflow');
    this.#changeMode();
    this.#mode = Mode.POPUP;

    this.#movieDetailsComponent.setPopupCloseHandler(this.#handlePopupClose);
    this.#movieDetailsComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#movieDetailsComponent.setDeleteCommentClickHandler(this.#handleDeleteComment);
  };

  #closePopup = () => {
    const bodyElement = document.querySelector('body');
    customRemoveChild(this.#movieDetailsComponent);
    bodyElement.classList.remove('hide-overflow');
    this.#mode = Mode.DEFAULT;
  };

  #deleteComment = (movie, id) => {
    const comments = movie.comments.filter((comment) => comment.id !== id);
    delete movie.comments;
    movie.comments = comments;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#movieDetailsComponent.reset(this.#movie);
      this.#closePopup();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #ctrlEnterKeyDownHandler = (evt) => {
    if (evt.ctrlKey && evt.keyCode === 13) {
      evt.preventDefault();
      this.#handleFormSubmit();
    }
  };

  #handlePopupOpen = () => {
    this.#openPopup();
    document.addEventListener('keydown', this.#escKeyDownHandler);
    document.addEventListener('keydown', this.#ctrlEnterKeyDownHandler);
  }

  #handleWatchlistClick = () => {
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this.#movie, userDetails: {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist}}
    );
  }

  #handleAlreadyWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this.#movie, userDetails: {...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched}}
    );
  }

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this.#movie, userDetails: {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite}},
    );
  }

  #handlePopupClose = () => {
    this.#closePopup();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    document.removeEventListener('keydown', this.#ctrlEnterKeyDownHandler);
  }


  #handleFormSubmit = () => {
    this.#movieDetailsComponent.addComment();

    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      this.#movie,
    );
  }

  #handleDeleteComment = (id) => {
    this.#deleteComment(this.#movie, id);

    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      this.#movie,
    );
  }

  destroy = () => {
    remove(this.#movieCardComponent);
    remove(this.#movieDetailsComponent);
  }

}
