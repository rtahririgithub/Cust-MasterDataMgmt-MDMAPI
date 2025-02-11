var expect = require('expect');
var greeter = require('../greeter');

describe('Test for greeter', function() {
  test('Greet with a name', () => {
    var name = "Jest Test";
    var greetingResponse = greeter(name);
    expect(greetingResponse.content).toBe("Hello, Jest Test!");
  });

  test('Greet with no name provided', () => {
    var name;
    var greetingResponse = greeter(name);
    expect(greetingResponse.content).toBe("Hello, World!");
  });

  test('Greet with a mocked implementation', () => {
    const greeter = jest.fn().mockImplementationOnce(() => "Hi, there");
    expect(greeter("test")).toBe("Hi, there");
    expect(greeter).toHaveBeenCalledWith("test");

    //prove implementation was mocked only once
    expect(greeter("now")).toBe(undefined);
    expect(greeter).toHaveBeenCalledWith("now");
  });
});

describe('Test add operation', function() {
  test('Add two values correctly', () => {

  });
})
