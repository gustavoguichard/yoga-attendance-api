const assert = require('assert');
const app = require('../../src/app');

describe('\'payment-description\' service', () => {
  it('registered the service', () => {
    const service = app.service('payment-description');

    assert.ok(service, 'Registered the service');
  });
});
