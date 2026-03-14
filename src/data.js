import { makeIndex } from "./lib/utils.js";
const BASE_URL = "https://webinars.webdev.education-services.ru/sp7-api";
export function initData(sourceData) {
  // переменные для кеширования данных
  let sellers;
  let customers;
  let lastResult;
  let lastQuery;

  // функция для приведения строк в тот вид, который нужен нашей таблице - строк и столбцов
  const mapRecords = (data) =>
    data.map((item) => ({
      id: item.receipt_id,
      date: item.date,
      seller: sellers[item.seller_id],
      customer: customers[item.customer_id],
      total: item.total_amount,
    }));

  // функция для получения индексов, запрашиваем с сервера, если их у нас еще нет
  const getIndexes = async () => {
    if (!sellers || !customers) { // если индексы ещё не установлены, то делаем запросы
      [sellers, customers] = await Promise.all([ // запрашиваем и деструктурируем в уже объявленные ранее переменные (которые для кеширования)
        fetch(`${BASE_URL}/sellers`).then((res) => res.json()), // продавцы
        fetch(`${BASE_URL}/customers`).then((res) => res.json()), // покупатели
      ]);
    }
    return { sellers, customers };
  };

  // функция получения записей о продажах с сервера, находятся в url после ? в query
  const getRecords = async (query, isUpdated = false) => {
    const qs = new URLSearchParams(query); // преобразуем объект параметров в SearchParams объект, представляющий query часть url (после ?)
    const nextQuery = qs.toString(); // приводим к строке

    if (lastQuery === nextQuery && !isUpdated) { // isUpdated параметр нужен, чтобы иметь возможность делать запрос без кеша
      return lastResult; // если параметры запроса не поменялись (последний query = новому query), то отдаём сохранённые ранее данные - последний полученный результат
    }

    // если прошлый query не был ранее установлен или поменялись параметры, то запрашиваем данные с сервера
    const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
    const records = await response.json();// записали ответ сервера в переменную

    lastQuery = nextQuery; // сохраняем для следующих запросов, обновляем последнюю query
    lastResult = {
      total: records.total, //то, что пришло с сервера (получили через переменную)
      items: mapRecords(records.items),
    }; //последний результат тоже обновляем

    return lastResult; //вернули последний результат
  };

  return {
    getIndexes,
    getRecords,
  };
}
