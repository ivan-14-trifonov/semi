import React, { useEffect, useState } from 'react';
import './CardsOfSeminars.css'; 
import { Card, TextField, Button, Modal, Box } from '@mui/material';
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
    const response = await fetch(`${point}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

// Изменение данных о семинаре
async function updateSeminar(id, updatedData, point = SERVER_URL) {
  try {
    const response = await fetch(`${point}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

// Модальное окно редактирования семинара
const EditSeminarModal = ({ seminar, isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState(seminar.title);
  const [description, setDescription] = useState(seminar.description);
  const [date, setDate] = useState(seminar.date);
  const [time, setTime] = useState(seminar.time);
  const [photo, setPhoto] = useState(seminar.photo);

  const handleSave = () => {
    const updatedSeminar = {
      ...seminar,
      title,
      description,
      date,
      time,
      photo,
    };
    onSave(updatedSeminar);
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <h2>Редактирование семинара</h2>
        <TextField
          label="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <TextField
          label="Дата"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Время"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Ссылка на фото"
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={onClose} sx={{ mr: 2 }}>
            Отменить
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Сохранить
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

// Отображение карточек семинаров
function CardsOfSeminars() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [indexSeminarEdit, setIndexSeminarEdit] = useState(false);

  const openModal = (event) => {
    setIndexSeminarEdit(event.currentTarget.getAttribute("index"));
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setIndexSeminarEdit(false);
  };

  // Изменение семинара
  const handleSave = (updatedSeminar) => {
    const res = updateSeminar(updatedSeminar.id, updatedSeminar);
    if (res) {
      alert('Запись успешно обновлена');
      setFlag(!flag);
    }
    else {
      alert('Ошибка при обновлении записи');
    };
  };

  // Данные о семинарах
  const [seminars, setSeminars] = useState([]);

  // Состояние загрузки
  const [loading, setLoading] = useState(true);

  // Флаг изменения данных
  const [flag, setFlag] = useState(true);

  // Асинхронно получаем данные
  useEffect(() => {
    const fetchData = async () => {
      const data = await getSeminars();
      setSeminars(data);
      setLoading(false);
    };

    fetchData();
  }, [flag]);

  // Удаление
  const onDelete = event => {
    const seminarName = event.currentTarget.getAttribute("value");
    const seminarId = event.currentTarget.getAttribute("id");
    const res = window.confirm(`Вы действительно хотите удалить запись о семинаре "${seminarName}"?`);
    if (res) {
      if (deleteSeminar(seminarId)) {
        alert("Запись успешно удалена.");
        setFlag(!flag);
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
                index={i}
                onClick={openModal}
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
      {indexSeminarEdit && <EditSeminarModal
        seminar={seminars[indexSeminarEdit]}
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
      />}
    </div>
  )
}

export default CardsOfSeminars;