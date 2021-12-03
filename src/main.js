import {createHeaderProfileTemplate} from './view/header-profile-view';
import {renderTemplate, RenderPosition} from './render.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

renderTemplate(siteHeaderElement, createHeaderProfileTemplate(), RenderPosition.BEFOREEND);
