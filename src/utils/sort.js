import {convertYearDate} from './date';

/**
 * Функция для метода sort
 * Сортировка по рейтингу
 * @param movieA
 * @param movieB
 * @returns {number}
 */
export const sortByRating = (movieA, movieB) => {
  if (movieA.filmInfo.totalRating > movieB.filmInfo.totalRating) {
    return -1;
  }

  if (movieA.filmInfo.totalRating < movieB.filmInfo.totalRating) {
    return 1;
  }

  return 0;
};

/**
 * Функция для метода sort
 * Сортировка по дате (году) релиза
 * @param movieA
 * @param movieB
 * @returns {number}
 */
export const sortByDate = (movieA, movieB) => {
  const convertedMovieADate = convertYearDate(movieA.filmInfo.release.date);
  const convertedMovieBDate = convertYearDate(movieB.filmInfo.release.date);

  if (convertedMovieADate > convertedMovieBDate) {
    return -1;
  }

  if (convertedMovieADate < convertedMovieBDate) {
    return 1;
  }

  return 0;
};
