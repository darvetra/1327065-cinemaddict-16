import {render, remove, RenderPosition} from './utils/render.js';
import {MenuItem} from './const';

import MoviesModel from './model/movies-model';
import FilterModel from './model/filter-model';

import HeaderProfileView from './view/header-profile-view';
import MenuView from './view/menu-view';
import FooterStatisticsView from './view/footer-statistics-view';
import StatsView from './view/stats-view';

import MainPresenter from './presenter/main-presenter';
import FilterPresenter from './presenter/filter-presenter';

import ApiService from './api-service.js';

import {generateMovie} from './mock/movie';

const MOVIE_COUNT = 20;
const AUTHORIZATION = 'Basic gogol-mogol';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict/';

const movies = Array.from({length: MOVIE_COUNT}, generateMovie);

const moviesModel = new MoviesModel(new ApiService(END_POINT, AUTHORIZATION));
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

let statisticsComponent = null;

const clearPage = () => {
  mainPresenter.destroy();
  remove(statisticsComponent);
};

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.MOVIES:
      clearPage();
      mainPresenter.init();
      break;
    case MenuItem.STATISTICS:
      clearPage();
      statisticsComponent = new StatsView(moviesModel.movies);
      render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

menuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
mainPresenter.init();

render(siteFooterStatisticsElement, new FooterStatisticsView(movies), RenderPosition.AFTERBEGIN);
