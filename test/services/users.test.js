const assert = require('assert')
const app = require('../../src/app')
const fx = require('../fixtures')

const service = app.service('users')
describe('\'users\' service', () => {
  it('registered the service', () => {
    assert.ok(service, 'Registered the service')
  })

  it('creates a user, encrypts password and adds gravatar', async () => {
    const user = await fx.user()
    assert.ok(user.password !== 'secret')
  })

  it('removes password for external requests', async () => {
    // Setting `provider` indicates an external request
    const params = { provider: 'rest' }

    const user = await service.create({
      email: 'test2@example.com',
      password: 'secret'
    }, params)
    assert.ok(!user.password)
  })
})
