import SmartView from './smart-view';
import {convertHumanDate, convertHumanTime, formatRunTime} from '../utils/date';
import {EMOJIS} from '../const';

import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import he from 'he';

const BLANK_MOVIE = {
  id: 0,
  comments: [],
  filmInfo: {
    title: '',
    alternativeTitle: '',
    totalRating: 0,
    poster: '',
    ageRating: 0,
    director: '',
    writers: [],
    actors: [],
    release: {
      date: null,
      releaseCountry: '',
    },
    runtime: 0,
    genre: '',
    description: '',
  },
  userDetails: {
    watchlist: false,
    alreadyWatched: false,
    watchingDate: null,
    favorite: false,
  },
};

const createCommentTemplate = (commentItem) => {
  const {id, author, comment, date, emotion} = commentItem;
  const time = convertHumanTime(date);

  return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(comment)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${time}</span>                         <!-- 2 days ago -->
        <button class="film-details__comment-delete" data-id-comment="${id}">Delete</button>
      </p>
    </div>
  </li>`;
};

const createEmojisListTemplate = (currentEmoji) => (
  EMOJIS.map((emoji) => `<input
      class="film-details__emoji-item visually-hidden"
      name="comment-emoji"
      type="radio"
      id="emoji-${emoji}"
      value="${emoji}"
      ${currentEmoji === emoji ? 'checked' : ''}
    />
    <label
      class="film-details__emoji-label"
      for="emoji-${emoji}"
    >
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
    </label
    >`).join('')
);

const createEmojiLabelTemplate = (currentEmoji) => `<img src="images/emoji/${currentEmoji}.png" width="55" height="55" alt="emoji-${currentEmoji}">`;

const createFilmDetailsTemplate = (data = {}) => {
  const {filmInfo, comments, userDetails, commentEmotion, textComment} = data;
  const {title, alternativeTitle, totalRating, poster, ageRating, director, writers, actors, release, runtime, genre, description} = filmInfo;
  const {watchlist, alreadyWatched, favorite} = userDetails;

  const writersList = writers.join(', ');
  const actorsList = actors.join(', ');
  const releaseDate = convertHumanDate(release.date);
  const humanizedRuntime = formatRunTime(runtime);
  const releaseCountry = release.releaseCountry;
  const commentsLength = comments.length;

  let movieGenres = '';
  for (const genreItem of genre) {
    movieGenres += `<span class="film-details__genre">${genreItem}</span>`;
  }

  let commentsList = '';
  for (const comment of comments) {
    commentsList += createCommentTemplate(comment);
  }

  const emojisListTemplate = createEmojisListTemplate();

  const emojiLabelTemplate = createEmojiLabelTemplate(commentEmotion);

  const emojiLabel = commentEmotion
    ? emojiLabelTemplate
    : '';

  const watchlistIsChecked = watchlist
    ? 'film-details__control-button--watchlist film-details__control-button--active'
    : 'film-details__control-button--watchlist';

  const watchedIsChecked = alreadyWatched
    ? 'film-details__control-button--watched film-details__control-button--active'
    : 'film-details__control-button--watched';

  const favoriteIsChecked = favorite
    ? 'film-details__control-button--favorite film-details__control-button--active'
    : 'film-details__control-button--favorite';

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

            <p class="film-details__age">${ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writersList}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actorsList}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${releaseDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${humanizedRuntime}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">${movieGenres}</td>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button ${watchlistIsChecked}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button ${watchedIsChecked}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button ${favoriteIsChecked}" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsLength}</span></h3>

          <ul class="film-details__comments-list">
            ${commentsList}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
                ${emojiLabel}
            </div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${he.encode(textComment)}</textarea>
            </label>

            <div class="film-details__emoji-list">
               ${emojisListTemplate}
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class FilmDetailsView extends SmartView {
  constructor(movie = BLANK_MOVIE) {
    super();
    this._data = FilmDetailsView.parseMovieToData(movie);

    this.#setInnerHandlers();
  }

  get template() {
    return createFilmDetailsTemplate(this._data);
  }

  reset = (movie) => {
    this.updateData(
      FilmDetailsView.parseMovieToData(movie),
    );
  }

  addComment = () => {
    if (this._data.commentEmotion === '' || this._data.commentEmotion === false || this._data.textComment === '') {
      return;
    }

    const newComment = {
      id: nanoid(),
      emotion: this._data.commentEmotion,
      comment: this._data.textComment,
      date: dayjs(),
      author: 'Author',
    };
    this._data.comments.push(newComment);
    this.#update(this._data);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setPopupCloseHandler(this._callback.popupClose);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteCommentClickHandler(this._callback.deleteCommentClick);
  }

  setPopupCloseHandler = (callback) => {
    this._callback.popupClose = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#popupCloseHandler);
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#descriptionInputHandler);
    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('change', this.#emojiChangeHandler);
    this.element.addEventListener('scroll', this.#scrollPositionHandler);
  }

  #emojiChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      commentEmotion: evt.target.value,
    });
  }

  #descriptionInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      textComment: evt.target.value,
    }, true);
  }

  #popupCloseHandler = (evt) => {
    evt.preventDefault();
    this._callback.popupClose(FilmDetailsView.parseDataToMovie(this._data));
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(FilmDetailsView.parseDataToMovie(this._data));
  }

  setDeleteCommentClickHandler = (callback) => {
    this._callback.deleteCommentClick = callback;
    this.element.querySelector('.film-details__comments-list').addEventListener('click', this.#deleteClickHandler);
  }

  #scrollPositionHandler = () => {
    this.updateData({
      scrollPosition: this.element.scrollTop,
    }, true);
  }

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    // this._callback.deleteClick(FilmDetailsView.parseDataToMovie(this._data));

    if (evt.target.tagName !== 'BUTTON') {
      return;
    }

    this._callback.deleteCommentClick(evt.target.dataset.idComment);
  }

  #update = (data) => {
    this.updateData(
      FilmDetailsView.parseDataToMovie(data),
    );
  }

  static parseMovieToData = (movie) => ({...movie,
    commentEmotion: movie.commentEmotion !== undefined,
    scrollPosition: 0,
    textComment: '',
  });

  static parseDataToMovie = (data) => {
    const movie = {...data};

    if (movie.textComment) {
      movie.textComment = '';
    }

    delete movie.commentEmotion;
    delete movie.scrollPosition;
    delete movie.textComment;

    return movie;
  }

}
