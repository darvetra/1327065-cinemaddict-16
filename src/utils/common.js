/**
 * Функция, возвращающая случайное десятичное число из переданного диапазона включительно.
 * Результат: десятичное число из диапазона "от...до".
 * Источник: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
 *
 * @param min
 * @param max
 * @returns {string|*|number}
 */
export const getRandomDecimalInclusive = (min, max) => {
  const minNumber = Math.ceil(min);
  const maxNumber = Math.floor(max);
  if (minNumber >= maxNumber) {
    return 'Введены неверные значения';
  }

  const decimalAdjust = (type, value, exp) => {
    // Если степень не определена, либо равна нулю...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // Если значение не является числом, либо степень не является целым числом...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Сдвиг разрядов
    value = value.toString().split('e');
    value = Math[type](+(`${value[0]  }e${  value[1] ? (+value[1] - exp) : -exp}`));
    // Обратный сдвиг
    value = value.toString().split('e');
    return +(`${value[0]  }e${  value[1] ? (+value[1] + exp) : exp}`);
  };

  // Максимум и минимум включаются
  const number = (Math.random() * (maxNumber - minNumber + 1)) + minNumber;

  // Округление до ближайшего 'round'
  return decimalAdjust('round', number, -1);
};

/**
 * Функция из интернета по генерации случайного числа из диапазона
 * Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
 * @param a
 * @param b
 * @returns {number}
 */
export const getRandomInteger = (a = 0, b = 1) => {
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
export const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  if (min >= max) {
    return 'Введены неверные значения';
  }
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};
