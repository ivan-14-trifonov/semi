import React, { useEffect, useState } from 'react';
import './CardsOfSeminars.css'; 
import { Card } from "@mui/material";

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

  // Если данные ещё не загрузились
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Возвращаем карточки семинаров
  return (
    <div>
      {Array(seminars.length).fill().map((_, i) =>
        <Card variant="outlined" className="card" name={seminars[i][0]}>
          <img className="card__photo" src={seminars[i].photo} alt="Пример изображения" />
          <p className="card__title">{seminars[i].title}</p>
          <p className="card__description">{seminars[i].description}</p>
          <p className="card__time">{seminars[i].date} {seminars[i].time}</p>
        </Card>
      )}
    </div>
  )
}

export default CardsOfSeminars;