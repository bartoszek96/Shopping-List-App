import CategoryForm from './CategoryForm';
import Storage from './Storage';
import ProductsList from './ProductsList';
import ProductForm from './ProductForm';
import ResetWindow from './ResetWindow';

const storage = new Storage();
const productForm = new ProductForm('.newProduct');
const resetWindow = new ResetWindow('.resetWindow');
const categoryForm = new CategoryForm('.tools');
const list = new ProductsList('.products', '.edit');

const newProductForm = document.querySelector('.newProduct__form');
const newCategoryForm = document.querySelector('.tools__newCategory');
const editForm = document.querySelector('.edit__form');
const resetButton = document.querySelector('.tools__resetButton');
const acceptResetButton = document.querySelector('.resetWindow__input--accept');

newProductForm.addEventListener('submit', (e) => {
  e.preventDefault();
  productForm.handleFormSubmit();
  list.updateList();
  storage.setLocalStorage();
});

newCategoryForm.addEventListener('submit', (e) => {
  categoryForm.submitHandler(e);
  storage.setLocalStorage();
  productForm.generateInputSelectOptions();
});

editForm.addEventListener('submit', () => {
  storage.setLocalStorage();
  list.updateList();
});

resetButton.addEventListener('click', () => {
  resetWindow.show();
});

acceptResetButton.addEventListener('click', () => {
  storage.resetLocalStorage();
  productForm.generateInputSelectOptions();
  list.updateList();
  resetWindow.hide();
});
