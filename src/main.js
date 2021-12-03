import {renderTemplate, RenderPosition} from './render.js';

import {createHeaderProfileTemplate} from './view/header-profile-view';
import {createMainNavigationTemplate} from './view/main-navigation-view';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

renderTemplate(siteHeaderElement, createHeaderProfileTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createMainNavigationTemplate(), RenderPosition.AFTERBEGIN);
