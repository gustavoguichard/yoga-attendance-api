const assert = require('assert');
const app = require('../../src/app');

describe('\'practitioners\' service', () => {
  it('registered the service', () => {
    const service = app.service('practitioners');

    assert.ok(service, 'Registered the service');
  });
});
