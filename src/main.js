import {renderTemplate, renderElement, RenderPosition} from './utils/render.js';

import HeaderProfileView from './view/header-profile-view';
import {createMainNavigationTemplate} from './view/main-navigation-view';
import SortView from './view/sort-view';
import FilmsView from './view/films-view';
import {createFilmCardTemplate} from './view/film-card-view';
import ShowMoreButtonView from './view/show-more-button-view';
import {createFilmsListExtraTemplate} from './view/films-list-extra-view';
import {createFooterStatisticsTemplate} from './view/footer-statistics-view';
// import {createFilmDetailsTemplate} from './view/film-details-view';

import {generateMovie} from './mock/movie';
import {generateFilter} from './mock/filter';

const MOVIE_COUNT = 20;
const MOVIE_COUNT_PER_STEP = 5;
const MOVIE_COUNT_EXTRA = 2;

const movies = Array.from({length: MOVIE_COUNT}, generateMovie);
const filters = generateFilter(movies);

const bodyElement = document.querySelector('body');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteMainElement = bodyElement.querySelector('.main');
const siteFooterStatisticsElement = bodyElement.querySelector('.footer__statistics');

// header
renderElement(siteHeaderElement, new HeaderProfileView().element);

// sort & menu
renderElement(siteMainElement, new SortView().element, RenderPosition.AFTERBEGIN);
renderTemplate(siteMainElement, createMainNavigationTemplate(filters), RenderPosition.AFTERBEGIN);

// content
// movie list
renderElement(siteMainElement, new FilmsView().element);

const filmsElement = siteMainElement.querySelector('.films');
const filmsListContainerElement = filmsElement.querySelector('.films-list__container');

// movie cards
const countPerStep = Math.min(movies.length, MOVIE_COUNT_PER_STEP);
for (let i = 0; i < countPerStep; i++) {
  renderTemplate(filmsListContainerElement, createFilmCardTemplate(movies[i]));
}

const filmsListElement = filmsElement.querySelector('.films-list');

// show more button
if (movies.length > MOVIE_COUNT_PER_STEP) {
  let renderedMovieCount = MOVIE_COUNT_PER_STEP;

  renderElement(filmsListElement, new ShowMoreButtonView().element);

  const showMoreButton = filmsListElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    movies
      .slice(renderedMovieCount, renderedMovieCount + MOVIE_COUNT_PER_STEP)
      .forEach((movie) => renderTemplate(filmsListContainerElement, createFilmCardTemplate(movie), RenderPosition.BEFOREEND));

    renderedMovieCount += MOVIE_COUNT_PER_STEP;

    if (renderedMovieCount >= movies.length) {
      showMoreButton.remove();
    }
  });
}

// extra movies
renderTemplate(filmsElement, createFilmsListExtraTemplate());

const filmListExtraElements = filmsElement.getElementsByClassName('films-list--extra');

// top rated movies
const topRatedFilmsListContainerElement = filmListExtraElements[0].querySelector('.films-list__container');
for (let i = 0; i < MOVIE_COUNT_EXTRA; i++) {
  renderTemplate(topRatedFilmsListContainerElement, createFilmCardTemplate(movies[i]));
}

// most commented movies
const mostCommentedFilmsListContainerElement = filmListExtraElements[1].querySelector('.films-list__container');
for (let i = 0; i < MOVIE_COUNT_EXTRA; i++) {
  renderTemplate(mostCommentedFilmsListContainerElement, createFilmCardTemplate(movies[i]));
}

// footer
renderTemplate(siteFooterStatisticsElement, createFooterStatisticsTemplate(movies), RenderPosition.AFTERBEGIN);

// popup
// renderTemplate(bodyElement, createFilmDetailsTemplate(movies[0]));
