import React from 'react';
import CardsOfSeminars from './CardsOfSeminars';
import { Container, Card } from "@mui/material";

const App = () => {
  return (
    <Container maxWidth="xs" sx={{mt: 2}}>
      <h1>Семинары</h1>
      <CardsOfSeminars/>
    </Container>
  );
};

export default App;