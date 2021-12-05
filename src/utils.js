import dayjs from 'dayjs';

/**
 * Возвращает год - 'YYYY'
 * @param date
 * @returns {string|string}
 */
export const convertYearDate = (date) => date !== null
  ? dayjs(date).format('YYYY')
  : '';
