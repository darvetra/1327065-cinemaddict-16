import dayjs from 'dayjs';
import {StatisticType} from '../const';


export const getStartDate = (statisticType) => {
  switch (statisticType) {
    case StatisticType.ALL:
      return null;
    case StatisticType.TODAY:
      return dayjs().startOf('day').toDate();
    case StatisticType.WEEK:
      return dayjs().subtract(1, 'week').toDate();
    case StatisticType.MONTH:
      return dayjs().subtract(1, 'month').toDate();
    case StatisticType.YEAR:
      return dayjs().subtract(1, 'year').toDate();
  }
  return null;
};

export const countMoviesByGenre = (movies, genre) =>
  movies.filter((movie) => movie.filmInfo.genre.some((movieGenre) => movieGenre === genre)).length;

export const getMoviesFilteredByStatisticDate = (statisticType, movies) => {
  const startDate = getStartDate(statisticType);

  return startDate
    ? movies.filter((movie) => dayjs(movie.watchingDate).isAfter(startDate))
    : movies;
};

export const getStatisticGenres = (movies) => {
  const statisticGenres = new Set();
  movies.forEach((movie) => {
    movie.filmInfo.genre.forEach((item) => statisticGenres.add(item));
  });

  return Array.from(statisticGenres, (item) => ({
    item: item,
    count: countMoviesByGenre(movies, item),
  }));
};

export const sortGenreCountDown = (genre1, genre2) => genre1.count < genre2.count ? 1 : -1;

