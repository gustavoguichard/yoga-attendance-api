const assert = require('assert')
const app = require('../../src/app')
const fx = require('../fixtures')
const beforeAll = require('../beforeAll')

const service = app.service('classrooms')
describe('\'classrooms\' service', async () => {
  it('registered the service', () => {
    assert.ok(service, 'Registered the service')
  })

  let practitioner, classroom

  beforeAll(async () => {
    await app.service('practitioners').remove(null)
    await service.remove(null)
    practitioner = await fx.practitioner()
    classroom = await fx.classroom({ teacher: practitioner._id })
  })

  it('populates the teacher field', async () => {
    const result = await service.get(classroom._id)
    assert.equal(result.teacherData.fullName, 'Test user')
  })

  it('synchronize tuition for regular classes', async () => {
    let another = await service.create({
      title: 'Another class',
      tuition: 50,
      regularClass: true
    })

    let result = await service.get(another._id)
    let result2 = await service.get(classroom._id)
    assert.equal(result.tuition, 50)
    assert.equal(result2.tuition, 100)

    await service.patch(classroom._id, { regularClass: true })
    result = await service.get(another._id)
    assert.equal(result.tuition, 100)
  })
})
