import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskManager from '../components/TaskManager';
import { createTask, getTaskById, updateTask, deleteTask, uploadFile, getFilteredAndSortedTasks } from '../api/taskApi';

// Mock API calls
jest.mock('../api/taskApi');

describe('TaskManager', () => {
  test('renders TaskManager component', () => {
    render(<TaskManager />);
    expect(screen.getByText(/Task Manager/i)).toBeInTheDocument();
  });

  test('creates a task and displays the result', async () => {
    createTask.mockResolvedValue({ id: 1, name: 'New Task' });
    render(<TaskManager />);
    
    fireEvent.change(screen.getByLabelText(/Task Name/i), { target: { value: 'New Task' } });
    fireEvent.click(screen.getByText(/Create Task/i));

    await waitFor(() => {
      expect(screen.getByText(/Task created: {"id":1,"name":"New Task"}/i)).toBeInTheDocument();
    });
  });

  test('fetches a task by ID and displays the result', async () => {
    getTaskById.mockResolvedValue({ id: 1, name: 'Fetched Task' });
    render(<TaskManager />);

    fireEvent.change(screen.getByLabelText(/Task ID/i), { target: { value: '1' } });
    fireEvent.click(screen.getByText(/Get Task/i));

    await waitFor(() => {
      expect(screen.getByText(/Task details: {"id":1,"name":"Fetched Task"}/i)).toBeInTheDocument();
    });
  });

  test('updates a task and displays the result', async () => {
    updateTask.mockResolvedValue({ id: 1, name: 'Updated Task' });
    render(<TaskManager />);
    
    fireEvent.change(screen.getByLabelText(/Task ID/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Task Name/i), { target: { value: 'Updated Task' } });
    fireEvent.click(screen.getByText(/Update Task/i));

    await waitFor(() => {
      expect(screen.getByText(/Task updated: {"id":1,"name":"Updated Task"}/i)).toBeInTheDocument();
    });
  });

  test('deletes a task and displays the result', async () => {
    deleteTask.mockResolvedValue({});
    render(<TaskManager />);

    fireEvent.change(screen.getByLabelText(/Task ID/i), { target: { value: '1' } });
    fireEvent.click(screen.getByText(/Delete Task/i));

    await waitFor(() => {
      expect(screen.getByText(/Task deleted successfully/i)).toBeInTheDocument();
    });
  });

  test('uploads a file and displays the result', async () => {
    uploadFile.mockResolvedValue({ fileName: 'testfile.jpg' });
    render(<TaskManager />);
    
    fireEvent.change(screen.getByLabelText(/Task ID/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Choose File/i), { target: { files: [new File(['dummy content'], 'testfile.jpg')] } });
    fireEvent.click(screen.getByText(/Upload File/i));

    await waitFor(() => {
      expect(screen.getByText(/File uploaded: {"fileName":"testfile.jpg"}/i)).toBeInTheDocument();
    });
  });

  test('filters and sorts tasks and displays the result', async () => {
    getFilteredAndSortedTasks.mockResolvedValue([{ id: 1, name: 'Filtered Task' }]);
    render(<TaskManager />);
    
    fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: 'ToDo' } });
    fireEvent.change(screen.getByLabelText(/Sort By/i), { target: { value: 'name' } });
    fireEvent.change(screen.getByLabelText(/Sort Order/i), { target: { value: 'Ascending' } });
    fireEvent.click(screen.getByLabelText(/Show Only Favorites/i));
    fireEvent.click(screen.getByText(/Apply Filter/i));

    await waitFor(() => {
      expect(screen.getByText(/Filtered tasks: \[{"id":1,"name":"Filtered Task"}\]/i)).toBeInTheDocument();
    });
  });
});
