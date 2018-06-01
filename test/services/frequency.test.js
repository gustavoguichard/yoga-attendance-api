const assert = require('assert')
const moment = require('moment')
const { includes, isString } = require('lodash')
const app = require('../../src/app')
const fx = require('../fixtures')
const beforeAll = require('../beforeAll')

const service = app.service('frequency')
describe('\'frequency\' service', () => {
  let frequency, classroom, practitioner

  it('registered the service', () => {

    assert.ok(service, 'Registered the service')
  })

  beforeAll(async () => {
    await app.service('frequency').remove(null)
    await app.service('practitioners').remove(null)
    await app.service('classrooms').remove(null)
    classroom = await fx.classroom()
    practitioner = await fx.practitioner()
    frequency = await service.create({ classId: classroom._id, practitionerId: practitioner._id })
  })

  describe('populate hooks', async () => {
    it('populates classrooms', async () => {
      const result = await service.get(frequency._id)
      const result2 = await service.find({ query: { _id: frequency._id } })

      assert.equal(result.classroom.title, 'Sunday class')
      assert.equal(result2.data[0].classroom.title, 'Sunday class')
    })

    it('populates practitioners', async () => {
      const result = await service.get(frequency._id)
      const result2 = (await service.find({ query: { _id: frequency._id } })).data[0]
      assert.equal(result.practitioner.fullName, 'Test user')
      assert.ok(result2.practitioner)
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
})
