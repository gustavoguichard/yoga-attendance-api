const assert = require('assert');
const app = require('../../src/app');

describe('\'classrooms\' service', () => {
  it('registered the service', () => {
    const service = app.service('classrooms');

    assert.ok(service, 'Registered the service');
  });
});
