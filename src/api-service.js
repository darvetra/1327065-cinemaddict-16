const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
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

    return await ApiService.parseResponse(response);
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

  addComment = async (data) => {
    const response = await this.#load({
      url: `comments/${data.id}`,
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(data)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }

  deleteComment = async (data) => {
    const response = await this.#load({
      url: `comments/${data.id}`,
      method: Method.DELETE,
      body: JSON.stringify(this.#adaptToServer(data)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return response;
  }

  #adaptToServer = (movie) => {
    const adaptedMovie = {
      'id': movie.id,
      'comments': movie.comments,
      'film_info': {
        'actors': movie.filmInfo.actors,
        'age_rating': movie.filmInfo.ageRating,
        'alternative_title': movie.filmInfo.alternativeTitle,
        'description': movie.filmInfo.description,
        'director': movie.filmInfo.director,
        'genre': movie.filmInfo.genre,
        'poster': movie.filmInfo.poster,
        'release': {
          'date': movie.filmInfo.release.date.toISOString(),
          'release_country': movie.filmInfo.release.releaseCountry,
        },
        'runtime': movie.filmInfo.runtime,
        'title': movie.filmInfo.title,
        'total_rating': movie.filmInfo.totalRating,
        'writers': movie.filmInfo.writers,
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
