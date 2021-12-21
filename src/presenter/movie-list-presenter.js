import {render, RenderPosition} from '../utils/render.js';

import HeaderProfileView from '../view/header-profile-view';
import MainNavigationView from '../view/main-navigation-view';
import SortView from '../view/sort-view';
import NoFilmsView from '../view/no-films';
import FilmsView from '../view/films-view';
import FilmsListView from '../view/films-list-view';
import FilmCardView from '../view/film-card-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import FilmsListExtraView from '../view/films-list-extra-view';
import FooterStatisticsView from '../view/footer-statistics-view';
import FilmDetailsView from '../view/film-details-view';

const MOVIE_COUNT_PER_STEP = 5;

export default class MovieListPresenter {
  #mainContainer = null;

  #moviesSectionComponent = new FilmsView();
  #moviesListComponent = new FilmsListView();
  #sortComponent = new SortView();
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

  #renderMovieCard = (movie) => {
    // Метод, куда уйдёт логика созданию и рендерингу компонетов карточки фильма,
    // текущая функция renderFilmCard в main.js
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
    // Метод, куда уйдёт логика по отрисовке кнопки допоказа фильмов,
    // сейчас в main.js является частью renderFilmsContainer
  }

  #renderMainContainer = () => {
    // sort
    this.#renderSort();

    // content
    if (this.#movieCards.length === 0) {
      this.#renderNoMovies();
      return;
    }

    this.#renderMovieCards(0, Math.min(this.#movieCards.length, MOVIE_COUNT_PER_STEP));

    if (this.#movieCards.length > MOVIE_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }
}
