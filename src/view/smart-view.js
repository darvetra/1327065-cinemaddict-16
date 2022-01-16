import AbstractView from './abstract-view.js';

export default class SmartView extends AbstractView {
  #data = {};

  // Метод updateData, который будет обновлять данные в свойстве #data, а потом вызывать обновление шаблона
  updateData = (update, justDataUpdating) => {
    if (!update) {
      return;
    }

    this.#data = {...this.#data, ...update};

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  // Метод updateElement, его задача удалить старый DOM элемент, вызвать генерацию нового и заменить один на другой
  // "Фокус" в том, что при генерации нового элемента будет снова зачитано свойство #data.
  // И если мы сперва обновим его, а потом шаблон, то в итоге получим элемент с новыми данными
  updateElement = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  restoreHandlers = () => {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }
}
