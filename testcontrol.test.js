const taskController = require('./taskcontrol');

describe('Task Controller', () => {
  it('should add two numbers correctly', () => {
    // Arrange
    const result = taskController.addNumbers(2, 3);

    // Assert
    expect(result).toBe(5);
  });
});