import {render, RenderPosition} from './utils/render.js';
import {MenuItem} from './const';

import MoviesModel from './model/movies-model';
import FilterModel from './model/filter-model';

import HeaderProfileView from './view/header-profile-view';
import MenuView from './view/menu-view';
import FooterStatisticsView from './view/footer-statistics-view';
import StatsView from './view/stats-view';

import MainPresenter from './presenter/main-presenter';
// на время отладки
// import FilterPresenter from './presenter/filter-presenter';

import {generateMovie} from './mock/movie';

const MOVIE_COUNT = 20;

const movies = Array.from({length: MOVIE_COUNT}, generateMovie);

const moviesModel = new MoviesModel();
moviesModel.movies = movies;

const filterModel = new FilterModel();

const bodyElement = document.querySelector('body');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteMainElement = bodyElement.querySelector('.main');
const siteFooterStatisticsElement = bodyElement.querySelector('.footer__statistics');

render(siteHeaderElement, new HeaderProfileView());
const menuComponent = new MenuView();
render(siteMainElement, menuComponent);

const mainPresenter = new MainPresenter(siteMainElement, moviesModel, filterModel);
// на время отладки
// const filterPresenter = new FilterPresenter(menuComponent, filterModel, moviesModel);

const clearPage = () => {
  mainPresenter.destroy();
};

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.MOVIES:
      clearPage();
      mainPresenter.init();
      // Скрыть статистику
      break;
    case MenuItem.STATISTICS:
      clearPage();
      // Показать статистику
      break;
  }
};

menuComponent.setMenuClickHandler(handleSiteMenuClick);

// Для удобства отладки скроем Фильтры и доску
// filterPresenter.init();
// mainPresenter.init();
// и отобразим сразу статистику
render(siteMainElement, new StatsView(moviesModel.movies), RenderPosition.BEFOREEND);

render(siteFooterStatisticsElement, new FooterStatisticsView(movies), RenderPosition.AFTERBEGIN);
