import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../const.js';

export default class MoviesModel extends AbstractObservable {
  #apiService = null;
  #movies = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get movies() {
    return this.#movies;
  }

  init = async () => {
    try {
      const movies = await this.#apiService.movies;
      this.#movies = movies.map(this.#adaptToClient);
    } catch(err) {
      this.#movies = [];
    }

    this._notify(UpdateType.INIT);
  }

  updateMovie = async (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    try {
      const response = await this.#apiService.updateMovie(update);
      const updateMovie = this.#adaptToClient(response);
      this.#movies = [
        ...this.#movies.slice(0, index),
        updateMovie,
        ...this.#movies.slice(index + 1),
      ];
      this._notify(updateType, updateMovie);
    } catch(err) {
      throw new Error('Can\'t update movie');
    }
  }

  #adaptToClient = (movie) => {
    const adaptedMovie = {
      id: movie.id,
      comments: movie.comments,
      filmInfo: {
        title: movie['film_info'].title,
        alternativeTitle: movie['film_info']['alternative_title'],
        totalRating: movie['film_info']['total_rating'],
        poster: movie['film_info'].poster,
        ageRating: movie['film_info']['age_rating'],
        director: movie['film_info'].director,
        writers: movie['film_info'].writers,
        actors: movie['film_info'].actors,
        release: {
          date: new Date(movie['film_info'].release.date),
          releaseCountry: movie['film_info'].release['release_country'],
        },
        runtime: movie['film_info'].runtime,
        genre: movie['film_info'].genre,
        description: movie['film_info'].description,
      },
      userDetails: {
        watchlist: movie['user_details'].watchlist,
        alreadyWatched: movie['user_details']['already_watched'],
        watchingDate: new Date(movie['user_details']['watching_date']),
        favorite: movie['user_details'].favorite,
      },
    };

    return adaptedMovie;
  }

}
