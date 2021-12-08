import {render, RenderPosition} from './utils/render.js';

import HeaderProfileView from './view/header-profile-view';
import MainNavigationView from './view/main-navigation-view';
import SortView from './view/sort-view';
import FilmsView from './view/films-view';
import FilmCardView from './view/film-card-view';
import ShowMoreButtonView from './view/show-more-button-view';
import FilmsListExtraView from './view/films-list-extra-view';
import FooterStatisticsView from './view/footer-statistics-view';
// import FilmDetailsView from './view/film-details-view';

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
render(siteHeaderElement, new HeaderProfileView().element);

// sort & menu
render(siteMainElement, new SortView().element, RenderPosition.AFTERBEGIN);
render(siteMainElement, new MainNavigationView(filters).element, RenderPosition.AFTERBEGIN);

// content
// movie list
render(siteMainElement, new FilmsView().element);

const filmsElement = siteMainElement.querySelector('.films');
const filmsListContainerElement = filmsElement.querySelector('.films-list__container');

// movie cards
const countPerStep = Math.min(movies.length, MOVIE_COUNT_PER_STEP);
for (let i = 0; i < countPerStep; i++) {
  render(filmsListContainerElement, new FilmCardView(movies[i]).element);
}

const filmsListElement = filmsElement.querySelector('.films-list');

// show more button
if (movies.length > MOVIE_COUNT_PER_STEP) {
  let renderedMovieCount = MOVIE_COUNT_PER_STEP;

  render(filmsListElement, new ShowMoreButtonView().element);

  const showMoreButton = filmsListElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    movies
      .slice(renderedMovieCount, renderedMovieCount + MOVIE_COUNT_PER_STEP)
      .forEach((movie) => render(filmsListContainerElement, new FilmCardView(movie).element, RenderPosition.BEFOREEND));

    renderedMovieCount += MOVIE_COUNT_PER_STEP;

    if (renderedMovieCount >= movies.length) {
      showMoreButton.remove();
    }
  });
}

// extra movies
render(filmsElement, new FilmsListExtraView('Top rated').element);
render(filmsElement, new FilmsListExtraView('Most commented').element);

const filmListExtraElements = filmsElement.getElementsByClassName('films-list--extra');

// top rated movies
const topRatedFilmsListContainerElement = filmListExtraElements[0].querySelector('.films-list__container');
for (let i = 0; i < MOVIE_COUNT_EXTRA; i++) {
  render(topRatedFilmsListContainerElement, new FilmCardView(movies[i]).element);
}

// most commented movies
const mostCommentedFilmsListContainerElement = filmListExtraElements[1].querySelector('.films-list__container');
for (let i = 0; i < MOVIE_COUNT_EXTRA; i++) {
  render(mostCommentedFilmsListContainerElement, new FilmCardView(movies[i]).element);
}

// footer
render(siteFooterStatisticsElement, new FooterStatisticsView(movies).element, RenderPosition.AFTERBEGIN);

// popup
// render(bodyElement, new FilmDetailsView(movies[0]).element);
