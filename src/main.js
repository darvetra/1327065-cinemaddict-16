import {render, RenderPosition} from './utils/render.js';

import MovieListPresenter from './presenter/movie-list-presenter';

import HeaderProfileView from './view/header-profile-view';
import MainNavigationView from './view/main-navigation-view';
import FooterStatisticsView from './view/footer-statistics-view';

import {generateMovie} from './mock/movie';
import {generateFilter} from './mock/filter';

const MOVIE_COUNT = 20;

const movies = Array.from({length: MOVIE_COUNT}, generateMovie);
const filters = generateFilter(movies);

const bodyElement = document.querySelector('body');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteMainElement = bodyElement.querySelector('.main');
const siteFooterStatisticsElement = bodyElement.querySelector('.footer__statistics');

const movieListPresenter = new MovieListPresenter(siteMainElement);

// header
render(siteHeaderElement, new HeaderProfileView());

// menu
render(siteMainElement, new MainNavigationView(filters), RenderPosition.AFTERBEGIN);

// content
movieListPresenter.init(movies);

// footer
render(siteFooterStatisticsElement, new FooterStatisticsView(movies), RenderPosition.AFTERBEGIN);
