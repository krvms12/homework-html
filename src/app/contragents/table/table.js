import template from './table.html';
import './table.css';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function createTable(container, { onEdit, onDelete }) {
  container.innerHTML = template;
  const tbody = container.querySelector('#contragents-tbody');

  function render(contragents) {
    if (contragents.length === 0) {
      tbody.innerHTML = `
        <tr class="bg-white border-b border-[#E5E7EB] h-[55px]">
          <td colspan="5" class="px-6 py-4 text-sm text-[#6B7280] text-center">Нет контрагентов</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = contragents.map((contragent) => `
      <tr class="contragent-row bg-white border-b border-[#E5E7EB] h-[55px]" data-id="${contragent.id}">
        <td class="px-6 py-0 text-sm text-[#111827]">${escapeHtml(contragent.name)}</td>
        <td class="px-6 py-0 text-sm text-[#6B7280]">${escapeHtml(contragent.inn)}</td>
        <td class="px-6 py-0 text-sm text-[#6B7280]">${escapeHtml(contragent.address)}</td>
        <td class="px-6 py-0 text-sm text-[#6B7280]">${escapeHtml(contragent.kpp)}</td>
        <td class="px-6 py-0 text-right">
          <button
            type="button"
            data-action="delete"
            data-id="${contragent.id}"
            class="text-sm font-medium text-[#B45151] hover:text-red-700"
          >Удалить</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-action="delete"]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        onDelete(Number(button.dataset.id));
      });
    });

    tbody.querySelectorAll('.contragent-row').forEach((row) => {
      row.addEventListener('dblclick', (event) => {
        event.stopPropagation();
        onEdit(Number(row.dataset.id));
      });
    });
  }

  return { render };
}
