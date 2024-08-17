import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Container } from '@mui/material';

const Home = () => (
  <Container>
    <Typography variant="h2" gutterBottom align="center">
      Welcome to Task Manager
    </Typography>
    <Button variant="contained" color="primary" component={Link} to="/tasks">
      Go to Task Manager
    </Button>
  </Container>
);

export default Home;
