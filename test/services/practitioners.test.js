const assert = require('assert')
const moment = require('moment')
const md5 = require('md5')
const { includes, isString, isNaN } = require('lodash')
const fx = require('../fixtures')
const beforeAll = require('../beforeAll')
const app = require('../../src/app')
const removeMutualFamily = require('../../src/hooks/remove-mutual-family')

const service = app.service('practitioners')
describe('\'practitioners\' service', async () => {
  it('registered the service', () => {

    assert.ok(service, 'Registered the service')
  })

  let practitioner, relative

  beforeAll(async () => {
    await service.remove(null)
    relative = await fx.practitioner({
      fullName: 'Relative Practitioner',
      email: 'foo@bar.com',
    }, ['picture', 'accessCode'])

    practitioner = await fx.practitioner({
      birthdate: moment('1986-07-13')._d,
      family: [relative._id],
    })
  })

  describe('decoratePractitioner', async () => {

    it('uses the first word of fullName when there is no nickName', async () => {
      assert.equal(practitioner.displayName, 'Test')
    })

    it('uses fullName as surname when nickName is set', async () => {
      const result = await service.patch(practitioner._id, { nickName: 'Testy' })
      assert.equal(result.surname, 'Test User')
    })

    it('uses tail of fullName as surname when no nickName is provided', async () => {
      const result = await service.patch(practitioner._id, { nickName: null })
      assert.equal(result.surname, 'User')
    })

    it('uses nickName when it is available', async () => {
      const result = await service.patch(practitioner._id, { nickName: 'Testy' })
      assert.equal(result.displayName, 'Testy')
    })

    it('sets the avatar from the picture', async () => {
      assert.equal(relative.avatar, 'foo')
    })

    it('defaults the avatar with a gravatar hash', async () => {
      const hash = md5(practitioner.email)
      assert.ok(includes(practitioner.avatar, '//gravatar.com/avatar/'))
      assert.ok(includes(practitioner.avatar, hash))
    })
  })

  describe('populate hooks', async () => {
    it('populates family', async () => {
      const populated = await service.get(practitioner._id, { populateFamily: true })
      const result = populated.familyData[0]
      assert.equal(result.fullName, relative.fullName)
    })
  })

  describe('generateToken hook', async () => {
    it('generates a 4 digit code from birthdate if there is no equal code', async () => {
      assert.equal(practitioner.accessCode, '1307')
    })

    it('generates a random 4 digit code if birthdate is already set', async () => {
      const result = await service.create({
        fullName: 'Not Relative',
        birthdate: moment('1994-07-13')._d,
      })
      assert.ok(result.accessCode !== '1307')
      assert.ok(result.accessCode.length === 4)
      assert.ok(isString(result.accessCode))
      assert.ok(!isNaN(+result.accessCode))
    })

    it('never generates a random number that is possibly a DD/MM code', async () => {
      const result = await service.create({
        fullName: 'Yet Anoter Not Relative',
        birthdate: moment('1994-07-13')._d,
      })
      assert.ok(+result.accessCode < 101 || +result.accessCode > 3112)
    })
  })

  describe(`'mutual family' hook on remove`, async () => {
    before(async () => {
      await service.patch(practitioner._id, { family: [] })
    })

    it('removes the corresponding relative', async () => {
      const result = await service.get(relative._id)
      assert.deepEqual(result.family, [])
    })
  })

  describe(`'mutual family' hook`, async () => {
    before(async () => {
      await service.patch(practitioner._id, { family: [relative._id] })
    })

    it('adds the relative to the corresponding one', async () => {
      const result = await service.get(relative._id)
      assert.deepEqual(result.family, [practitioner._id])
    })
  })

  describe(`'remove mutual family' hook`, async () => {
    before(async () => {
      await service.remove(relative._id)
    })

    it('removes the _id from relatives families', async () => {
      const result = await service.get(practitioner._id)
      assert.deepEqual(result.family, [])
    })

    it('does not remove when method is not remove', async () => {
      const hook = { method: 'foo', foo: 'bar' }
      const result = await removeMutualFamily()(hook)
      assert.deepEqual(result, hook)
    })
  })
})
