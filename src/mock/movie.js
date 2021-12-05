import dayjs from 'dayjs';

const MAXIMUM_NUMBER_OF_SENTENCES = 5;
const MAXIMUM_NUMBER_OF_COMMENTS = 5;
const MAXIMUM_NUMBER_OF_GENRES = 3;
const MAXIMUM_NUMBER_OF_WRITERS = 2;
const MAXIMUM_NUMBER_OF_ACTORS = 3;
const MAXIMUM_GAP_OF_TIME = 60 * 60* 24 * 180; // 180 дней в секундах
const ONE_HUNDRED_YEARS = 60 * 60 * 24 * 365 * 100; // 100 лет в секундах

/**
 * Функция из интернета по генерации случайного числа из диапазона
 * Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
 * @param a
 * @param b
 * @returns {number}
 */
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

/**
 * Функция, возвращающая случайное целое число из переданного диапазона включительно.
 * Результат: целое число из диапазона "от...до".
 * Источник: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 *
 * @param min - минимальное значекние диапозона
 * @param max - максимальное значение диапозона
 */
const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  if (min >= max) {
    return 'Введены неверные значения';
  }
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
};

/**
 * Генерирует случайную дату и время в прошлом, в пределах заданного периода в секундах
 * @returns {Date}
 */
const generateDate = (gap) => {
  const secondGap = getRandomInteger(-gap, 0);

  return dayjs().add(secondGap, 'second').toDate();
};

/**
 * Генерирует название фильма
 * @returns {string}
 */
const generateMovieTitle = () => {
  const movieTitles = [
    'The Dance of Life',
    'Sagebrush Trail',
    'The Man with the Golden Arm',
    'Santa Claus Conquers the Martians',
    'Popeye the Sailor Meets Sindbad the Sailor',
    'The Great Flamarion',
    'Made for Each Other',
  ];
  const randomIndex = getRandomInteger(0, movieTitles.length - 1);
  return movieTitles[randomIndex];
};

/**
 * Генерирует имя режиссера
 * @returns {string}
 */
const generateDirector = () => {
  const movieTitles = [
    'Anthony Mann',
    'Tom Ford',
  ];
  const randomIndex = getRandomInteger(0, movieTitles.length - 1);
  return movieTitles[randomIndex];
};

/**
 * Генерирует страну
 * @returns {string}
 */
const generateCountry = () => {
  const movieTitles = [
    'Finland',
    'USA',
    'Russia',
    'Poland',
  ];
  const randomIndex = getRandomInteger(0, movieTitles.length - 1);
  return movieTitles[randomIndex];
};

/**
 * Генерирует моковые данные обложки фильма
 * @returns {string}
 */
const generatePoster = () => {
  const posters = [
    'made-for-each-other.png',
    'popeye-meets-sinbad.png',
    'sagebrush-trail.jpg',
    'santa-claus-conquers-the-martians.jpg',
    'the-dance-of-life.jpg',
    'the-great-flamarion.jpg',
    'the-man-with-the-golden-arm.jpg',
  ];
  const randomIndex = getRandomInteger(0, posters.length - 1);
  return posters[randomIndex];
};

/**
 * Генерирует моковые данные описания для карточки фильма
 * @returns {string}
 */
const generateDescription = () => {
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.',
  ];

  const sentenceNumbers = getRandomIntInclusive(1, MAXIMUM_NUMBER_OF_SENTENCES);
  const createDescription = (length) => {
    const result = [];
    for (let i = 1; i <= length; i++) {
      result.push(descriptions[getRandomIntInclusive(0, descriptions.length - 1)]);
    }
    return result.join(' ');
  };

  return createDescription(sentenceNumbers);
};

/**
 * Генерирует моковые данные комментариев для карточки фильма
 * @returns {{}}
 */
const generateComment = () => {
  const emotions = [
    'smile',
    'sleeping',
    'puke',
    'angry'
  ];
  const authors = [
    'Joseph DeMaio',
    'Eric Adams',
    'Arnold Alois Schwarzenegger',
    'Michael Sylvester Gardenzio Stallone',
    'Luke Skywalker'
  ];
  const comments = [
    'Brothers I am calling from the valley of the kings With nothing to atone',
    'A dark march lies ahead, together we will ride Like thunder from the sky',
    'May your sword stay wet like a young girl in her prime Hold your hammers high',
    'Blood and death are waiting like a raven in the sky',
    'I was born to die Hear me while I live',
    'As I look into your eyes None shall hear a lie',
    'Power and dominion are taken by the will',
    'By divine right hail and kill'
  ];

  return {
    id: getRandomInteger(0, 42),
    author: authors[getRandomIntInclusive(0, authors.length - 1)],
    comment: comments[getRandomIntInclusive(0, comments.length - 1)],
    date: generateDate(MAXIMUM_GAP_OF_TIME),
    emotion: emotions[getRandomIntInclusive(0, emotions.length - 1)],
  };
};

const genresTemplate = [
  'Action',
  'Drama',
  'Film-Noir',
  'Mystery',
  'Cartoon',
  'Comedy',
  'Musical',
  'Western',
];

const writersTemplate = [
  'Anne Wigton',
  'Heinz Herald',
  'Richard Weil',
  'Takeshi Kitano',
];

const actorsTemplate = [
  'Morgan Freeman',
  'Erich von Stroheim',
  'Mary Beth Hughes',
  'Dan Duryea',
];

/**
 * Преобразует массив моковых данных для шаблона
 * @param arrayTemplate - массив возможных значений для преобразования
 * @param number - количество элементов нового массива
 * @returns {*[]}
 */
const generateArrayTemplate = (arrayTemplate, number) => {
  const numbers = getRandomIntInclusive(1, number);
  const array = [];
  for (let i = 0; i < numbers; i++) {
    array[i] = arrayTemplate[getRandomIntInclusive(0, arrayTemplate.length - 1)];
  }

  return array;
};

/**
 * Генерирует моковые даныне карточки фильма
 * @returns {{filmInfo: {actors: string[], director: string, release: {date: string, releaseCountry: string}, genre: string[], totalRating: number, runtime: number, description: string, ageRating: number, writers: string[], title: string, poster: string}, id: number}}
 */
export const generateMovie = () => ({
  id: getRandomInteger(0, 42),
  comments: new Array(getRandomIntInclusive(1, MAXIMUM_NUMBER_OF_COMMENTS)).fill().map(() => generateComment()),
  filmInfo: {
    title: generateMovieTitle(),
    alternativeTitle: generateMovieTitle(),
    totalRating: getRandomInteger(0, 10),
    poster: generatePoster(),
    ageRating: getRandomInteger(0, 21),
    director: generateDirector(),
    writers: generateArrayTemplate(writersTemplate, MAXIMUM_NUMBER_OF_WRITERS),
    actors: generateArrayTemplate(actorsTemplate, MAXIMUM_NUMBER_OF_ACTORS),
    release: {
      date: generateDate(ONE_HUNDRED_YEARS),
      releaseCountry: generateCountry(),
    },
    runtime: getRandomInteger(59, 180),
    genre: generateArrayTemplate(genresTemplate, MAXIMUM_NUMBER_OF_GENRES),
    description: generateDescription(),
  },
  userDetails: {
    watchlist: Boolean(getRandomInteger(0, 1)),
    alreadyWatched: Boolean(getRandomInteger(0, 1)),
    watchingDate: generateDate(MAXIMUM_GAP_OF_TIME),
    favorite: Boolean(getRandomInteger(0, 1)),
  },
});
