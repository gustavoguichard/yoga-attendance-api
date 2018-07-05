const assert = require('assert')
const moment = require('moment')
const { includes } = require('lodash')
const app = require('../../src/app')
const fx = require('../fixtures')
const beforeAll = require('../beforeAll')

const service = app.service('frequency')
describe('\'frequency\' service', () => {
  let classroom, practitioner

  it('registered the service', () => {

    assert.ok(service, 'Registered the service')
  })

  beforeAll(async () => {
    await app.service('frequency').remove(null)
    await app.service('practitioners').remove(null)
    await app.service('classrooms').remove(null)
    classroom = await fx.classroom()
    practitioner = await fx.practitioner()
    await service.create({ classId: classroom._id, practitionerId: practitioner._id })
  })

  describe('set practitioner by email', async () => {
    it('succeeds in case the practitioner exists', async () => {
      const email = 'offline@dude.com'
      await fx.practitioner({ email })
      const result = await service.create({ classId: classroom._id, email })
      assert.ok(result.practitionerId)
      assert.ok(!result.email)
    })

    it('fails otherwise', async () => {
      let result
      const email = 'nonexistent@email.com'
      try {
        await service.create({ classId: classroom._id, email })
      } catch(error) {
        result = error.message
      }
      assert.ok(includes(result, email))
    })
  })

  describe('avoid duplicate frequency', async () => {
    it('does not allow 2 frequencies of same practitioner, class and day', async () => {
      let result
      try {
        await service.create({
          classId: classroom._id,
          practitionerId: practitioner._id,
        })
      } catch(error) {
        result = error.message
      }
      assert.ok(includes(result, 'Praticante já está inscrito'))
    })

    it('allows 2 frequencies of different practitioner, class on same day', async () => {
      const class2 = await app.service('classrooms').create({ title: 'Temp class', tuition: 0 })
      const freq = await service.create({
        classId: class2._id,
        practitionerId: practitioner._id,
      })
      assert.ok(freq._id)
    })

    it('allows 2 frequencies of same practitioner, class on different days', async () => {
      const freq = await service.create({
        classId: classroom._id,
        practitionerId: practitioner._id,
        createdAt: moment().subtract(2, 'days')._d,
      })

      assert.ok(freq._id)
    })
  })
})
