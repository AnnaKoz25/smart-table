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

// Исходные данные используемые в render(), создали api
const api = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));
  const rowsPerPage = parseInt(state.rowsPerPage); // количество страниц привели к числу
  const page = parseInt(state.page ?? 1); // номер страницы по умолчанию 1, тоже надо привести к числу
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
async function render(action) {
  let state = collectState(); // состояние полей из таблицы
  let query = {}; // вместо result = [...data]
  // @todo: использование
  query = applyPagination(query, state, action)
  query = applyFiltering(query, state, action)
  query = applySearching(query, state, action)
  query = applySorting(query, state, action)
  const { total, items } = await api.getRecords(query);
  updatePagination(total, query);//перерисовываем после получения данных с сервера
  sampleTable.render(items);
}

const sampleTable = initTable( // все id темплейтов взяли из html
  {
    tableTemplate: "table", 
    rowTemplate: "row", 
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render,
);

// @todo: инициализация

const {applyPagination, updatePagination} = initPagination(
  sampleTable.pagination.elements, // передаём сюда элементы пагинации, найденные в шаблоне, ищем через sampleTable, из темплейта html
  (el, page, isCurrent) => { // колбэк, чтобы заполнять кнопки страниц данными с номерами
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  },
);

const applySorting = initSorting([ 
  sampleTable.header.elements.sortByDate, // передаем массив элементов, которые вызывают сортировку, чтобы изменять их визуальное представление
  sampleTable.header.elements.sortByTotal, 
]);

const {applyFiltering, updateIndexes} = initFiltering(sampleTable.filter.elements);//передаем поля фильтрации из sampleTable из спец темплейта

const searchInput = sampleTable.search.elements.search;// нашли поле поиска
const searchName = searchInput.getAttribute("name");// записали значение атрибута в переменной
const applySearching = initSearching(searchName);

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

async function init() {
  const indexes = await api.getIndexes();
  updateIndexes(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers
  });
}

init().then(render);
