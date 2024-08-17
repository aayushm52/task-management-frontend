import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Snackbar, Alert } from '@mui/material';
import { createTask, updateTask } from '../api/taskApi';

const statusOptions = ["ToDo", "In Progress", "Done"];
const favoriteOptions = ["Yes", "No"]; 

const TaskForm = ({ task, onSave }) => {
  const [name, setName] = useState(task?.name || '');
  const [description, setDescription] = useState(task?.description || '');
  const [deadline, setDeadline] = useState(task?.deadline || '');
  const [status, setStatus] = useState(task?.status || 'ToDo');
  const [isFavorite, setIsFavorite] = useState(task?.isFavorite || false);
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (task) {
      setName(task.name || '');
      setDescription(task.description || '');
      setDeadline(task.deadline || '');
      setStatus(task.status || 'ToDo');
      setIsFavorite(task.isFavorite || false);
    } else {
      // Reset fields for a new task
      setName('');
      setDescription('');
      setDeadline('');
      setStatus('ToDo');
      setIsFavorite(false);
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      name: name || '',
      description: description || '',
      deadline: deadline || '',
      status: status || 'ToDo',
      isFavorite: isFavorite === 'Yes'
    };

    try {
      if (task && task.id) {
        await updateTask(task.id, newTask);
        setSuccessMessage('Task is updated');
      } else {
        await createTask(newTask);
        setSuccessMessage('Task is created');
      }
      setOpenSnackbar(true);
      onSave(newTask);
    } catch (error) {
      console.error('Failed to save task:', error);
      setSuccessMessage('Failed to save task');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            {statusOptions.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Favorite</InputLabel>
          <Select
            value={isFavorite ? 'Yes' : 'No'}
            onChange={(e) => setIsFavorite(e.target.value)}
          >
            {favoriteOptions.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary">
          {task && task.id ? 'Update' : 'Create Task'}
        </Button>
      </form>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={successMessage.includes('Failed') ? 'error' : 'success'}>
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TaskForm;
