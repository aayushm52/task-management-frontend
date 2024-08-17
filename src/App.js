import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TaskManager from './pages/TaskManager';
import Home from './pages/Home';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tasks" element={<TaskManager />} />
    </Routes>
  </Router>
);

export default App;
