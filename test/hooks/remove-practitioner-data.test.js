const toString = require('lodash/toString')
const assert = require('assert')
const app = require('../../src/app')
const fx = require('../fixtures')

let practitioner
let sibling
let classroom

describe('remove-user-data', async () => {
  beforeEach(async () => {
    await app.service('frequency').remove(null)
    await app.service('practitioners').remove(null)
    await app.service('classrooms').remove(null)
    await app.service('payments').remove(null)
    practitioner = await fx.practitioner()
    classroom = await fx.classroom({ teacher: practitioner._id })
    sibling = await fx.practitioner({
      fullName: 'Test Sibling',
      email: 'test@sibling.com',
      family: [practitioner._id],
    })
    await app
      .service('frequency')
      .create({ practitionerId: practitioner._id, classId: classroom._id })
    await app
      .service('frequency')
      .create({ practitionerId: sibling._id, classId: classroom._id })
  })

  it(`removes user from other's practitioner's family`, async () => {
    await app.service('practitioners').remove(practitioner._id)
    const result = await app.service('practitioners').find({
      query: { family: practitioner._id },
    })
    assert.ok(result.data.length === 0)
  })

  it('removes user frequency', async () => {
    await app.service('practitioners').remove(practitioner._id)
    const result = await app.service('frequency').find()
    assert.ok(result.data.length === 1)
  })

  it('removes user payments', async () => {
    await app.service('practitioners').remove(practitioner._id)
    const result = await app.service('payments').find()
    assert.ok(result.data.length === 1)
  })

  it('removes user as teacher from classrooms', async () => {
    await app.service('practitioners').remove(practitioner._id)
    const result = await app.service('classrooms').find()
    const filtered = result.data.filter(
      lesson => toString(lesson.teacher) === toString(practitioner._id),
    )
    assert.ok(result.data.length === 1)
    assert.ok(filtered.length === 0)
  })
})
