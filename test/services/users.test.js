const assert = require('assert')
const { toString } = require('lodash')
const app = require('../../src/app')
const fx = require('../fixtures')

const service = app.service('users')
describe('\'users\' service', () => {
  beforeEach(async () => {
    await service.remove(null)
    await app.service('practitioners').remove(null)
  })

  it('registered the service', () => {
    assert.ok(service, 'Registered the service')
  })

  it('encrypts password', async () => {
    const user = await fx.user()
    assert.ok(user.password !== 'secret')
  })

  it('removes password for external requests', async () => {
    const params = { provider: 'rest' }

    const user = await service.create({
      email: 'test@example.com',
      password: 'secret'
    }, params)
    assert.ok(!user.password)
  })

  it('retrieves the practitioner along with the user', async () => {
    const practitioner = await fx.practitioner({ email: 'foo@bar.com' })
    const result = await fx.user({ email: 'foo@bar.com' })
    const result2 = (await service.find()).data[0]
    assert.equal(result.practitioner.fullName, practitioner.fullName)
    assert.ok(result2.practitioner._id)
  })
})
