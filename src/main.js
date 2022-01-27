import {render, RenderPosition} from './utils/render.js';

import MoviesModel from './model/movies-model';
import FilterModel from './model/filter-model';

import HeaderProfileView from './view/header-profile-view';
import MainNavigationView from './view/main-navigation-view';
import FooterStatisticsView from './view/footer-statistics-view';

import MovieListPresenter from './presenter/movie-list-presenter';

import {generateMovie} from './mock/movie';

const MOVIE_COUNT = 20;

const movies = Array.from({length: MOVIE_COUNT}, generateMovie);
const filters = [
  {
    type: 'all',
    name: 'ALL',
    count: 0,
  },
];

const moviesModel = new MoviesModel();
moviesModel.movies = movies;

const filterModel = new FilterModel();

const bodyElement = document.querySelector('body');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteMainElement = bodyElement.querySelector('.main');
const siteFooterStatisticsElement = bodyElement.querySelector('.footer__statistics');

const movieListPresenter = new MovieListPresenter(siteMainElement, moviesModel);

// header
render(siteHeaderElement, new HeaderProfileView());

// menu
render(siteMainElement, new MainNavigationView(filters, 'all'), RenderPosition.AFTERBEGIN);

// content
movieListPresenter.init();

// footer
render(siteFooterStatisticsElement, new FooterStatisticsView(movies), RenderPosition.AFTERBEGIN);
