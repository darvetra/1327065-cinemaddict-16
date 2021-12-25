import {customAppendChild, customRemoveChild, remove, render, RenderPosition} from '../utils/render.js';

import SortView from '../view/sort-view';
import NoFilmsView from '../view/no-films';
import FilmsView from '../view/films-view';
import FilmsListView from '../view/films-list-view';
import FilmCardView from '../view/film-card-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import FilmsListExtraView from '../view/films-list-extra-view';
import FilmDetailsView from '../view/film-details-view';

const MOVIE_COUNT_PER_STEP = 5;
const MOVIE_COUNT_EXTRA = 2;

export default class MovieListPresenter {
  #mainContainer = null;

  #movieCardComponent = null;
  #movieDetailsComponent = null;

  #moviesSectionComponent = new FilmsView();
  #moviesListComponent = new FilmsListView();
  #sortComponent = new SortView();
  #noMoviesComponent = new NoFilmsView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #movieCards = [];
  #renderedMovieCount = MOVIE_COUNT_PER_STEP;

  constructor(mainContainer) {
    this.#mainContainer = mainContainer;
  }

  init = (movieCards) => {
    this.#movieCards = [...movieCards];

    render(this.#mainContainer, this.#moviesSectionComponent);

    const filmsListElement = this.#mainContainer.querySelector('.films-list');
    render(filmsListElement, this.#moviesListComponent);

    this.#renderMainContainer();
  }

  #renderSort = () => {
    render(this.#moviesSectionComponent, this.#sortComponent, RenderPosition.AFTERBEGIN);
  }


  #renderMovieCard = (movie, container) => {
    const bodyElement = document.querySelector('body');

    this.#movieCardComponent = new FilmCardView(movie);
    this.#movieDetailsComponent = new FilmDetailsView(movie);

    const openPopup = () => {
      customAppendChild(bodyElement, this.#movieCardComponent);
      bodyElement.classList.add('hide-overflow');
    };

    const closePopup = () => {
      customRemoveChild(this.#movieDetailsComponent);
      bodyElement.classList.remove('hide-overflow');
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        closePopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    // клик по ссылке (открытие поп-апа)
    this.#movieCardComponent.setPopupClickHandler(() => {
      openPopup(movie);
      document.addEventListener('keydown', onEscKeyDown);
    });

    // Клик по кнопке закрытия поп-апа
    this.#movieDetailsComponent.setFormCloseHandler(() => {
      closePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    if (container === undefined) {
      render(this.#moviesListComponent, this.#movieCardComponent);
      return;
    }

    render(container, this.#movieCardComponent);
  }

  #renderMovieCards = (from, to) => {
    this.#movieCards
      .slice(from, to)
      .forEach((movieCard) => this.#renderMovieCard(movieCard));
  }

  #renderNoMovies = () => {
    render(this.#moviesSectionComponent, this.#noMoviesComponent);
  }

  #handleShowMoreButtonClick = () => {
    this.#renderMovieCards(this.#renderedMovieCount, this.#renderedMovieCount + MOVIE_COUNT_PER_STEP);
    this.#renderedMovieCount += MOVIE_COUNT_PER_STEP;

    if (this.#renderedMovieCount >= this.#movieCards.length) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {
    // Дублируется поиск filmsListElement через querySelector. Создать отдельную вьюху?
    const filmsListElement = this.#mainContainer.querySelector('.films-list');
    render(filmsListElement, this.#showMoreButtonComponent);

    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
  }

  #renderExtraMovies = () => {
    const filmsElement = this.#mainContainer.querySelector('.films');

    render(filmsElement, new FilmsListExtraView('Top rated'));
    render(filmsElement, new FilmsListExtraView('Most commented'));

    const filmListExtraElements = filmsElement.getElementsByClassName('films-list--extra');

    // top rated movies
    const topRatedFilmsListContainerElement = filmListExtraElements[0].querySelector('.films-list__container');
    for (let i = 0; i < MOVIE_COUNT_EXTRA; i++) {
      this.#renderMovieCard(this.#movieCards[i], topRatedFilmsListContainerElement);
    }

    // most commented movies
    const mostCommentedFilmsListContainerElement = filmListExtraElements[1].querySelector('.films-list__container');
    for (let i = 0; i < MOVIE_COUNT_EXTRA; i++) {
      this.#renderMovieCard(this.#movieCards[i], mostCommentedFilmsListContainerElement);
    }
  }

  #renderMovieList = () => {
    this.#renderMovieCards(0, Math.min(this.#movieCards.length, MOVIE_COUNT_PER_STEP));

    if (this.#movieCards.length > MOVIE_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  destroy = () => {
    remove(this.#movieCardComponent);
    remove(this.#movieDetailsComponent);
  }

  #renderMainContainer = () => {
    // sort
    this.#renderSort();

    // content
    if (this.#movieCards.length === 0) {
      this.#renderNoMovies();
      return;
    }

    this.#renderMovieList();

    this.#renderExtraMovies();
  }
}
