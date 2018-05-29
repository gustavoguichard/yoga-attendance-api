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

      assert.ok(!result.classroom)
      assert.equal(result2.classroom.title, 'Class')
    })
  })
})
