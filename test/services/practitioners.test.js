const assert = require('assert')
const moment = require('moment')
const { isString, isNaN } = require('lodash')
const app = require('../../src/app')
const removeMutualFamily = require('../../src/hooks/remove-mutual-family')

const service = app.service('practitioners')
describe('\'practitioners\' service', async () => {
  it('registered the service', () => {

    assert.ok(service, 'Registered the service')
  })

  let practitioner, relative

  before(async () => {
    await service.remove(null)
    relative = await service.create({
      fullName: 'Relative',
    })

    practitioner = await service.create({
      fullName: 'Test user',
      birthdate: moment('1986-07-13')._d,
      family: [relative._id],
    })
  })

  describe('adds a displayName to practitioners', async () => {

    it('uses nickName when it is available', async () => {
      const result = await service.get(practitioner._id)

      assert.equal(result.displayName, 'Test user')
    })

    it('uses the fullName when there is no nickName', async () => {
      await service.patch(practitioner._id, { nickName: 'Testy' })
      const result = await service.get(practitioner._id)

      assert.equal(result.displayName, 'Testy')
    })
  })

  describe('populate hooks', async () => {
    it('populates family', async () => {
      const populated = await service.get(practitioner._id, { populateFamily: true })
      const result = populated.family[0]
      assert.equal(result.fullName, relative.fullName)
    })
  })

  describe('generateToken hook', async () => {
    it('generates a 4 digit code from birthdate if there is no equal code', async () => {
      const result = await service.get(practitioner._id)
      assert.equal(result.accessCode, '1307')
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
