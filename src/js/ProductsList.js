import database from './database';
import Edit from './EditProduct';

export default class ProductsList {
  constructor(containerClassSelector, editContainerClassSelector) {
    this.container = document.querySelector(containerClassSelector);
    this.containerName = containerClassSelector.substring(1);
    this.generateList();
    this.updateList();
    this.edit = new Edit(editContainerClassSelector);
  }

  generateList() {
    const productsList = document.createElement('ul');
    productsList.classList.add(`${this.containerName}__list`);
    this.list = productsList;
    this.container.appendChild(productsList);
  }

  generateListItem(product) {
    const { id, name, amount, unit } = product;
    const fixedAmount = Number(amount).toFixed(3);
    const listItem = document.createElement('li');
    listItem.setAttribute('data-id', id);
    listItem.innerHTML = `<div class="${this.containerName}__itemContent">${name}, ${
      unit === 'kg' ? fixedAmount : Number(amount)
    } [${unit}]</div>`;
    listItem.classList.add(`${this.containerName}__item`);
    listItem.appendChild(this.generateToolsArea());

    return listItem;
  }

  generateToolsArea() {
    const editIcon = '<i class="fas fa-edit"></i>';
    const deleteIcon = '<i class="fas fa-times"></i>';
    const toolsArea = document.createElement('div');
    toolsArea.classList.add(`${this.containerName}__toolsArea`);
    toolsArea.appendChild(this.generateTool(editIcon, `${this.containerName}__tool--edit`));
    toolsArea.appendChild(this.generateTool(deleteIcon, `${this.containerName}__tool--delete`));
    toolsArea.addEventListener('click', this.handleToolClick.bind(this));

    return toolsArea;
  }

  generateTool(icon, className) {
    const tool = document.createElement('button');
    tool.innerHTML = icon;
    tool.classList.add(`${this.containerName}__tool`);
    tool.classList.add(className);

    return tool;
  }

  handleToolClick(e) {
    const itemId = e.target.closest('li').dataset.id;

    if (e.target.closest('button').classList.contains(`${this.containerName}__tool--edit`)) {
      this.editListItem(itemId);
    } else if (
      e.target.closest('button').classList.contains(`${this.containerName}__tool--delete`)
    ) {
      this.deleteListItem(itemId);
    }
  }

  editListItem(itemId) {
    this.edit.setItem(itemId);
    this.edit.showWindow();
  }

  deleteListItem(itemId) {
    const newProductList = database.products.filter((product) => product.id !== Number(itemId));
    database.products = newProductList;
    this.updateList();
  }

  addProductsToListByCategory(categoriesList, productsList) {
    categoriesList.forEach((category) => {
      const categoryArray = productsList.filter((product) => product.category === category.key);
      if (categoryArray.length > 0) {
        this.list.appendChild(this.generateCategorySeparator(category));
        categoryArray.forEach((product) => {
          this.list.appendChild(this.generateListItem(product));
        });
      }
    });
  }

  generateCategorySeparator(category) {
    const categorySeparator = document.createElement('li');
    categorySeparator.textContent = category.value;
    categorySeparator.classList.add(`${this.containerName}__item`);
    categorySeparator.classList.add(`${this.containerName}__item--separator`);

    return categorySeparator;
  }

  generateListSummary() {
    const summaryListItem = document.createElement('li');
    summaryListItem.classList.add(`${this.containerName}__item`);
    summaryListItem.classList.add(`${this.containerName}__item--summary`);
    const summary = this.getProductsListSummary();
    const { productsAmount, productsTotalWeight, productsPieces } = summary;
    if (database.products.length > 0) {
      const fixedProductsTotalWeight = productsTotalWeight.toFixed(3);
      const summaryText = `Łącznie ${productsAmount} różnych produktów na liście. Produkty na wagę: ${fixedProductsTotalWeight} kg, produkty na sztuki: ${productsPieces}.`;
      summaryListItem.textContent = summaryText;
    } else {
      const summaryText = 'Lista zakupów jest pusta.';
      summaryListItem.textContent = summaryText;
    }

    return summaryListItem;
  }

  getProductsListSummary() {
    const productsAmount = database.products.length;
    let productsTotalWeight = 0;
    let productsPieces = 0;
    database.products.forEach((product) => {
      if (product.unit === 'kg') {
        productsTotalWeight += Number(product.amount);
      }
      if (product.unit === 'szt') {
        productsPieces += Number(product.amount);
      }
    });

    return {
      productsAmount,
      productsTotalWeight,
      productsPieces,
    };
  }

  updateList() {
    this.list.innerHTML = '';
    this.addProductsToListByCategory(database.categories, database.products);
    this.list.appendChild(this.generateListSummary());
  }
}
