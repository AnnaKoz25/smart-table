export function initSearching(searchField) {
  return (query, state, action) => {
    // @todo: #5.2 — применить компаратор
    return state[searchField] ? Object.assign({}, query, { // проверка - есть ли что-то в поле поиска
      search: state[searchField] // если есть - помещаем это в query
    }) : query // если в поле поиска ничего, возвращаем просто query
  };
}