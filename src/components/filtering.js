import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор

const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  // @todo: #4.1 — заполнить выпадающие списки опциями
  Object.keys(indexes) // Получаем ключи из объекта
    .forEach((elementName) => {
      // Перебираем по именам
      elements[elementName].append(
        // в каждый элемент добавляем опции
        ...Object.values(indexes[elementName]) // формируем массив имён, значений опций
          .map((name) => {
            // используйте name как значение и текстовое содержимое
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name; // @todo: создать и вернуть тег опции <option value="name">name</option>
            const select = document.getElementById("filter");
            return select.appendChild(option);
          }),
      );
    });
  return (data, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    const buttons = document.querySelectorAll('button[name="clear"]');

    buttons.forEach((button) => {
      const parent = button.parentElement;
      const inp = parent.querySelector("input");

      button.addEventListener("click", () => {
        //action - ?
        inp.value = "";
        state[button.dataset.field] = "";
      });
    });

    // @todo: #4.5 — отфильтровать данные используя компаратор

    return data.filter((row) => compare(row, state));
  };
}
