import database from './database';

export default class Storage {
  constructor() {
    this.initialize();
  }

  initialize() {
    if (localStorage.getItem('database') === null) {
      const databaseJSON = JSON.stringify(database);
      localStorage.setItem('database', databaseJSON);
      const defaultCategoriesJSON = JSON.stringify(database.categories);
      localStorage.setItem('defaultCategories', defaultCategoriesJSON);
    } else {
      const localStorageProductsList = JSON.parse(localStorage.getItem('database'));
      database.categories = [...localStorageProductsList.categories];
      database.currentId = localStorageProductsList.currentId;
      database.products = [...localStorageProductsList.products];
    }
  }

  setLocalStorage() {
    const data = JSON.stringify(database);
    localStorage.setItem('database', data);
  }

  resetLocalStorage() {
    const defaultCategories = JSON.parse(localStorage.getItem('defaultCategories'));
    database.currentId = 0;
    database.products = [];
    database.categories = [...defaultCategories];
    this.setLocalStorage();
  }
}
