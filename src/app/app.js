import html from './app.html';
import './app.css';
import { createTable } from './contragents/table/table';
import { createModal } from './contragents/modal/modal';

let contragents = [
  {
    id: 1,
    name: 'ООО "Ромашка"',
    inn: '77070838931',
    address: 'г. Москва, ул. Ленина, д. 1',
    kpp: '770701001',
  },
  {
    id: 2,
    name: 'АО "Вектор"',
    inn: '50291345678',
    address: 'г. Санкт-Петербург, Невский пр., д. 25',
    kpp: '502901001',
  },
  {
    id: 3,
    name: 'ИП Иванов Иван Иванович',
    inn: '36640693907',
    address: 'г. Воронеж, ул. Мира, д. 10',
    kpp: '366401001',
  },
];

function getNextId() {
  return contragents.reduce((maxId, contragent) => Math.max(maxId, contragent.id), 0) + 1;
}

const rootElement = document.getElementById('root');
rootElement.innerHTML = html;

const tableContainer = document.getElementById('contragents-table');
const modalContainer = document.getElementById('contragents-modal');
const addButton = document.getElementById('addContragentBtn');

const table = createTable(tableContainer, {
  onEdit(id) {
    const contragent = contragents.find((item) => item.id === id);
    if (contragent) {
      modal.open(contragent);
    }
  },
  onDelete(id) {
    contragents = contragents.filter((item) => item.id !== id);
    table.render(contragents);
  },
});

const modal = createModal(modalContainer, {
  onSave(data) {
    if (data.id != null) {
      contragents = contragents.map((item) => (
        item.id === data.id
          ? { ...item, name: data.name, inn: data.inn, address: data.address, kpp: data.kpp }
          : item
      ));
    } else {
      contragents = [
        ...contragents,
        {
          id: getNextId(),
          name: data.name,
          inn: data.inn,
          address: data.address,
          kpp: data.kpp,
        },
      ];
    }

    table.render(contragents);
  },
  onCancel() {},
});

addButton.addEventListener('click', () => {
  modal.open();
});

table.render(contragents);
