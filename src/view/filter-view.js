import AbstractView from './abstract-view.js';
import {MenuItem} from '../const';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (
    `<a
      href="#${type}"
      class="main-navigation__item ${currentFilterType === type ? 'main-navigation__item--active' : ''}"
      data-filter-type="${type}"
      data-menu-item="${MenuItem.MOVIES}"
    >
      ${name}
      <span class="main-navigation__item-count">${count}</span>
    </a>`
  );
};

const createMainNavigationTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>`;
};

export default class FilterView extends AbstractView {
  #filters  = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters  = filters ;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createMainNavigationTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }
}
