import {renderTemplate, RenderPosition} from './render.js';

import {createHeaderProfileTemplate} from './view/header-profile-view';
import {createMainNavigationTemplate} from './view/main-navigation-view';
import {createSortTemplate} from './view/sort-view';
import {createFilmsListTemplate} from './view/films-list-view';
import {createFilmCardTemplate} from './view/film-card-view';
import {createShowMoreButtonTemplate} from './view/show-more-button-view';
import {createFilmsListExtraTemplate} from './view/films-list-extra-view';
import {createFooterStatisticsTemplate} from './view/footer-statistics-view';
import {createFilmDetailsTemplate} from './view/film-details-view';

const bodyElement = document.querySelector('body');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteMainElement = bodyElement.querySelector('.main');
const siteFooterStatisticsElement = bodyElement.querySelector('.footer__statistics');
const filmsElement = siteMainElement.querySelector('.films');

// header
renderTemplate(siteHeaderElement, createHeaderProfileTemplate(), RenderPosition.BEFOREEND);

// sort & menu
renderTemplate(siteMainElement, createSortTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(siteMainElement, createMainNavigationTemplate(), RenderPosition.AFTERBEGIN);

// content
// films list
renderTemplate(filmsElement, createFilmsListTemplate(), RenderPosition.AFTERBEGIN);

const filmsListContainerElement = filmsElement.querySelector('.films-list__container');
renderTemplate(filmsListContainerElement, createFilmCardTemplate(), RenderPosition.BEFOREEND);
renderTemplate(filmsListContainerElement, createFilmCardTemplate(), RenderPosition.BEFOREEND);
renderTemplate(filmsListContainerElement, createFilmCardTemplate(), RenderPosition.BEFOREEND);
renderTemplate(filmsListContainerElement, createFilmCardTemplate(), RenderPosition.BEFOREEND);
renderTemplate(filmsListContainerElement, createFilmCardTemplate(), RenderPosition.BEFOREEND);

// show more buttton
const filmsListElement = filmsElement.querySelector('.films-list');
renderTemplate(filmsListElement, createShowMoreButtonTemplate(), RenderPosition.BEFOREEND);

// extra films
renderTemplate(filmsElement, createFilmsListExtraTemplate(), RenderPosition.BEFOREEND);

// footer
renderTemplate(siteFooterStatisticsElement, createFooterStatisticsTemplate(), RenderPosition.AFTERBEGIN);

// popup
renderTemplate(bodyElement, createFilmDetailsTemplate(), RenderPosition.BEFOREEND);
