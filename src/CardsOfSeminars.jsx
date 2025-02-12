import React, { useEffect, useState } from 'react';
import './CardsOfSeminars.css'; 
import { Card } from "@mui/material";
import edit from './images/edit.png';
import del from './images/delete.png';

const SERVER_URL = 'http://localhost:3000/seminars';

// Получение данных о семинарах
async function getSeminars(query, endpoint = SERVER_URL) {
  try {
    // проверяем, есть ли параметры
    query ? (query = `?${query}`) : (query = '');

    // асинхронно получаем данные
    const response = await fetch(`${endpoint}${query}`);

    // генерация ошибки
    if (!response.ok) throw new Error(response.statusText);

    // ответ
    const json = await response.json();
    return json;
  } catch (err) {
    console.error(err.message || err);
    return [];
  }
}

// Удаление семинара
async function deleteSeminar(id, point = SERVER_URL) {
  try {
    // Выполняем удаление
    const response = fetch(`${point}/${id}`, {
      method: 'DELETE',
    });

    alert(JSON.stringify(response));

    // генерация ошибки
    if (!response.ok) throw new Error(response.statusText);

    return true;
  } catch (err) {
    return false;
  }
}

// Отображение карточек семинаров
function CardsOfSeminars() {
  // Данные о семинарах
  const [seminars, setSeminars] = useState([]);

  // Состояние загрузки
  const [loading, setLoading] = useState(true);

  // Асинхронно получаем данные
  useEffect(() => {
    const fetchData = async () => {
      const data = await getSeminars();
      setSeminars(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const onDelete = event => {
    const seminarName = event.currentTarget.getAttribute("value");
    const seminarId = event.currentTarget.getAttribute("id");
    const res = window.confirm(`Вы действительно хотите удалить запись о семинаре "${seminarName}"?`);
    if (res) {
      if (deleteSeminar(seminarId)) {
        alert("Запись успешно удалена.");
      } else {
        alert("Возникла ошибка удаления.");
      }

    }
  }

  // Если данные ещё не загрузились
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Возвращаем карточки семинаров
  return (
    <div>
      {Array(seminars.length).fill().map((_, i) =>
        <Card variant="outlined" className="card">
          <img className="card__photo" src={seminars[i].photo} alt="Картинка семинара" />
          <p className="card__title">{seminars[i].title}</p>
          <p className="card__description">{seminars[i].description}</p>
          <div className="card__panel">
            <p className="card__time">{seminars[i].date} {seminars[i].time}</p>
            <p className="card__edit">
              <img
                value={seminars[i].title}
                id={seminars[i].id}
                className="card__button"
                src={edit}
                alt="Изменить"
              />
              <img
                value={seminars[i].title}
                id={seminars[i].id}
                onClick={onDelete}
                className="card__button"
                src={del}
                alt="Удалить"
              />
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

export default CardsOfSeminars;