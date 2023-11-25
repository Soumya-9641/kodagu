const request = require('supertest');
const express = require('express');
const isUser = require('./middlewares/userAuthentication');
const Task = require('./models/Task'); // Adjust the path based on your actual structure
const getOneTaskRoute = require('./router/task'); // Adjust the path based on your actual structure

const app = express();
app.use('/tasks', isUser, getOneTaskRoute);

jest.mock('./models/Task');
jest.mock('./middlewares/userAuthentication');

describe('GET /tasks/getOneTask/:id', () => {
  it('should get a single task for an authenticated user', async () => {
    // Mock the isUser middleware to simulate authentication
    isUser.mockImplementation((req, res, next) => {
      req.userId = 'mockUserId'; // Set a mock user ID for testing
      next();
    });

    // Mock Task.findById to return a sample task
    const sampleTask = {
      _id: 'mockTaskId',
      title: 'Task 1',
      description: 'Description 1',
      assignedUser: 'mockUserId',
      dueDate: "2023-11-25T08:47:18.639Z",
      completionStatus: false,
    };
    Task.findById.mockResolvedValue(sampleTask);

    // Perform the request
    const response = await request(app)
      .get('/tasks/getOneTask/mockTaskId'); // Replace 'mockTaskId' with the actual task ID

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.task).toEqual(sampleTask);
    expect(response.body.message).toBe('This is the required task');
  });

  it('should return an error for an unauthenticated user', async () => {
    // Mock the isUser middleware to simulate unauthenticated user
    isUser.mockImplementation((req, res, next) => {
      res.status(401).json({ message: 'Authentication required' });
    });

    // Perform the request
    const response = await request(app)
      .get('/tasks/getOneTask/mockTaskId'); // Replace 'mockTaskId' with the actual task ID

    // Assertions
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authentication required');
  });

  it('should return an error if the task is not found', async () => {
    // Mock the isUser middleware to simulate authentication
    isUser.mockImplementation((req, res, next) => {
      req.userId = 'mockUserId'; // Set a mock user ID for testing
      next();
    });

    // Mock Task.findById to simulate a not found scenario
    Task.findById.mockResolvedValue(null);

    // Perform the request
    const response = await request(app)
      .get('/tasks/getOneTask/mockTaskId'); // Replace 'mockTaskId' with the actual task ID

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Task not found');
  });

  it('should return an error if there is an issue with retrieving the task', async () => {
    // Mock the isUser middleware to simulate authentication
    isUser.mockImplementation((req, res, next) => {
      req.userId = 'mockUserId'; // Set a mock user ID for testing
      next();
    });

    // Mock Task.findById to simulate an error
    Task.findById.mockRejectedValue(new Error('Database error'));

    // Perform the request
    const response = await request(app)
      .get('/tasks/getOneTask/mockTaskId'); // Replace 'mockTaskId' with the actual task ID

    // Assertions
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Something went wrong');
  });
});