import {remove, render, RenderPosition} from '../utils/render.js';
import {updateItem} from '../utils/common';

import MoviePresenter from './movie-presenter';

import SortView from '../view/sort-view';
import NoFilmsView from '../view/no-films';
import FilmsView from '../view/films-view';
import FilmsListView from '../view/films-list-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import FilmsListExtraView from '../view/films-list-extra-view';

const MOVIE_COUNT_PER_STEP = 5;
const MOVIE_COUNT_EXTRA = 2;

export default class MovieListPresenter {
  #mainContainer = null;

  #moviesSectionComponent = new FilmsView();
  #moviesListComponent = new FilmsListView();
  #sortComponent = new SortView();
  #noMoviesComponent = new NoFilmsView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #movieCards = [];
  #renderedMovieCount = MOVIE_COUNT_PER_STEP;
  #moviePresenter = new Map();

  constructor(mainContainer) {
    this.#mainContainer = mainContainer;
  }

  init = (movieCards) => {
    this.#movieCards = [...movieCards];

    render(this.#mainContainer, this.#moviesSectionComponent);

    const filmsListElement = this.#mainContainer.querySelector('.films-list');
    render(filmsListElement, this.#moviesListComponent);

    this.#renderMainContainer();
  }

  #handleModeChange = () => {
    this.#moviePresenter.forEach((presenter) => presenter.resetView());
  }

  #handleMovieCardChange = (updatedMovie) => {
    this.#movieCards = updateItem(this.#movieCards, updatedMovie);
    this.#moviePresenter.get(updatedMovie.id).init(updatedMovie);
  }


  #renderSort = () => {
    render(this.#moviesSectionComponent, this.#sortComponent, RenderPosition.AFTERBEGIN);
  }


  #renderMovieCard = (movie, container = this.#moviesListComponent) => {
    const moviePresenter = new MoviePresenter(container, this.#handleMovieCardChange, this.#handleModeChange);
    moviePresenter.init(movie);
    this.#moviePresenter.set(movie.id, moviePresenter);
  }

  #renderMovieCards = (from, to) => {
    this.#movieCards
      .slice(from, to)
      .forEach((movieCard) => this.#renderMovieCard(movieCard));
  }

  #renderNoMovies = () => {
    render(this.#moviesSectionComponent, this.#noMoviesComponent);
  }

  #handleShowMoreButtonClick = () => {
    this.#renderMovieCards(this.#renderedMovieCount, this.#renderedMovieCount + MOVIE_COUNT_PER_STEP);
    this.#renderedMovieCount += MOVIE_COUNT_PER_STEP;

    if (this.#renderedMovieCount >= this.#movieCards.length) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {
    // Дублируется поиск filmsListElement через querySelector. Создать отдельную вьюху?
    const filmsListElement = this.#mainContainer.querySelector('.films-list');
    render(filmsListElement, this.#showMoreButtonComponent);

    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
  }

  #renderExtraMovies = () => {
    const filmsElement = this.#mainContainer.querySelector('.films');

    render(filmsElement, new FilmsListExtraView('Top rated'));
    render(filmsElement, new FilmsListExtraView('Most commented'));

    const [topRatedElements, mostCommentedElements] = filmsElement.getElementsByClassName('films-list--extra');

    // top rated movies
    const topRatedFilmsListContainerElement = topRatedElements.querySelector('.films-list__container');
    for (let i = 0; i < MOVIE_COUNT_EXTRA; i++) {
      this.#renderMovieCard(this.#movieCards[i], topRatedFilmsListContainerElement);
    }

    // most commented movies
    const mostCommentedFilmsListContainerElement = mostCommentedElements.querySelector('.films-list__container');
    for (let i = 0; i < MOVIE_COUNT_EXTRA; i++) {
      this.#renderMovieCard(this.#movieCards[i], mostCommentedFilmsListContainerElement);
    }
  }

  #clearMovieList = () => {
    this.#moviePresenter.forEach((presenter) => presenter.destroy());
    this.#moviePresenter.clear();
    this.#renderedMovieCount = MOVIE_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  }

  #renderMovieList = () => {
    this.#renderMovieCards(0, Math.min(this.#movieCards.length, MOVIE_COUNT_PER_STEP));

    if (this.#movieCards.length > MOVIE_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderMainContainer = () => {
    // sort
    this.#renderSort();

    // content
    if (this.#movieCards.length === 0) {
      this.#renderNoMovies();
      return;
    }

    this.#renderMovieList();

    this.#renderExtraMovies();
  }
}
