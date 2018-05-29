const assert = require('assert')
const app = require('../../src/app')

const service = app.service('frequency')
describe('\'frequency\' service', () => {
  let frequency, classroom, practitioner

  it('registered the service', () => {

    assert.ok(service, 'Registered the service')
  })

  before(async () => {
    classroom = await app.service('classrooms').create({ title: 'Class', tuition: 0 })
    practitioner = await app.service('practitioners').create({ fullName: 'Test', accessCode: 'foo' })
    frequency = await service.create({ classId: classroom._id, practitionerId: practitioner._id })
  })

  describe('populate hooks', async () => {
    it('populates classrooms', async () => {
      const result = await service.get(frequency._id)
      const result2 = await service.get(frequency._id, { populateClassroom: true })
      const result3 = await service.find({ populateClassroom: true, query: { _id: frequency._id } })

      assert.ok(!result.classroom)
      assert.equal(result2.classroom.title, 'Class')
      assert.equal(result3.data[0].classroom.title, 'Class')
    })

    it('populates practitioners', async () => {
      const result = await service.get(frequency._id)
      const result2 = await service.get(frequency._id, { populatePractitioners: true })
      const result3 = await service.find({ populatePractitioners: true, query: { _id: frequency._id } })

      assert.ok(!result.practitioner)
      assert.equal(result2.practitioner.fullName, 'Test')
      assert.equal(result3.data[0].practitioner.fullName, 'Test')
    })
  })
})
