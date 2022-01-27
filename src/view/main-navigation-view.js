import AbstractView from './abstract-view.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {name, count} = filter;

  // const activeClassName = isActive
  //   ? 'main-navigation__item--active'
  //   : '';

  return (
    `<a
      href="#${name}"
      class="main-navigation__item ${name === currentFilterType ? 'main-navigation__item--active' : ''}"
      style="text-transform: capitalize"
    >
      ${name}
    <span class="main-navigation__item-count">${count}</span></a>`
  );
};

const createMainNavigationTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class MainNavigationView extends AbstractView {
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
    this._callback.filterTypeChange(evt.target.value);
  }
}
