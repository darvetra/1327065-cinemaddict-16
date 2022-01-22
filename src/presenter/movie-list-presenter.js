import {remove, render, RenderPosition} from '../utils/render';
import {sortByRating, sortByDate, sortByCommentsCount} from '../utils/sort';

import {SortType, UpdateType, UserAction} from '../const.js';

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
  #noMoviesComponent = new NoFilmsView();
  #sortComponent = null;
  #showMoreButtonComponent = null;

  #renderedMovieCardCount = MOVIE_COUNT_PER_STEP;
  #moviePresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  // переделать блок рекомендованных фильмов
  // соответственно - избавиться от массивов ниже
  #topRatedMovieCards = [];
  #mostCommentedMovieCards = [];

  constructor(mainContainer, moviesModel) {
    this.#mainContainer = mainContainer;
    this.#moviesModel = moviesModel;

    this.#moviesModel.addObserver(this.#handleModelEvent);
  }

  // добавим обертку над методом модели для получения фильмов, в будущем так будет удобнее получать из модели данные в презенторе
  get movies() {
    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...this.#moviesModel.movies].sort(sortByDate);
      case SortType.RATING:
        return [...this.#moviesModel.movies].sort(sortByRating);
    }

    return this.#moviesModel.movies;
  }

  init = () => {
    render(this.#mainContainer, this.#moviesSectionComponent);

    const filmsListElement = this.#mainContainer.querySelector('.films-list');
    render(filmsListElement, this.#moviesListComponent);

    this.#renderMainContainer();
  }

  #handleModeChange = () => {
    this.#moviePresenter.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = (actionType, updateType, update) => {
    // eslint-disable-next-line no-console
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные

    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this.#moviesModel.updateMovie(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    // eslint-disable-next-line no-console
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить карточку
        this.#moviePresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this.#clearMainContainer();
        this.#renderMainContainer();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this.#clearMainContainer({resetRenderedMovieCardCount: true, resetSortType: true});
        this.#renderMainContainer();
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    // Сортируем задачи
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    // Очищаем список
    this.#clearMainContainer({resetRenderedMovieCardCount: true});

    // Рендерим список заново
    this.#renderMainContainer();
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#moviesSectionComponent, this.#sortComponent, RenderPosition.AFTERBEGIN);
  }

  #renderMovieCard = (movie, container = this.#moviesListComponent) => {
    const moviePresenter = new MoviePresenter(container, this.#handleViewAction, this.#handleModeChange);
    moviePresenter.init(movie);
    this.#moviePresenter.set(movie.id, moviePresenter);
  }

  #renderMovieCards = (cards = this.movies, container) => {
    cards.forEach((movieCard) => this.#renderMovieCard(movieCard, container));
  }

  #renderNoMovies = () => {
    render(this.#moviesSectionComponent, this.#noMoviesComponent);
  }

  #handleShowMoreButtonClick = () => {
    const movieCardsCount = this.movies.length;
    const newRenderedMovieCardCount = Math.min(movieCardsCount, this.#renderedMovieCardCount + MOVIE_COUNT_PER_STEP);
    const movies = this.movies.slice(this.#renderedMovieCardCount, newRenderedMovieCardCount);

    this.#renderMovieCards(movies);
    this.#renderedMovieCardCount = newRenderedMovieCardCount;

    if (this.#renderedMovieCardCount >= movieCardsCount) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {
    // Дублируется поиск filmsListElement через querySelector. Создать отдельную вьюху?
    const filmsListElement = this.#mainContainer.querySelector('.films-list');
    this.#showMoreButtonComponent = new ShowMoreButtonView();

    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);

    render(filmsListElement, this.#showMoreButtonComponent);
  }

  #renderExtraMovies = () => {
    this.#topRatedMovieCards = [...this.movies.sort(sortByRating)];
    this.#mostCommentedMovieCards = [...this.movies.sort(sortByCommentsCount)];

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

  #clearMainContainer = ({resetRenderedMovieCardCount = false, resetSortType = false} = {}) => {
    const movieCount = this.movies.length;

    this.#moviePresenter.forEach((presenter) => presenter.destroy());
    this.#moviePresenter.clear();

    remove(this.#sortComponent);
    remove(this.#noMoviesComponent);
    remove(this.#showMoreButtonComponent);

    if (resetRenderedMovieCardCount) {
      this.#renderedMovieCardCount = MOVIE_COUNT_PER_STEP;
    } else {
      // На случай, если перерисовка доски вызвана
      // уменьшением количества задач (например, удаление или перенос в архив)
      // нужно скорректировать число показанных задач
      this.#renderedMovieCardCount = Math.min(movieCount, this.#renderedMovieCardCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderMainContainer = () => {
    // sort
    this.#renderSort();

    // content
    const movies = this.movies;
    const movieCount = movies.length;

    if (movieCount === 0) {
      this.#renderNoMovies();
      return;
    }

    // Теперь, когда renderMainContainer рендерит доску не только на старте,
    // но и по ходу работы приложения, нужно заменить
    // константу MOVIE_COUNT_PER_STEP на свойство renderedMovieCardCount,
    // чтобы в случае перерисовки сохранить N-показанных карточек
    this.#renderMovieCards(movies.slice(0, Math.min(movieCount, this.#renderedMovieCardCount)));

    if (movieCount > this.#renderedMovieCardCount) {
      this.#renderShowMoreButton();
    }

    this.#renderExtraMovies();
  }
}
