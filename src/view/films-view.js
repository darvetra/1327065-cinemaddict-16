import AbstractView from './abstract-view';

const createFilmsTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

    </section>
  </section>`
);

export default class FilmsView extends AbstractView{
  get template() {
    return createFilmsTemplate();
  }
}
