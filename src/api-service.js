const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get movies() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateMovie = async (movie) => {
    const response = await this.#load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  #adaptToServer = (movie) => {
    const adaptedMovie = {
      'id': movie.id,
      'comments': movie.comments,
      'film_info': {
        'actors': movie.actors,
        'age_rating': movie.ageRating,
        'alternative_title': movie.alternativeTitle,
        'description': movie.description,
        'director': movie.director,
        'genre': movie.genre,
        'poster': movie.poster,
        'release': {
          'date': movie.release.date.toISOString(),
          'release_country': movie.release.releaseCountry,
        },
        'runtime': movie.runtime,
        'title': movie.title,
        'total_rating': movie.totalRating,
        'writers': movie.writers,
      },
      'user_details': {
        'already_watched': movie.userDetails.alreadyWatched,
        'favorite': movie.userDetails.favorite,
        'watching_date': movie.userDetails.watchingDate.toISOString(),
        'watchlist': movie.userDetails.watchlist,
      },
    };

    return adaptedMovie;
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
