import React, { useState } from 'react';
import { Container, Grid, Typography, Button, TextField, Box, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import TaskForm from '../components/taskForm';
import { createTask, getTaskById, updateTask, deleteTask, uploadFile, getFilteredAndSortedTasks } from '../api/taskApi';

const statusOptions = ["ToDo", "In Progress", "Done"];

const TaskManager = () => {
  const [createTaskData, setCreateTaskData] = useState(null);
  const [updateTaskData, setUpdateTaskData] = useState(null);
  const [deleteTaskId, setDeleteTaskId] = useState('');
  const [getTaskId, setGetTaskId] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');
  const [taskDetails, setTaskDetails] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortAscending, setSortAscending] = useState(true);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const handleCreateTask = async (task) => {
    try {
      const newTask = await createTask(task);
      setResult(`Task created: ${JSON.stringify(newTask)}`);
      setCreateTaskData(null);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  const handleGetTask = async () => {
    try {
      const task = await getTaskById(getTaskId);
      setTaskDetails(task);
      setResult(`Task details: ${JSON.stringify(task)}`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  const handleUpdateTask = async (task) => {
    try {
      const updatedTask = await updateTask(getTaskId, task);
      setResult(`Task updated: ${JSON.stringify(updatedTask)}`);
      setUpdateTaskData(null);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask(deleteTaskId);
      setResult('Task deleted successfully');
      setDeleteTaskId('');
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  const handleFileUpload = async () => {
    if (file) {
      try {
        const response = await uploadFile(getTaskId, file);
        setResult(`File uploaded: ${JSON.stringify(response)}`);
      } catch (error) {
        setResult(`Error: ${error.message}`);
      }
    } else {
      setResult('No file selected');
    }
  };

  const handleFilterTasks = async () => {
    try {
      const tasks = await getFilteredAndSortedTasks(statusFilter, sortBy, sortAscending, onlyFavorites);
      setResult(`Filtered tasks: ${JSON.stringify(tasks)}`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  return (
    <Container>
      <Typography variant="h2" gutterBottom align="center">
        Task Manager
      </Typography>

      <Grid container spacing={3}>
        {/* Create Task Section */}
        <Grid item xs={12} md={6}>
          <Box padding={2} border={1} borderRadius={2}>
            <Typography variant="h5" gutterBottom>
              Create a Task
            </Typography>
            <TaskForm
              task={createTaskData}
              onSave={handleCreateTask}
            />
          </Box>
        </Grid>

        {/* Update Task Section */}
        <Grid item xs={12} md={6}>
          <Box padding={2} border={1} borderRadius={2}>
            <Typography variant="h5" gutterBottom>
              Update a Task
            </Typography>
            <TextField
              label="Task ID"
              fullWidth
              margin="normal"
              value={getTaskId}
              onChange={(e) => setGetTaskId(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleGetTask}>
              Get Task
            </Button>
            {taskDetails && (
              <TaskForm
                task={updateTaskData || taskDetails}
                onSave={handleUpdateTask}
              />
            )}
          </Box>
        </Grid>

        {/* Delete Task Section */}
        <Grid item xs={12} md={6}>
          <Box padding={2} border={1} borderRadius={2}>
            <Typography variant="h5" gutterBottom>
              Delete a Task
            </Typography>
            <TextField
              label="Task ID"
              fullWidth
              margin="normal"
              value={deleteTaskId}
              onChange={(e) => setDeleteTaskId(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleDeleteTask}>
              Delete Task
            </Button>
          </Box>
        </Grid>

        {/* File Upload Section */}
        <Grid item xs={12} md={6}>
          <Box padding={2} border={1} borderRadius={2}>
            <Typography variant="h5" gutterBottom>
              Upload File to Task
            </Typography>
            <TextField
              label="Task ID"
              fullWidth
              margin="normal"
              value={getTaskId}
              onChange={(e) => setGetTaskId(e.target.value)}
            />
            <Button variant="contained" color="primary" component="label">
              Choose File
              <input
                type="file"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Button>
            <Button variant="contained" color="primary" onClick={handleFileUpload}>
              Upload File
            </Button>
          </Box>
        </Grid>

        {/* Filter and Sort Tasks Section */}
        <Grid item xs={12}>
          <Box padding={2} border={1} borderRadius={2}>
            <Typography variant="h5" gutterBottom>
              Filter and Sort Tasks
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {statusOptions.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="deadline">Deadline</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Sort Order</InputLabel>
              <Select
                value={sortAscending ? 'Ascending' : 'Descending'}
                onChange={(e) => setSortAscending(e.target.value === 'Ascending')}
              >
                <MenuItem value="Ascending">Ascending</MenuItem>
                <MenuItem value="Descending">Descending</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={onlyFavorites}
                  onChange={(e) => setOnlyFavorites(e.target.checked)}
                />
              }
              label="Show Only Favorites"
            />
            <Button variant="contained" color="primary" onClick={handleFilterTasks}>
              Apply Filter
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Result Section */}
      <Box marginTop={2}>
        <Typography variant="h6" color={result.startsWith('Error') ? 'error' : 'success'}>
          {result}
        </Typography>
      </Box>
    </Container>
  );
};

export default TaskManager;
