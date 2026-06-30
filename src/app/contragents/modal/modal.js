import { Modal } from 'flowbite';
import template from './modal.html';
import './modal.css';

const FIELD_CONFIG = [
  {
    name: 'name',
    inputId: 'contragentName',
    errorId: 'contragentNameError',
    message: 'Укажите наименование',
    isValid: (value) => value.trim() !== '',
  },
  {
    name: 'inn',
    inputId: 'contragentInn',
    errorId: 'contragentInnError',
    message: 'ИНН должен содержать 11 цифр',
    isValid: (value) => /^\d{11}$/.test(value),
  },
  {
    name: 'address',
    inputId: 'contragentAddress',
    errorId: 'contragentAddressError',
    message: 'Укажите адрес',
    isValid: (value) => value.trim() !== '',
  },
  {
    name: 'kpp',
    inputId: 'contragentKpp',
    errorId: 'contragentKppError',
    message: 'КПП должен содержать 9 цифр',
    isValid: (value) => /^\d{9}$/.test(value),
  },
];

function validateForm(values) {
  const errors = {};

  FIELD_CONFIG.forEach(({ name, message, isValid }) => {
    if (!isValid(values[name] ?? '')) {
      errors[name] = message;
    }
  });

  return errors;
}

export function createModal(container, { onSave, onCancel }) {
  container.innerHTML = template;

  const modalElement = container.querySelector('#contragentModal');
  const form = container.querySelector('#contragentForm');
  const cancelButton = container.querySelector('#contragentCancelBtn');

  let editingId = null;

  const modal = new Modal(modalElement, {
    backdrop: 'dynamic',
    closable: true,

    onHide: () => {
      editingId = null;
      clearErrors();
    },
  });

  const inputs = {
    name: container.querySelector('#contragentName'),
    inn: container.querySelector('#contragentInn'),
    address: container.querySelector('#contragentAddress'),
    kpp: container.querySelector('#contragentKpp'),
  };

  function clearErrors() {
    FIELD_CONFIG.forEach(({ inputId, errorId }) => {
      container.querySelector(`#${inputId}`).classList.remove('modal-input--invalid');
      const errorElement = container.querySelector(`#${errorId}`);
      errorElement.textContent = '';
      errorElement.classList.add('hidden');
    });
  }

  function showErrors(errors) {
    FIELD_CONFIG.forEach(({ name, inputId, errorId, message }) => {
      if (!errors[name]) {
        return;
      }

      const input = container.querySelector(`#${inputId}`);
      const errorElement = container.querySelector(`#${errorId}`);
      input.classList.add('modal-input--invalid');
      errorElement.textContent = errors[name] || message;
      errorElement.classList.remove('hidden');
    });
  }

  function getFormValues() {
    return {
      name: inputs.name.value.trim(),
      inn: inputs.inn.value.trim(),
      address: inputs.address.value.trim(),
      kpp: inputs.kpp.value.trim(),
    };
  }

  function setFormValues(contragent) {
    inputs.name.value = contragent?.name ?? '';
    inputs.inn.value = contragent?.inn ?? '';
    inputs.address.value = contragent?.address ?? '';
    inputs.kpp.value = contragent?.kpp ?? '';
  }

  function open(contragent = null) {
    editingId = contragent?.id ?? null;
    clearErrors();
    setFormValues(contragent);
    modal.show();
    inputs.name.focus();
  }

  function close() {
    modal.hide();
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors();

    const values = getFormValues();
    const errors = validateForm(values);

    if (Object.keys(errors).length > 0) {
      showErrors(errors);
      return;
    }

    onSave({
      id: editingId,
      ...values,
    });
    close();
  });

  cancelButton.addEventListener('click', () => {
    onCancel();
    close();
  });

  modalElement.addEventListener('click', (event) => {
    if (event.target === modalElement) {
      onCancel();
      close();
    }
  });

  return { open, close };
}
