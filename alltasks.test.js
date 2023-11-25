const request = require('supertest');
const express = require('express');
const isUser = require('./middlewares/userAuthentication');
const Task = require('./models/Task'); // Adjust the path based on your actual structure
const getAllTaskRoute = require('./router/task'); // Adjust the path based on your actual structure

const app = express();
app.use('/tasks', isUser, getAllTaskRoute);

jest.mock('./models/Task');
jest.mock('./middlewares/userAuthentication');

describe('GET /tasks/getallTask', () => {
  it('should get a list of all tasks for an authenticated user', async () => {
    // Mock the isUser middleware to simulate authentication
    isUser.mockImplementation((req, res, next) => {
      req.userId = 'mockUserId'; // Set a mock user ID for testing
      next();
    });

    // Mock Task.find to return a sample list of tasks
    const sampleTasks = [
      { title: 'Task 1', description: 'Description 1', assignedUser: 'mockUserId', dueDate: "2023-11-24T19:44:21.000Z", completionStatus: false },
      { title: 'Task 2', description: 'Description 2', assignedUser: 'mockUserId', dueDate: "2023-11-24T19:44:21.000Z", completionStatus: true },
    ];
    Task.find.mockResolvedValue(sampleTasks);

    // Perform the request
    const response = await request(app)
      .get('/tasks/getallTask');

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.task).toEqual(sampleTasks);
    expect(response.body.message).toBe('list of all task');
  });

  it('should return an error for an unauthenticated user', async () => {
    // Mock the isUser middleware to simulate unauthenticated user
    isUser.mockImplementation((req, res, next) => {
      res.status(401).json({ message: 'Authentication required' });
    });

    // Perform the request
    const response = await request(app)
      .get('/tasks/getallTask');

    // Assertions
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authentication required');
  });

  it('should return an error if there is an issue with retrieving tasks', async () => {
    // Mock the isUser middleware to simulate authentication
    isUser.mockImplementation((req, res, next) => {
      req.userId = 'mockUserId'; // Set a mock user ID for testing
      next();
    });

    // Mock Task.find to simulate an error
    Task.find.mockRejectedValue(new Error('Database error'));

    // Perform the request
    const response = await request(app)
      .get('/tasks/getallTask');

    // Assertions
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Something went wrong');
  });
});