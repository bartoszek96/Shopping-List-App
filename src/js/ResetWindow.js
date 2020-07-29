export default class ResetWindow {
  constructor(containerClassSelector) {
    this.container = document.querySelector(containerClassSelector);
    this.containerName = containerClassSelector.substring(1);

    this.generateEditWindowHTML();
    this.cancelButton = document.querySelector(`.${this.containerName}__input--cancel`);
    this.cancelButton.addEventListener('click', this.hide.bind(this));
  }

  generateEditWindowHTML() {
    this.container.appendChild(this.generateInfoElement());
    this.container.appendChild(this.generateButtonsWrapper());
  }

  generateInfoElement() {
    const infoElement = document.createElement('div');
    infoElement.classList.add(`${this.containerName}__info`);
    infoElement.textContent = 'Czy na pewno chcesz zresetować listę, kategorie i pamięć lokalną?';

    return infoElement;
  }

  generateButtonsWrapper() {
    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.classList.add(`${this.containerName}__buttonsWrapper`);
    buttonsWrapper.appendChild(this.generateButton('accept', 'TAK'));
    buttonsWrapper.appendChild(this.generateButton('cancel', 'NIE'));

    return buttonsWrapper;
  }

  generateButton(modificator, text) {
    const button = document.createElement('button');
    button.classList.add(`${this.containerName}__input`);
    button.classList.add(`${this.containerName}__input--${modificator}`);
    button.textContent = text;

    return button;
  }

  show() {
    this.container.classList.add(`${this.containerName}--show`);
  }

  hide() {
    this.container.classList.remove(`${this.containerName}--show`);
  }
}
