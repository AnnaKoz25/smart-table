import { sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  return (query, state, action) => {
    let field = null;
    let order = null;

    if (action && action.name === "sort") {
      // @todo: #3.1 — запомнить выбранный режим сортировки

      action.dataset.value = sortMap[action.dataset.value]; // Сохраним и применим как текущее следующее состояние из Map
      field = action.dataset.field; // Информация о сортируемом поле есть также в кнопке
      order = action.dataset.value; // Направление заберём прямо из датасета для точности

      // @todo: #3.2 — сбросить сортировки остальных колонок

      columns.forEach((column) => { // Перебираем элементы (в columns находится массив кнопок (в данном случае их 2))
        if (column.dataset.field !== action.dataset.field) { // Если это не та кнопка, которую нажал пользователь
          column.dataset.value = "none"; // то сбрасываем её в начальное состояние
        }
      });
    } else {
      // @todo: #3.3 — получить выбранный режим сортировки
      columns.forEach((column) => { // Снова перебираем все элементы (кнопки сортировки)
        if (column.dataset.value !== "none") { // Ищем кнопку, что находится не в начальном состоянии (предполагаем, что одна, т.к. другую мы сбросили)
          field = column.dataset.field; // Сохраняем в переменных поле
          order = column.dataset.value; // и порядок сортировки
        }
      });
    }
    const sort = (field && order !== 'none') ? `${field}:${order}` : null //в переменную попадет параметр в виде поле:порядок
    return sort ? Object.assign({}, query, {sort}) : query; // если сортировка применяется - применяем к query, если нет - query без изменений
  };
}
