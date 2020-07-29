import {
  generateButton,
  generateInput,
  generateValidationElement,
} from './generateElementFunctions';
import database from './database';

export default class Form {
  constructor(containerClassSelector) {
    this.container = document.querySelector(containerClassSelector);
    this.containerName = containerClassSelector.substring(1);
    this.generateForm();

    this.inputSelect = document.querySelector(`.${this.containerName}__inputSelect`);
    this.generateInputSelectOptions();

    this.form = document.querySelector(`.${this.containerName}__form`);
    this.inputNumber = document.querySelector(`.${this.containerName}__inputNumber`);
    this.inputCheckbox = document.querySelector(`.${this.containerName}__inputCheckbox`);

    this.nameInput = document.querySelector(`.${this.containerName}__inputText`);
    this.amountInput = document.querySelector(`.${this.containerName}__inputNumber`);
    this.categoryInput = document.querySelector(`.${this.containerName}__inputSelect`);
    this.unitInput = document.querySelector(`.${this.containerName}__inputCheckbox`);
    this.validationInfo = document.querySelector(`.${this.containerName}__validationInfo`);

    this.inputCheckbox.addEventListener('change', this.changeUnit.bind(this));
  }

  generateForm() {
    const form = document.createElement('form');
    form.classList.add(`${this.containerName}__form`);

    form.appendChild(this.generateProductNamAndAmountInputsWrapper());
    form.appendChild(this.generateCategorySelect());
    form.appendChild(this.generateUnitCheckboxInput());
    form.appendChild(this.generateSubmitButton());
    form.appendChild(this.generateValidationInfoElement());

    this.container.appendChild(form);
  }

  generateProductNamAndAmountInputsWrapper() {
    const inputsWrapper = document.createElement('div');
    inputsWrapper.classList.add(`${this.containerName}__wrapper`);
    inputsWrapper.appendChild(this.generateProductNameInput());
    inputsWrapper.appendChild(this.generateProductAmountInput());

    return inputsWrapper;
  }

  generateProductNameInput() {
    const productNameInput = generateInput('text', 'Wpisz nazwę produktu');
    productNameInput.classList.add(`${this.containerName}__inputText`);
    productNameInput.classList.add(`${this.containerName}__input`);

    return productNameInput;
  }

  generateProductAmountInput() {
    const productAmountInput = generateInput('number', 'Ilość [szt]');
    productAmountInput.setAttribute('step', '1');
    productAmountInput.setAttribute('min', '0');
    productAmountInput.classList.add(`${this.containerName}__inputNumber`);
    productAmountInput.classList.add(`${this.containerName}__input`);

    return productAmountInput;
  }

  generateCategorySelect() {
    const label = document.createElement('label');
    label.classList.add(`${this.containerName}__wrapper`);

    const textContainer = document.createElement('div');
    textContainer.textContent = 'Wybierz kategorię:';

    const categorySelect = document.createElement('select');
    categorySelect.classList.add(`${this.containerName}__inputSelect`);
    categorySelect.classList.add(`${this.containerName}__input`);

    label.appendChild(textContainer);
    label.appendChild(categorySelect);

    return label;
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

  generateUnitCheckboxInput() {
    const label = document.createElement('label');
    label.classList.add(`${this.containerName}__wrapper`);

    const textContainer = document.createElement('div');
    textContainer.textContent = 'Na wagę?';

    const categorySelect = document.createElement('input');
    categorySelect.setAttribute('type', 'checkbox');
    categorySelect.classList.add(`${this.containerName}__inputCheckbox`);
    categorySelect.classList.add(`${this.containerName}__input`);

    label.appendChild(textContainer);
    label.appendChild(categorySelect);

    return label;
  }

  generateSubmitButton() {
    const submitButton = generateButton('submit', 'DODAJ');
    submitButton.classList.add(`${this.containerName}__submitButton`);
    submitButton.classList.add(`${this.containerName}__input`);

    return submitButton;
  }

  generateValidationInfoElement() {
    const validationInfoElement = generateValidationElement(this.containerName);

    return validationInfoElement;
  }

  categorySort(a, b) {
    let result;
    if (a.value < b.value) {
      result = -1;
    } else if (a.value > b.value) {
      result = 1;
    } else {
      result = 0;
    }

    return result;
  }

  changeUnit() {
    const isOnWeight = this.inputCheckbox.checked;

    if (isOnWeight) {
      this.inputNumber.setAttribute('placeholder', 'Waga [kg]');
      this.inputNumber.setAttribute('step', '0.001');
    } else {
      this.inputNumber.setAttribute('placeholder', 'Ilość [szt]');
      this.inputNumber.setAttribute('step', '1');
    }
  }

  handleFormSubmit() {
    if (
      this.nameInput.value !== '' &&
      this.amountInput.value !== '' &&
      this.amountInput.value > 0
    ) {
      this.validationInfo.innerHTML = '';

      database.currentId += 1;
      database.products.push(this.newProductObject());

      this.nameInput.value = '';
      this.amountInput.value = '';
    } else if (this.nameInput.value === '' && this.amountInput.value !== '') {
      this.validationInfo.innerHTML = 'Wpisz nazwę produktu.';
    } else if (this.nameInput.value !== '' && this.amountInput.value === '') {
      this.validationInfo.innerHTML = 'Wpisz ilość produktu.';
    } else if (
      this.nameInput.value !== '' &&
      this.amountInput.value !== '' &&
      this.amountInput.value <= 0
    ) {
      this.validationInfo.innerHTML = 'Ilość musi być większa od zera.';
    } else {
      this.validationInfo.innerHTML = 'Wpisz nazwę produktu i jego ilość.';
    }
  }

  newProductObject() {
    const isOnWeight = this.unitInput.checked;

    const newProductId = database.currentId;
    const newProductName = this.nameInput.value;
    const newProductCategory = this.categoryInput.value;
    const newProductAmount = this.amountInput.value;
    const newProductUnit = isOnWeight ? 'kg' : 'szt';

    const newProduct = {};
    newProduct.id = newProductId;
    newProduct.name = newProductName;
    newProduct.category = newProductCategory;
    newProduct.amount = newProductAmount;
    newProduct.unit = newProductUnit;

    return newProduct;
  }
}
