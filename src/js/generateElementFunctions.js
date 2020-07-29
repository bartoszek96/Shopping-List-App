export const generateButton = (type, innerText) => {
  const button = document.createElement('button');
  button.setAttribute('type', type);
  button.innerHTML = innerText;

  return button;
};

export const generateInput = (type, placeholder) => {
  const input = document.createElement('input');
  input.setAttribute('type', type);
  input.setAttribute('placeholder', placeholder);

  return input;
};

export const generateValidationElement = (containerName) => {
  const validationInfoElement = document.createElement('div');
  validationInfoElement.classList.add(`${containerName}__validationInfo`);

  return validationInfoElement;
};
