import {customAppendChild, customRemoveChild, remove, render, RenderPosition} from '../utils/render.js';

import MainNavigationView from '../view/main-navigation-view';
import SortView from '../view/sort-view';
import NoFilmsView from '../view/no-films';
import FilmsView from '../view/films-view';
import FilmsListView from '../view/films-list-view';
import FilmCardView from '../view/film-card-view';
import ShowMoreButtonView from '../view/show-more-button-view';
// import FilmsListExtraView from '../view/films-list-extra-view';
import FilmDetailsView from '../view/film-details-view';

const MOVIE_COUNT_PER_STEP = 5;

export default class MovieListPresenter {
  #mainContainer = null;

  #moviesSectionComponent = new FilmsView();
  #moviesListComponent = new FilmsListView();
  #sortComponent = new SortView();
  #navigationComponent = new MainNavigationView();
  #noMoviesComponent = new NoFilmsView();

  #movieCards = [];

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

  #renderNavigation = () => {
    render(this.#moviesSectionComponent, this.#navigationComponent, RenderPosition.AFTERBEGIN);
  }

  #renderMovieCard = (movie) => {
    const bodyElement = document.querySelector('body');

    const movieCardComponent = new FilmCardView(movie);
    const movieDetailsComponent = new FilmDetailsView(movie);

    const openPopup = () => {
      customAppendChild(bodyElement, movieDetailsComponent);
      bodyElement.classList.add('hide-overflow');
    };

    const closePopup = () => {
      customRemoveChild(movieDetailsComponent);
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
    movieCardComponent.setPopupClickHandler(() => {
      openPopup(movie);
      document.addEventListener('keydown', onEscKeyDown);
    });

    // Клик по кнопке закрытия поп-апа
    movieDetailsComponent.setFormCloseHandler(() => {
      closePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(this.#moviesListComponent, movieCardComponent);
  }

  #renderMovieCards = (from, to) => {
    this.#movieCards
      .slice(from, to)
      .forEach((movieCard) => this.#renderMovieCard(movieCard));
  }

  #renderNoMovies = () => {
    render(this.#moviesSectionComponent, this.#noMoviesComponent);
  }

  #renderShowMoreButton = () => {
    let renderedMovieCount = MOVIE_COUNT_PER_STEP;

    const showMoreButtonComponent = new ShowMoreButtonView();

    render(this.#moviesListComponent, showMoreButtonComponent);

    showMoreButtonComponent.setClickHandler(() => {
      this.#movieCards
        .slice(renderedMovieCount, renderedMovieCount + MOVIE_COUNT_PER_STEP)
        .forEach((movieCard) => this.#renderMovieCard(movieCard));

      renderedMovieCount += MOVIE_COUNT_PER_STEP;

      if (renderedMovieCount >= this.#movieCards.length) {
        remove(showMoreButtonComponent);
      }
    });
  }

  #renderMovieList = () => {
    this.#renderMovieCards(0, Math.min(this.#movieCards.length, MOVIE_COUNT_PER_STEP));

    if (this.#movieCards.length > MOVIE_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderMainContainer = () => {
    // sort
    this.#renderSort();

    // menu
    this.#renderNavigation();

    // content
    if (this.#movieCards.length === 0) {
      this.#renderNoMovies();
      return;
    }

    this.#renderMovieList();

  }
}
