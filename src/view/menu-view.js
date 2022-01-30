import AbstractView from './abstract-view';
import {MenuItem} from '../const';
import {isClickOnLink} from '../utils/common';

const createMenuTemplate = () => (
  `<nav class="main-navigation">
    <a href="#stats" class="main-navigation__additional" data-menu-item="${MenuItem.STATISTICS}">Stats</a>
  </nav>`
);

export default class MenuView extends AbstractView {
  get template() {
    return createMenuTemplate();
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.addEventListener('click', this.#menuClickHandler);
  };

  #menuClickHandler = (evt) => {
    if (isClickOnLink(evt)) {
      return;
    }

    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menuItem);
  }
}
