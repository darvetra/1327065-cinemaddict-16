import {render, RenderPosition} from './utils/render.js';
import {MenuItem} from './const';

import MoviesModel from './model/movies-model';
import FilterModel from './model/filter-model';

import HeaderProfileView from './view/header-profile-view';
import MenuView from './view/menu-view';
import FooterStatisticsView from './view/footer-statistics-view';

import MainPresenter from './presenter/main-presenter';
import FilterPresenter from './presenter/filter-presenter';

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
const filterPresenter = new FilterPresenter(menuComponent, filterModel, moviesModel);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.MOVIES:
      // Показать фильтры
      // Показать доску
      mainPresenter.init();
      // Скрыть статистику
      break;
    case MenuItem.STATISTICS:
      // Скрыть фильтры
      // Скрыть доску
      mainPresenter.destroy();
      // Показать статистику
      break;
  }
};

menuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
mainPresenter.init();

render(siteFooterStatisticsElement, new FooterStatisticsView(movies), RenderPosition.AFTERBEGIN);
