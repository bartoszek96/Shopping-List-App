import {
  generateButton,
  generateInput,
  generateValidationElement,
} from './generateElementFunctions';
import database from './database';

export default class CategoryForm {
  constructor(containerClassSelector) {
    this.container = document.querySelector(containerClassSelector);
    this.containerName = containerClassSelector.substring(1);
    this.generate();

    this.input = document.querySelector(`.${this.containerName}__newCategoryInput`);
    this.info = document.querySelector(`.${this.containerName}__validationInfo`);
  }

  generate() {
    this.container.appendChild(this.generateForm());
    this.container.appendChild(this.generateValidationInfoElement());
    this.container.appendChild(this.generateResetButton());
  }

  generateForm() {
    const form = document.createElement('form');
    form.classList.add(`${this.containerName}__newCategory`);
    form.appendChild(this.generateNewCategoryInput());
    form.appendChild(this.generateNewCategorySubmitButton());

    return form;
  }

  generateValidationInfoElement() {
    const validationInfoElement = generateValidationElement(this.containerName);

    return validationInfoElement;
  }

  generateResetButton() {
    const resetButton = generateButton('button', 'RESET');
    resetButton.classList.add(`${this.containerName}__resetButton`);
    resetButton.classList.add(`${this.containerName}__input`);

    return resetButton;
  }

  generateNewCategoryInput() {
    const newCategoryInput = generateInput('text', 'Wpisz nazwę nowej kategorii');
    newCategoryInput.classList.add(`${this.containerName}__newCategoryInput`);
    newCategoryInput.classList.add(`${this.containerName}__input`);

    return newCategoryInput;
  }

  generateNewCategorySubmitButton() {
    const newCategorySubmitButton = generateButton('submit', 'DODAJ');
    newCategorySubmitButton.classList.add(`${this.containerName}__newCategorySubmitButton`);
    newCategorySubmitButton.classList.add(`${this.containerName}__input`);

    return newCategorySubmitButton;
  }

  submitHandler(e) {
    e.preventDefault();
    const newCategory = this.input.value;

    if (newCategory !== '' && !this.isCategoryExist(newCategory)) {
      this.input.value = '';
      this.info.textContent = '';
      this.input.setAttribute('placeholder', `Dodano kategorię ${newCategory}`);
      const newCategoryObject = {};
      newCategoryObject.key = newCategory;
      newCategoryObject.value = newCategory;
      database.categories.push(newCategoryObject);
    } else if (this.isCategoryExist(newCategory)) {
      this.info.textContent = 'Kategoria już istnieje.';
    } else {
      this.info.textContent = 'Wpisz nazwę nowej kategorii.';
    }

    setTimeout(() => {
      this.input.setAttribute('placeholder', 'Wpisz nazwę nowej kategorii');
    }, 1500);
  }

  isCategoryExist(newCategory) {
    let result = false;
    database.categories.forEach((category) => {
      if (category.key === newCategory || category.value === newCategory) {
        result = true;
      }
    });
    return result;
  }
}
