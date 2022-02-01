import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../const';

export default class CommentsModel extends AbstractObservable {
  #comments = new Map();
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  getComments = (movieId) => this.#comments.get(movieId);

  loadComments = async (movieId) => {
    let comments;
    try {
      comments = await this.#apiService.getMovieComments(movieId);
      this.#comments.set(movieId, comments.map(this.#adaptCommentDataToClient));
    } catch (err) {
      comments = [];
    }

    this._notify(UpdateType.LOAD_COMMENTS, {movieId: movieId});

    // eslint-disable-next-line no-console
    console.log(comments.map(this.#adaptCommentDataToClient));

    return comments.map(this.#adaptCommentDataToClient);
  }

  addComment = async (updateType, update) => {
    const {comment, movieId} = update;

    try {
      const response = await this.#apiService.addComment(comment, movieId);
      const {comments} = response;
      const newComments = comments.map(this.#adaptCommentDataToClient);
      this.#comments.set(movieId, newComments);

      this._notify(updateType, {movieId: movieId});

    } catch (err) {

      throw new Error('Can\'t add comment');
    }
  }

  deleteComment = async (updateType, update) => {
    const {comment, movieId} = update;
    const comments = this.getComments(movieId);

    if (!comments) {
      throw new Error('Can\'t delete comment');
    }

    const index = comments.findIndex((item) => item.id === comment.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#apiService.deleteComment(comment);
      const newComments = [
        ...comments.slice(0, index),
        ...comments.slice(index + 1),
      ];
      this.#comments.set(movieId, newComments);
      this._notify(updateType, {movieId: movieId});
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
  }

  #adaptCommentDataToClient = (comment) => {
    const adaptedComment = {
      id: comment.id,
      author: comment.author,
      comment: comment.comment,
      date: comment.date,
      emotion: comment.emotion,
    };

    return adaptedComment;
  }

}
