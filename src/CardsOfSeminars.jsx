import React, { useEffect, useState } from 'react';
import './CardsOfSeminars.css'; 
import { Card } from "@mui/material";

const SERVER_URL = 'http://localhost:3000/seminars';

async function getSeminars(query, endpoint = SERVER_URL) {
  try {
    query ? (query = `?${query}`) : (query = '');
    const response = await fetch(`${endpoint}${query}`);
    if (!response.ok) throw new Error(response.statusText);
    const json = await response.json();
    return json;
  } catch (err) {
    console.error(err.message || err);
    return [];
  }
}

function CardsOfSeminars() {
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSeminars();
      setSeminars(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      {Array(seminars.length).fill().map((_, i) =>
        <Card variant="outlined" className="card" name={seminars[i][0]}>
          <p className="card__title">{seminars[i].title}</p>
          <p className="card__description">{seminars[i].description}</p>
          <p className="card__time">{seminars[i].date} {seminars[i].time}</p>
        </Card>
      )}
    </div>
  )
}

export default CardsOfSeminars;