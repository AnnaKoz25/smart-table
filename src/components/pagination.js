import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage,
) => {
  // @todo: #2.3 — (подготовить шаблон кнопки для страницы и очистить контейнер)
  const pageTemplate = pages.firstElementChild.cloneNode(true); // в качестве шаблона берём первый элемент из контейнера со страницами
  pages.firstElementChild.remove(); // и удаляем его (предполагаем, что там больше ничего нет) будем потом перерисовывать на этом месте новый элемент по шаблону

  // @todo: #2.1 — (посчитать количество страниц, объявить переменные и константы)
  let pageCount; //количество страниц, будет меняться в зависимости от данных на сервере
  const applyPagination = (query, state, action) => { //часть 1 - до запроса на сервер
    const limit = state.rowsPerPage; // кол-во строк на странице, раньше была rowsPerPage, сейчас приходит в query с сервера
    let page = state.page; //страница переменной
    // @todo: #2.6 — (обработать действия)
    if (action)
      switch (action.name) {
        case "prev":
          page = Math.max(1, page - 1); // на предыдущую страницу
          break;
        case "next":
          page = Math.min(pageCount, page + 1); // на следующую страницу
          break;
        case "first":
          page = 1; // на первую страницу
          break;
        case "last":
          page = pageCount; // на последнюю страницу
          break;
      }
    return Object.assign({}, query, { // параметры добавляются к query, исходный объект не меняется
      limit,
      page,
    });
  };
  const updatePagination = (total, { page, limit }) => { //часть 2 - обработка данных с сервера
    pageCount = Math.ceil(total / limit); // обновляем количество страниц исходя из новых данных
    // @todo: #2.4 — (получить список видимых страниц и вывести их)
    const visiblePages = getPages(page, pageCount, 5); // массив страниц, которые будут видны, у нас - 5 страниц
    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => { // перебираем массив страниц и создаём для каждой кнопку
        const el = pageTemplate.cloneNode(true); // клонируем шаблон, который записали в самом начале initPagination
        return createPage(el, pageNumber, pageNumber === page); // вызываем колбэк из настроек, чтобы заполнить кнопку данными
      }),
    );
    // @todo: #2.5 — (обновить статус пагинации)
    fromRow.textContent = (page - 1) * limit + 1; // С какой строки выводим
    toRow.textContent = Math.min(page * limit, total); // До какой строки выводим, если это последняя страница, то отображаем оставшееся количество
    totalRows.textContent = total; // Сколько всего строк выводим на всех страницах вместе (после фильтрации будет меньше)
  };
  return {
    updatePagination,
    applyPagination,
  };
};