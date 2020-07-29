import {
  generateButton,
  generateInput,
  generateValidationElement,
} from './generateElementFunctions';
import database from './database';

export default class Edit {
  constructor(containerClassSelector) {
    this.container = document.querySelector(containerClassSelector);
    this.containerName = containerClassSelector.substring(1);
    this.generateEditForm();

    this.editForm = document.querySelector(`.${this.containerName}__form`);
    this.editValidation = document.querySelector(`.${this.containerName}__validationInfo`);
    this.inputText = document.querySelector(`.${this.containerName}__inputText`);
    this.inputNumber = document.querySelector(`.${this.containerName}__inputNumber`);
    this.inputSelect = document.querySelector(`.${this.containerName}__inputSelect`);
    this.submitButton = document.querySelector(`.${this.containerName}__submitButton`);
    this.cancelButton = document.querySelector(`.${this.containerName}__cancelButton`);
    this.productToEdit = null;

    this.editForm.addEventListener('submit', this.editListItem.bind(this));
    this.cancelButton.addEventListener('click', this.hideWindow.bind(this));
  }

  generateEditForm() {
    const form = document.createElement('form');
    form.classList.add(`${this.containerName}__form`);

    form.appendChild(this.generateWrapperWithInputs());
    form.appendChild(this.generateWrapperWithButtons());
    form.appendChild(this.generateValidationInfoElement());

    this.container.appendChild(form);
  }

  generateWrapperWithInputs() {
    const wrapper = document.createElement('div');
    wrapper.classList.add(`${this.containerName}__wrapper`);
    wrapper.classList.add(`${this.containerName}__wrapper--inputs`);

    wrapper.appendChild(this.generateProductNameInput());
    wrapper.appendChild(this.generateProductAmountInput());
    wrapper.appendChild(this.generateProductCategorySelect());

    return wrapper;
  }

  generateProductNameInput() {
    const productNameInput = generateInput('text', 'Wpisz nową nazwę produktu');
    productNameInput.classList.add(`${this.containerName}__inputText`);
    productNameInput.classList.add(`${this.containerName}__input`);
    productNameInput.classList.add(`${this.containerName}__input--wide`);

    return productNameInput;
  }

  generateProductAmountInput() {
    const productAmountInput = generateInput('number', 'Ilość [szt]');
    productAmountInput.setAttribute('step', '1');
    productAmountInput.setAttribute('min', '0');
    productAmountInput.classList.add(`${this.containerName}__inputNumber`);
    productAmountInput.classList.add(`${this.containerName}__input`);
    productAmountInput.classList.add(`${this.containerName}__input--wide`);

    return productAmountInput;
  }

  generateProductCategorySelect() {
    const categorySelect = document.createElement('select');
    categorySelect.classList.add(`${this.containerName}__inputSelect`);
    categorySelect.classList.add(`${this.containerName}__input`);
    categorySelect.classList.add(`${this.containerName}__input--wide`);

    return categorySelect;
  }

  generateInputSelectOptions() {
    this.inputSelect.innerHTML = '';
    database.categories.sort(this.categorySort).forEach((category) => {
      const { key, value } = category;
      const option = document.createElement('option');
      option.setAttribute('value', `${key}`);
      option.textContent = `${value}`;
      this.inputSelect.appendChild(option);
    });
  }

  generateWrapperWithButtons() {
    const wrapper = document.createElement('div');
    wrapper.classList.add(`${this.containerName}__wrapper`);

    wrapper.appendChild(this.generateSubmitButton());
    wrapper.appendChild(this.generateCancelButton());

    return wrapper;
  }

  generateSubmitButton() {
    const submitButton = generateButton('submit', 'POTWIERDŹ');
    submitButton.classList.add(`${this.containerName}__submitButton`);
    submitButton.classList.add(`${this.containerName}__input`);
    submitButton.classList.add(`${this.containerName}__input--narrow`);

    return submitButton;
  }

  generateCancelButton() {
    const cancelButton = generateButton('button', 'ANULUJ');
    cancelButton.classList.add(`${this.containerName}__cancelButton`);
    cancelButton.classList.add(`${this.containerName}__input`);
    cancelButton.classList.add(`${this.containerName}__input--narrow`);

    return cancelButton;
  }

  generateValidationInfoElement() {
    const validationInfoElement = generateValidationElement(this.containerName);

    return validationInfoElement;
  }

  editListItem(e) {
    e.preventDefault();

    if (
      this.inputText.value !== '' &&
      this.inputNumber.value !== '' &&
      this.inputNumber.value > 0
    ) {
      this.editValidation.innerHTML = '';

      this.productToEdit.name = this.inputText.value;
      this.productToEdit.amount = this.inputNumber.value;
      this.productToEdit.category = this.inputSelect.value;
      this.hideWindow();
    } else if (this.inputText.value === '' && this.inputNumber.value !== '') {
      this.editValidation.innerHTML = 'Wpisz nazwę produktu.';
    } else if (this.inputText.value !== '' && this.inputNumber.value === '') {
      this.editValidation.innerHTML = 'Wpisz ilość produktu.';
    } else if (
      this.inputText.value !== '' &&
      this.inputNumber.value !== '' &&
      this.inputNumber.value <= 0
    ) {
      this.editValidation.innerHTML = 'Ilość musi być większa od zera.';
    } else {
      this.editValidation.innerHTML = 'Wpisz nazwę produktu i jego ilość.';
    }
  }

  setItem(itemId) {
    this.productToEdit = database.products.filter((product) => product.id === Number(itemId));
    this.productToEdit = this.productToEdit[0];
    const { name, amount, unit, category } = this.productToEdit;
    this.inputText.value = name;
    this.inputSelect.value = category;
    this.generateInputSelectOptions();

    if (unit === 'kg') {
      this.inputNumber.setAttribute('placeholder', 'Waga [kg]');
      this.inputNumber.setAttribute('step', '0.001');
      this.inputNumber.value = Number(amount).toFixed(3);
    } else {
      this.inputNumber.setAttribute('placeholder', 'Ilość [szt]');
      this.inputNumber.setAttribute('step', '1');
      this.inputNumber.value = amount;
    }
  }

  showWindow() {
    this.container.classList.add('edit--show');
  }

  hideWindow() {
    this.container.classList.remove('edit--show');
  }
}
