import SmartView from './smart-view';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getMoviesFilteredByStatisticDate, getStatisticGenres, sortGenreCountDown, getTotalDuration} from '../utils/statistic';
import {StatisticType, MINUTES_IN_HOURS} from '../const';

const BAR_HEIGHT = 50;

const renderChart = (statisticCtx, movies, statisticType) => {
  statisticCtx.height = BAR_HEIGHT * 5;

  const filteredMovies = getMoviesFilteredByStatisticDate(statisticType, movies);
  const movieGenresCounted = getStatisticGenres(filteredMovies);
  const sortedMovieGenres = movieGenresCounted.sort(sortGenreCountDown);

  const movieGenres = sortedMovieGenres.map((item) => item.item);
  const moviesByGenreEntity = sortedMovieGenres.map((genre) => genre.count);

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: movieGenres,
      datasets: [{
        data: moviesByGenreEntity,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatsTemplate = (data) => {
  const {movies, statisticType} = data;
  const checkedStatisticType = (type) => type === statisticType ? 'checked="checked"' : '';
  const filteredMovies = getMoviesFilteredByStatisticDate(statisticType, movies);
  const watchedMovies = filteredMovies.length;

  let totalDuration = 0;
  let totalDurationHours = 0;
  let totalDurationMinutes = 0;
  let topGenre = null;

  if (watchedMovies) {
    totalDuration = getTotalDuration(filteredMovies);
    totalDurationHours =  Math.trunc(totalDuration / MINUTES_IN_HOURS);
    totalDurationMinutes = totalDuration % MINUTES_IN_HOURS;

    const movieGenresWithCount =  getStatisticGenres(filteredMovies);
    const sortedMovieGenres = movieGenresWithCount.sort(sortGenreCountDown);
    topGenre = sortedMovieGenres.length ? sortedMovieGenres[0].item : null;
  }

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Movie buff</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="${StatisticType.ALL}" ${checkedStatisticType(StatisticType.ALL)}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="${StatisticType.TODAY}" ${checkedStatisticType(StatisticType.TODAY)}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="${StatisticType.WEEK}" ${checkedStatisticType(StatisticType.WEEK)}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="${StatisticType.MONTH}" ${checkedStatisticType(StatisticType.MONTH)}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="${StatisticType.YEAR}" ${checkedStatisticType(StatisticType.YEAR)}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedMovies} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${totalDurationHours}<span class="statistic__item-description">h</span>${totalDurationMinutes}<span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre ? topGenre : ''}</p>
      </li>
    </ul>

    <!-- Диаграмма -->
    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

export default class StatsView extends SmartView {
  #chart = null;
  #statisticType = StatisticType.ALL

  constructor(movies) {
    super();

    this._data = {
      movies,
      statisticType: this.#statisticType
    };

    this.#setCharts();
    this.#setTimeChange();
  }

  get template() {
    return createStatsTemplate(this._data);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#chart) {
      this.#chart.destroy();
      this.#chart = null;
      this.#setTimeChange();
    }
  }

  restoreHandlers = () => {
    this.#setCharts();
    this.#setTimeChange();
  }

  #setTimeChange = () => {
    this.element.querySelectorAll('.statistic__filters-input').forEach((input) => {
      input.addEventListener('click', this.#actionTimeChange);
    });
  }

  #actionTimeChange = (evt) => {
    evt.preventDefault();
    const statisticType = evt.target.value;

    if (statisticType === this.#statisticType) {
      return;
    }

    this.#statisticType = statisticType;
    this.updateData({statisticType: this.#statisticType});
  }

  #setCharts = () => {
    const {movies, statisticType} = this._data;
    const statisticCtx = this.element.querySelector('.statistic__chart');

    this.#chart = renderChart(statisticCtx, movies, statisticType);
  }
}
