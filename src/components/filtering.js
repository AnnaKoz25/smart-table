export function initFiltering(elements) {
  // (@todo: #4.1) — заполнить выпадающие списки опциями
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes) // Получаем ключи из объекта
    .forEach((elementName) => { // Перебираем по именам
      elements[elementName].append( // в каждый элемент добавили опции
      ...Object.values(indexes[elementName]) // получили массив имён (значений опций)
      .map((name) => { // name = и значение, и текстовое содержимое
      const el = document.createElement("option"); // создали и вернули тег опции <option value="name">name</option>
      el.value = name;
      el.textContent = name; 
      return el;
      }))
    })
  }
  const applyFiltering = (query, state, action) => {
    // (@todo: #4.2) — обработать очистку поля
    const buttons = document.querySelectorAll('button[name="clear"]');// нашли все кнопки clear
    buttons.forEach((button) => { //идем по массиву с этими кнопками
      const parent = button.parentElement; //нашли родителя кнопки
      const inp = parent.querySelector("input"); //в этом же родителе нашли поле ввода
      button.addEventListener("click", () => { // если кликнули на кнопку - поле ввода очистилось
        inp.value = "";
        state[button.dataset.field] = "";
      });
    });
    // (@todo: #4.5) — отфильтровать данные (не используя компаратор)
    const filter ={};
    Object.keys(elements).forEach(key => {
      if(elements[key]) {
        if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) { //если в полях ввода что-то есть
          filter[`filter[${elements[key].name}]`] = elements[key].value;//формируем вложенный объект фильтра для query
        }
      }
    })
    return Object.keys(filter).length ? Object.assign({}, query, filter) : query; //если в фильтре что-то добавилось, применяем к запросу
  }
  return {
    updateIndexes,
    applyFiltering
  }
}
