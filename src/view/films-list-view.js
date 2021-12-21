import AbstractView from './abstract-view';

const createFilmsListTemplate = () => '<div class="films-list__container"></div>';

export default class FilmsListView extends AbstractView{
  get template() {
    return createFilmsListTemplate();
  }
}
