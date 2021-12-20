import {render, RenderPosition} from '../utils/render.js';

import HeaderProfileView from '../view/header-profile-view';
import MainNavigationView from '../view/main-navigation-view';
import SortView from '../view/sort-view';
import NoFilmsView from '../view/no-films';
import FilmsView from '../view/films-view';
import FilmCardView from '../view/film-card-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import FilmsListExtraView from '../view/films-list-extra-view';
import FooterStatisticsView from '../view/footer-statistics-view';
import FilmDetailsView from '../view/film-details-view';

const MOVIE_COUNT_PER_STEP = 5;

export default class MovieListPresenter {
  #contentContainer = null;

  #movieListComponent = new FilmsView();
  #sortComponent = new SortView();
  #noMoviesComponent = new NoFilmsView();

  #movieCards = [];

  constructor(contentContainer) {
    this.#contentContainer = contentContainer;
  }

  init = (movieCards) => {
    this.#movieCards = [...movieCards];

    render(this.#contentContainer, this.#movieListComponent);

    this.#renderMovieList();
  }

  #renderSort = () => {
    // Метод для рендеринга сортировки
  }

  #renderMovieCard = () => {
    // Метод, куда уйдёт логика созданию и рендерингу компонетов задачи,
    // текущая функция renderTask в main.js
  }

  #renderMovieCards = (from, to) => {
    // Метод для рендеринга N-задач за раз
  }

  #renderNoMovies = () => {
    // Метод для рендеринга заглушки
  }

  #renderShowMoreButton = () => {
    // Метод, куда уйдёт логика по отрисовке кнопки допоказа задач,
    // сейчас в main.js является частью renderBoard
  }

  //#renderMainElement ???
  #renderMovieList = () => {
    // sort
    this.#renderSort();

    // content
    const filmsElement = this.#contentContainer.querySelector('.films');
    const filmsListContainerElement = filmsElement.querySelector('.films-list__container');

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
