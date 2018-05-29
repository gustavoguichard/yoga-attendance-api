const assert = require('assert')
const feathers = require('@feathersjs/feathers')
const service = require('feathers-memory')
const decoratePractitioner = require('../../src/hooks/decorate-practitioner')

describe(`'decorate-practitioner' hook`, () => {
  let app

  const data = {
    fullName: 'Test user',
    accessCode: '1010',
  }

  beforeEach(async () => {
    const options = { paginate: { default: 10, max: 25 } }
    app = feathers()

    app.use('/practitioners', service(options))
    app.service('practitioners').hooks({
      after: decoratePractitioner(),
    })
  })

  describe('adds a displayName to practitioners', async () => {

    it('uses nickName when it is available', async () => {
      await app.service('practitioners').create({
        ...data,
        nickName: 'Testy'
      })

      const practitioner = await app.service('practitioners').get(0)

      assert.equal(practitioner.displayName, 'Testy')
    })

    it('uses the fullName when there is no nickName', async () => {
      await app.service('practitioners').create(data)
      const practitioner = await app.service('practitioners').get(0)

      assert.equal(practitioner.displayName, 'Test user')
    })
  })
})
