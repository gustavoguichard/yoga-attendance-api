const assert = require('assert')
const app = require('../../src/app')
const beforeAll = require('../beforeAll')
const fx = require('../fixtures')

const ERROR = 'You do not have the correct permissions.'

describe('permissions', async () => {
  let admin, teacher

  beforeAll(async () => {
    await app.service('users').remove(null)
    await app.service('classrooms').remove(null)
    await app.service('enrollment').remove(null)
    const adminUser = await app.service('users').create({
      email: 'foo@bar.com',
      password: '1234',
      permissions: ['admin'],
    })
    const teacherUser = await app.service('users').create({
      email: 'bar@foo.com',
      password: '4321',
      permissions: ['teacher'],
    })
    teacher = { user: teacherUser, provider: 'rest', authenticated: true }
    admin = { ...teacher, user: adminUser }
  })

  describe('enrollment', async () => {
    let classroom, result
    before(async () => {
      await app.service('classrooms').remove(null)
      classroom = await fx.classroom()
    })

    it('throws 403 when teacher is trying to create', async () => {
      try {
        await app.service('enrollment').create({ classId: classroom._id }, teacher)
      } catch(error) { result = error.message }
      assert.equal(result, ERROR)
    })

    it('throws 403 when teacher is trying to update', async () => {
      try {
        const temp = await app.service('enrollment').create({ classId: classroom._id })
        await app.service('enrollment').update(temp._id, {}, teacher)
      } catch(error) { result = error.message }
      assert.equal(result, ERROR)
    })

    it('throws 403 when teacher is trying to remove', async () => {
      try {
        await app.service('enrollment').remove(null, teacher)
      } catch(error) { result = error.message }
      assert.equal(result, ERROR)
    })

    it('lets admin pass', async () => {
      result = (await app.service('enrollment').remove(null, admin))[0]
      assert.ok(result._id)
    })
  })

  describe('classrooms', async () => {
    before(async () => {
      await app.service('classrooms').remove(null)
    })

    it('throws 403 when teacher is trying to create', async () => {
      try {
        await app.service('classrooms').create({ title: 'Foo', tuition: 0 }, teacher)
      } catch(error) { result = error.message }
      assert.equal(result, ERROR)
    })

    it('throws 403 when teacher is trying to update', async () => {
      try {
        const temp = await app.service('classrooms').create({ title: 'Foo', tuition: 0 })
        await app.service('classrooms').update(temp._id, {}, teacher)
      } catch(error) { result = error.message }
      assert.equal(result, ERROR)
    })

    it('throws 403 when teacher is trying to remove', async () => {
      try {
        await app.service('classrooms').remove(null, teacher)
      } catch(error) { result = error.message }
      assert.equal(result, ERROR)
    })

    it('lets admin pass', async () => {
      result = (await app.service('classrooms').remove(null, admin))[0]
      assert.ok(result._id)
    })
  })

  describe('frequency', async () => {
    let practitioner, teacherPract, classroom

    before(async () => {
      await app.service('practitioners').remove(null)
      await app.service('classrooms').remove(null)
      classroom = await fx.classroom()
      practitioner = await fx.practitioner()
      teacherPract = await fx.practitioner({ email: 'bar@foo.com' })
      const user = await app.service('users').get(teacher.user._id)
      teacher = { provider: 'rest', authenticated: true, user }
    })

    it('throws 403 when teacher is trying to create a frequency of different teacher', async () => {
      try {
        await app.service('frequency').create({ classId: classroom._id, practitionerId: practitioner._id, teacher: true }, teacher)
      } catch(error) { result = error.message }
      assert.equal(result, ERROR)
    })

    it('throws 403 when teacher is trying to remove a frequency of different teacher', async () => {
      try {
        const temp = await app.service('frequency').create({ classId: classroom._id, practitionerId: practitioner._id, teacher: true })
        await app.service('classrooms').remove(temp._id, {}, teacher)
      } catch(error) { result = error.message }
      assert.equal(result, ERROR)
    })

    // it('let teacher remove from not teacher and himself', async () => {
    //   await app.service('frequency').create({ classId: classroom._id, practitionerId: practitioner._id, teacher: true })
    //   await app.service('classrooms').remove(temp._id, {}, teacher)
    //   assert.equal(result, ERROR)
    // })

    it('lets admin pass', async () => {
      await app.service('frequency').remove(null, admin)
      await app.service('practitioners').remove(null, admin)
      result = (await app.service('classrooms').remove(null, admin))[0]
      assert.ok(result._id)
    })
  })
})
