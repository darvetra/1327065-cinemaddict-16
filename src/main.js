import {renderTemplate, RenderPosition} from './utils/render.js';

import {createHeaderProfileTemplate} from './view/header-profile-view';
import {createMainNavigationTemplate} from './view/main-navigation-view';
import {createSortTemplate} from './view/sort-view';
import {createFilmsTemplate} from './view/films-view';
import {createFilmCardTemplate} from './view/film-card-view';
import {createShowMoreButtonTemplate} from './view/show-more-button-view';
import {createFilmsListExtraTemplate} from './view/films-list-extra-view';
import {createFooterStatisticsTemplate} from './view/footer-statistics-view';
// import {createFilmDetailsTemplate} from './view/film-details-view';

import {generateMovie} from './mock/movie';
import {generateFilter} from './mock/filter';

const MOVIE_COUNT = 5;

const movies = Array.from({length: MOVIE_COUNT}, generateMovie);
const filters = generateFilter(movies);

const bodyElement = document.querySelector('body');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteMainElement = bodyElement.querySelector('.main');
const siteFooterStatisticsElement = bodyElement.querySelector('.footer__statistics');

// header
renderTemplate(siteHeaderElement, createHeaderProfileTemplate());

// sort & menu
renderTemplate(siteMainElement, createSortTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(siteMainElement, createMainNavigationTemplate(filters), RenderPosition.AFTERBEGIN);

// content
// films list
renderTemplate(siteMainElement, createFilmsTemplate());

const filmsElement = siteMainElement.querySelector('.films');
const filmsListContainerElement = filmsElement.querySelector('.films-list__container');

for (let i = 0; i < MOVIE_COUNT; i++) {
  renderTemplate(filmsListContainerElement, createFilmCardTemplate(movies[i]));
}

// show more button
const filmsListElement = filmsElement.querySelector('.films-list');
renderTemplate(filmsListElement, createShowMoreButtonTemplate());

// extra films
renderTemplate(filmsElement, createFilmsListExtraTemplate());

// footer
renderTemplate(siteFooterStatisticsElement, createFooterStatisticsTemplate(movies), RenderPosition.AFTERBEGIN);

// popup
// renderTemplate(bodyElement, createFilmDetailsTemplate(movies[0]));

// eslint-disable-next-line no-console
console.log(movies);
// eslint-disable-next-line no-console
console.log(filters);
