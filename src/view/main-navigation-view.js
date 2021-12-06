const createFilterItemTemplate = (filter, isActive) => {
  const {name, count} = filter;

  const activeClassName = isActive
    ? 'main-navigation__item--active'
    : '';

  return (
    `<a href="#${name}" class="main-navigation__item ${activeClassName}" style="text-transform: capitalize">${name} <span class="main-navigation__item-count">${count}</span></a>`
  );
};

export const createMainNavigationTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};
