import {renderTemplate, RenderPosition} from './render.js';

import {createHeaderProfileTemplate} from './view/header-profile-view';
import {createMainNavigationTemplate} from './view/main-navigation-view';
import {createSortTemplate} from './view/sort-view';
import {createFilmsListTemplate} from './view/films-list-view';
import {createFilmsListExtraTemplate} from './view/films-list-extra-view';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const filmsElement = siteMainElement.querySelector('.films');

// header
renderTemplate(siteHeaderElement, createHeaderProfileTemplate(), RenderPosition.BEFOREEND);

// sort & menu
renderTemplate(siteMainElement, createSortTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(siteMainElement, createMainNavigationTemplate(), RenderPosition.AFTERBEGIN);

// content
renderTemplate(filmsElement, createFilmsListTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(filmsElement, createFilmsListExtraTemplate(), RenderPosition.BEFOREEND);
