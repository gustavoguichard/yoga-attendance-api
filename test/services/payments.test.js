const assert = require('assert')
const app = require('../../src/app')

const service = app.service('payments')
describe('\'payments\' service', () => {
  it('registered the service', () => {
    assert.ok(service, 'Registered the service')
  })
})
