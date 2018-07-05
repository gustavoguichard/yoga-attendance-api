const assert = require('assert')
const app = require('../../src/app')

describe('\'enrollment\' service', async () => {
  it('registered the service', () => {
    const service = app.service('enrollment')

    assert.ok(service, 'Registered the service')
  })
})
