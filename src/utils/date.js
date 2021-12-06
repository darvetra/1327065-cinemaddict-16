import dayjs from 'dayjs';

/**
 * Возвращает год - 'YYYY'
 * @param date
 * @returns {string|string}
 */
export const convertYearDate = (date) => date !== null
  ? dayjs(date).format('YYYY')
  : '';

/**
 * Возвращает дату в "человеческом" формате - 'DD MMMM YYYY'
 * @param date
 * @returns {string|string}
 */
export const convertHumanDate = (date) => date !== null
  ? dayjs(date).format('DD MMMM YYYY')
  : '';

/**
 * Возвращает дату и время в "человеческом" формате - 'YYYY/MM/DD HH:mm'
 * @param date
 * @returns {string|string}
 */
export const convertHumanTime = (date) => date !== null
  ? dayjs(date).format('YYYY/MM/DD HH:mm')
  : '';

/**
 * Принимает время в минутах
 * Возвращает время в минутах, либо в часах и минутах
 * @returns {string}
 * @param timiInMinutes
 */
export const  formatRunTime = (timiInMinutes) => {
  let formatTime = '';
  const hours =  Math.floor(timiInMinutes/60);
  const minutes = timiInMinutes%60;

  if(timiInMinutes < 60){
    formatTime = `${timiInMinutes}m`;
  }

  if(timiInMinutes >= 60 && timiInMinutes < (60*24)){
    formatTime = `${hours}h ${minutes}m`;
  }

  return formatTime;
};
