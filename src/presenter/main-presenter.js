import {remove, render, RenderPosition} from '../utils/render';
import {sortByRating, sortByDate} from '../utils/sort';
import {filter} from '../utils/filter';

import {SortType, UpdateType, FilterType} from '../const.js';

import MoviePresenter from './movie-presenter';

import SortView from '../view/sort-view';
import NoFilmsView from '../view/no-films-view';
import FilmsView from '../view/films-view';
import FilmsListView from '../view/films-list-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import LoadingView from '../view/loading-view';

const MOVIE_COUNT_PER_STEP = 5;

export default class MainPresenter {
  #mainContainer = null;
  #moviesModel = null;
  #filterModel = null;

  #moviesSectionComponent = new FilmsView();
  #moviesListComponent = new FilmsListView();
  #loadingComponent = new LoadingView();
  #noMoviesComponent = null;
  #sortComponent = null;
  #showMoreButtonComponent = null;

  #renderedMovieCardCount = MOVIE_COUNT_PER_STEP;
  #moviePresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;

  constructor(mainContainer, moviesModel, filterModel) {
    this.#mainContainer = mainContainer;
    this.#moviesModel = moviesModel;
    this.#filterModel = filterModel;
  }

  // добавим обертку над методом модели для получения фильмов, в будущем так будет удобнее получать из модели данные в презенторе
  get movies() {
    this.#filterType = this.#filterModel.filter;
    const movies = this.#moviesModel.movies;
    const filteredMovies = filter[this.#filterType](movies);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredMovies.sort(sortByDate);
      case SortType.RATING:
        return filteredMovies.sort(sortByRating);
    }

    return filteredMovies;
  }

  init = () => {
    render(this.#mainContainer, this.#moviesSectionComponent);

    const filmsListElement = this.#mainContainer.querySelector('.films-list');
    render(filmsListElement, this.#moviesListComponent);

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#renderMainContainer();
  }

  destroy = () => {
    this.#clearMainContainer(true, true);

    remove(this.#moviesListComponent);
    remove(this.#moviesSectionComponent);

    this.#moviesModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  }

  #handleModeChange = () => {
    this.#moviePresenter.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = (actionType, updateType, update) => {
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    this.#moviesModel.updateMovie(updateType, update);
  }

  #handleModelEvent = (updateType, data) => {
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
        this.#clearMainContainer(true, true);
        this.#renderMainContainer();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
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
    this.#clearMainContainer(true);

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

  #renderLoading = () => {
    render(this.#moviesSectionComponent, this.#loadingComponent);
  }

  #renderNoMovies = () => {
    this.#noMoviesComponent = new NoFilmsView(this.#filterType);
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

  #clearMainContainer = (resetRenderedMovieCardCount = false, resetSortType = false) => {
    const movieCount = this.movies.length;

    this.#moviePresenter.forEach((presenter) => presenter.destroy());
    this.#moviePresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#showMoreButtonComponent);

    if (this.#noMoviesComponent) {
      remove(this.#noMoviesComponent);
    }

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
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

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
  }

}
