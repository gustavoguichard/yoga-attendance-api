const assert = require('assert');
const generateToken = require('../../src/hooks/generate-token');

describe('\'generate-token\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {
      data: {
        fullName: 'John Doe',
        birthdate: 'Sun Jul 13 1986 10:00:00 GMT-0300 (-03)',
      },
      service: undefined,
    };
    // Initialize our hook with no options
    const hook = generateToken();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });
});
