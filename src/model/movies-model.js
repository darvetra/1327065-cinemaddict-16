import AbstractObservable from '../utils/abstract-observable.js';

export default class MoviesModel extends AbstractObservable {
  #movies = [];

  set movies(movies) {
    this.#movies = [...movies];
  }

  get movies() {
    return this.#movies;
  }

  updateMovie = (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      update,
      ...this.#movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  deleteComment = (commentId) => {
    const currentMovie = this.#movies.find((movie) => movie.comments.includes(commentId));
    const commentIndex = currentMovie.comments.findIndex((comment) => comment === commentId);

    if (commentIndex === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    currentMovie.comments = [
      ...currentMovie.comments.slice(0, commentIndex),
      ...currentMovie.comments.slice(commentIndex + 1),
    ];

    this._notify();
  }

}
