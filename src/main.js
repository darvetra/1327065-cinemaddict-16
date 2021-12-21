import {render, remove, RenderPosition, customRemoveChild, customAppendChild} from './utils/render.js';

import HeaderProfileView from './view/header-profile-view';
import MainNavigationView from './view/main-navigation-view';
import SortView from './view/sort-view';
import NoFilmsView from './view/no-films';
import FilmsView from './view/films-view';
import FilmsListView from './view/films-list-view';
import FilmCardView from './view/film-card-view';
import ShowMoreButtonView from './view/show-more-button-view';
import FilmsListExtraView from './view/films-list-extra-view';
import FooterStatisticsView from './view/footer-statistics-view';
import FilmDetailsView from './view/film-details-view';

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

/**
 * Реализует функционал отрисовки карточек фильмов, а также показа и закрытия поп-апа
 * @param container
 * @param film
 */
const renderFilmCard = (container, film) => {
  const filmCardComponent = new FilmCardView(film);
  const filmDetailsComponent = new FilmDetailsView(film);

  const openPopup = () => {
    customAppendChild(bodyElement, filmDetailsComponent);
    bodyElement.classList.add('hide-overflow');
  };

  const closePopup = () => {
    customRemoveChild(filmDetailsComponent);
    bodyElement.classList.remove('hide-overflow');
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      closePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  // клик по ссылке (открытие поп-апа)
  filmCardComponent.setPopupClickHandler(() => {
    openPopup(film);
    document.addEventListener('keydown', onEscKeyDown);
  });

  // Клик по кнопке закрытия поп-апа
  filmDetailsComponent.setFormCloseHandler(() => {
    closePopup();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(container, filmCardComponent);
};

const renderFilmsContainer = (contentContainer, moviesList) => {
  // movie list
  const moviesSectionComponent = new FilmsView();
  const moviesListComponent = new FilmsListView();

  render(contentContainer, moviesSectionComponent);

  const filmsListElement = contentContainer.querySelector('.films-list');
  render(filmsListElement, moviesListComponent);

  const filmsElement = contentContainer.querySelector('.films');

  if (moviesList.length === 0) {
    render(contentContainer, new NoFilmsView());
    return;
  }

  // movie cards
  moviesList
    .slice(0, Math.min(moviesList.length, MOVIE_COUNT_PER_STEP))
    .forEach((movieCard) => renderFilmCard(moviesListComponent, movieCard));

  // show more button
  if (moviesList.length > MOVIE_COUNT_PER_STEP) {
    let renderedMovieCount = MOVIE_COUNT_PER_STEP;

    const showMoreButtonComponent = new ShowMoreButtonView();

    render(filmsListElement, showMoreButtonComponent);

    showMoreButtonComponent.setClickHandler(() => {
      moviesList
        .slice(renderedMovieCount, renderedMovieCount + MOVIE_COUNT_PER_STEP)
        .forEach((movieCard) => renderFilmCard(moviesListComponent, movieCard));

      renderedMovieCount += MOVIE_COUNT_PER_STEP;

      if (renderedMovieCount >= movies.length) {
        remove(showMoreButtonComponent);
      }
    });
  }

  // extra movies
  render(filmsElement, new FilmsListExtraView('Top rated'));
  render(filmsElement, new FilmsListExtraView('Most commented'));

  const filmListExtraElements = filmsElement.getElementsByClassName('films-list--extra');

  // top rated movies
  const topRatedFilmsListContainerElement = filmListExtraElements[0].querySelector('.films-list__container');
  for (let i = 0; i < MOVIE_COUNT_EXTRA; i++) {
    renderFilmCard(topRatedFilmsListContainerElement, moviesList[i]);
  }

  // most commented movies
  const mostCommentedFilmsListContainerElement = filmListExtraElements[1].querySelector('.films-list__container');
  for (let i = 0; i < MOVIE_COUNT_EXTRA; i++) {
    renderFilmCard(mostCommentedFilmsListContainerElement, moviesList[i]);
  }
};


// header
render(siteHeaderElement, new HeaderProfileView());

// sort & menu
render(siteMainElement, new SortView(), RenderPosition.AFTERBEGIN);
render(siteMainElement, new MainNavigationView(filters), RenderPosition.AFTERBEGIN);

// content
renderFilmsContainer(siteMainElement, movies);

// footer
render(siteFooterStatisticsElement, new FooterStatisticsView(movies), RenderPosition.AFTERBEGIN);
