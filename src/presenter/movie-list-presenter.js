import {remove, render, RenderPosition} from '../utils/render';
import {updateItem} from '../utils/common';
import {sortByRating, sortByDate, sortByCommentsCount} from '../utils/sort';

import {SortType} from '../const.js';

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
  #moviesModel = null;

  #moviesSectionComponent = new FilmsView();
  #moviesListComponent = new FilmsListView();
  #moviesListTopRatedComponent = new FilmsListView();
  #moviesListMostCommentedComponent = new FilmsListView();
  #sortComponent = new SortView();
  #noMoviesComponent = new NoFilmsView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #movieCards = [];
  #renderedMovieCount = MOVIE_COUNT_PER_STEP;
  #moviePresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourcedMovieCards = [];

  #topRatedMovieCards = [];
  #mostCommentedMovieCards = [];

  constructor(mainContainer, moviesModel) {
    this.#mainContainer = mainContainer;
    this.#moviesModel = moviesModel;
  }

  get movies() {
    return this.#moviesModel.movies;
  }

  init = (movieCards) => {
    this.#movieCards = [...movieCards];
    // 1. В отличии от сортировки по любому параметру,
    // исходный порядок можно сохранить только одним способом -
    // сохранив исходный массив:
    this.#sourcedMovieCards = [...movieCards];

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
    this.#sourcedMovieCards = updateItem(this.#sourcedMovieCards, updatedMovie);
    this.#moviePresenter.get(updatedMovie.id).init(updatedMovie);
  }

  #sortMovieCards = (sortType) => {
    // 2. Этот исходный массив карточек необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _movieCards
    switch (sortType) {
      case SortType.DATE:
        this.#movieCards.sort(sortByDate);
        break;
      case SortType.RATING:
        this.#movieCards.sort(sortByRating);
        break;
      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _movieCards исходный массив
        this.#movieCards = [...this.#sourcedMovieCards];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    // - Сортируем задачи
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortMovieCards(sortType);

    // - Очищаем список
    this.#clearMovieList();

    // - Рендерим список заново
    this.#renderMovieList();
  }

  #renderSort = () => {
    render(this.#moviesSectionComponent, this.#sortComponent, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderMovieCard = (movie, container = this.#moviesListComponent) => {
    const moviePresenter = new MoviePresenter(container, this.#handleMovieCardChange, this.#handleModeChange);
    moviePresenter.init(movie);
    this.#moviePresenter.set(movie.id, moviePresenter);
  }

  #renderMovieCards = (from, to, cards = this.#movieCards, container) => {
    cards
      .slice(from, to)
      .forEach((movieCard) => this.#renderMovieCard(movieCard, container));
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
    this.#topRatedMovieCards = [...this.#movieCards.sort(sortByRating)];
    this.#mostCommentedMovieCards = [...this.#movieCards.sort(sortByCommentsCount)];

    const filmsElement = this.#mainContainer.querySelector('.films');

    render(filmsElement, new FilmsListExtraView('Top rated'));
    render(filmsElement, new FilmsListExtraView('Most commented'));

    const [topRatedElements, mostCommentedElements] = filmsElement.getElementsByClassName('films-list--extra');

    // top rated movies
    render(topRatedElements, this.#moviesListTopRatedComponent);
    this.#renderMovieCards(0, MOVIE_COUNT_EXTRA, this.#topRatedMovieCards, this.#moviesListTopRatedComponent);

    // most commented movies
    render(mostCommentedElements, this.#moviesListMostCommentedComponent);
    this.#renderMovieCards(0, MOVIE_COUNT_EXTRA, this.#mostCommentedMovieCards, this.#moviesListMostCommentedComponent);
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
