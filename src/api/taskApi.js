import axios from 'axios';

const API_URL = 'https://localhost:44375/api/Task'; 

export const createTask = async (task) => {
  try {
    const response = await axios.post(API_URL, {
      name: task.name || '',
      description: task.description || '',
      deadline: task.deadline || '',
      status: task.status || 'ToDo',
      isFavorite: task.isFavorite || false,
      imageUrl: task.imageUrl || ''
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateTask = async (id, task) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, {
      id: id, // Add the id field to the request payload
      name: task.name || '',
      description: task.description || '',
      deadline: task.deadline || '',
      status: task.status || 'ToDo', 
      isFavorited: task.isFavorite || false, 
      imageUrl: task.imageUrl || ''
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getTaskById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteTask = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    handleError(error);
  }
};

export const uploadFile = async (taskId, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/${taskId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getFilteredAndSortedTasks = async (status, sortBy, sortAscending, onlyFavorites) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        status,
        sortBy,
        sortAscending,
        onlyFavorites
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const handleError = (error) => {
  if (error.response) {
    console.error('Response error:', error.response.data);
    console.error('Response status:', error.response.status);
    console.error('Response headers:', error.response.headers);
  } else if (error.request) {
    console.error('Request error:', error.request);
  } else {
    console.error('Error:', error.message);
  }
  throw error;
};
