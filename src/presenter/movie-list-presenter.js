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
    // Метод для инициализации (начала работы) модуля,
    // малая часть текущей функции renderBoard в main.js
  }

  #renderSort = () => {
    // Метод для рендеринга сортировки
  }

  #renderMovieCard = () => {
    // Метод, куда уйдёт логика созданию и рендерингу компонетов задачи,
    // текущая функция renderTask в main.js
  }

  #renderMovieCards = () => {
    // Метод для рендеринга N-задач за раз
  }

  #renderNoMovies = () => {
    // Метод для рендеринга заглушки
  }

  #renderShowMoreButton = () => {
    // Метод, куда уйдёт логика по отрисовке кнопки допоказа задач,
    // сейчас в main.js является частью renderBoard
  }

  #renderMovieList = () => {
    // Метод для инициализации (начала работы) модуля,
    // бОльшая часть текущей функции renderBoard в main.js
  }
}
