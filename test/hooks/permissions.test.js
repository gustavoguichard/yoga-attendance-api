const assert = require('assert')
const app = require('../../src/app')
const beforeAll = require('../beforeAll')
const fx = require('../fixtures')

const ERROR = 'You do not have the correct permissions.'

describe('permissions', async () => {
  let admin, teacher, result

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
})
