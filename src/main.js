import {render, remove, RenderPosition} from './utils/render.js';
import {MenuItem} from './const';

import MoviesModel from './model/movies-model';
import FilterModel from './model/filter-model';

import HeaderProfileView from './view/header-profile-view';
import MenuView from './view/menu-view';
// import FooterStatisticsView from './view/footer-statistics-view';
import StatsView from './view/stats-view';

import MainPresenter from './presenter/main-presenter';
import FilterPresenter from './presenter/filter-presenter';

import ApiService from './api-service.js';

const AUTHORIZATION = 'Basic gogol-mogol';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict/';

const bodyElement = document.querySelector('body');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteMainElement = bodyElement.querySelector('.main');
// const siteFooterStatisticsElement = bodyElement.querySelector('.footer__statistics');

const moviesModel = new MoviesModel(new ApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

render(siteHeaderElement, new HeaderProfileView());
const menuComponent = new MenuView();

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

filterPresenter.init();
mainPresenter.init();

moviesModel.init().finally(() => {
  render(siteMainElement, menuComponent);
  menuComponent.setMenuClickHandler(handleSiteMenuClick);
});

// временно закомментировал
// render(siteFooterStatisticsElement, new FooterStatisticsView(movies), RenderPosition.AFTERBEGIN);
