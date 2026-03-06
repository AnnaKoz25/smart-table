import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
// @todo: подключение
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// Исходные данные используемые в render()
const { data, ...indexes } = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));
  const rowsPerPage = parseInt(state.rowsPerPage); // приведём количество страниц к числу
  const page = parseInt(state.page ?? 1); // номер страницы по умолчанию 1 и тоже число
  const from = parseFloat(state.totalFrom);
  const to = parseFloat(state.totalTo);
  return {
    ...state,
    rowsPerPage,
    page,
    total: [from, to],
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
  let state = collectState(); // состояние полей из таблицы
  let result = [...data]; // копируем для последующего изменения
  // @todo: использование

  result = applySearching(result, state, action);

  result = applyFiltering(result, state, action); //фильтрация до сортировки

  result = applySorting(result, state, action); //сортировка до пагинации

  result = applyPagination(result, state, action);

  sampleTable.render(result);
}

const sampleTable = initTable(
  {
    tableTemplate: "table", // из html
    rowTemplate: "row", // из html
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render,
);

// @todo: инициализация

const applyPagination = initPagination(
  sampleTable.pagination.elements, // передаём сюда элементы пагинации, найденные в шаблоне
  (el, page, isCurrent) => { // колбэк, чтобы заполнять кнопки страниц данными
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  },
);

const applySorting = initSorting([ 
  sampleTable.header.elements.sortByDate, // передаем массив элементов, которые вызывают сортировку, 
  sampleTable.header.elements.sortByTotal, //чтобы изменять их визуальное представление
]);

const applyFiltering = initFiltering(sampleTable.filter.elements, { // в аргументах элементы фильтра
  searchBySeller: indexes.sellers, // для элемента с именем searchBySeller устанавливаем массив продавцов (для выпадающего списка)
});

const searchInput = sampleTable.search.elements.search;
const searchName = searchInput.getAttribute("name");

const applySearching = initSearching(searchName);

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

render();
