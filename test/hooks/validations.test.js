const assert = require('assert')
const app = require('../../src/app')
const validations = require('../../src/hooks/validations')
const fx = require('../fixtures')

describe('validations', async () => {
  describe('practitioners', async () => {
    const validate = validations('practitioners')
    it('throws 400 if fullName is defined as empty', async () => {
      let result
      let result2
      try {
        await validate({ data: { fullName: null } })
      } catch (error) {
        result = error.code
      }
      try {
        await validate({ data: { fullName: '' } })
      } catch (error) {
        result2 = error.code
      }
      assert.equal(result, 400)
      assert.equal(result2, 400)
    })

    it('throws 400 if fullName does not have 2 words', async () => {
      let result
      try {
        await validate({ data: { fullName: 'One' } })
      } catch (error) {
        result = error.code
      }
      assert.equal(result, 400)
    })

    it('passes with a name with at least 2 words', async () => {
      const result = await validate({ data: { fullName: 'One Two' } })
      const result2 = await validate({ data: { fullName: 'One Two Three' } })
      assert.ok(!result)
      assert.ok(!result2)
    })

    it('throws 409 if email is already taken', async () => {
      let result
      await app.service('practitioners').remove(null)
      await fx.practitioner({ email: 'foo@bar.com' })
      try {
        await validate({ data: { email: 'foo@bar.com' }, app })
      } catch (error) {
        result = error.code
      }
      assert.equal(result, 409)
    })

    it('throws 400 if email is invalid', async () => {
      let result
      try {
        await validate({ data: { email: 'foo@bar.c' }, app })
      } catch (error) {
        result = error.code
      }
      assert.equal(result, 400)
    })

    it('throws 400 if birthdate is of invalid format', async () => {
      let result
      try {
        await validate({ data: { birthdate: '121284' } })
      } catch (error) {
        result = error.code
      }
      assert.equal(result, 400)
    })

    it('throws 400 if phone is not a number', async () => {
      let result
      try {
        await validate({ data: { phone: 'f0198' } })
      } catch (error) {
        result = error.code
      }
      assert.equal(result, 400)
    })

    it('passes with a phone number', async () => {
      const result = await validate({ data: { phone: '123456' } })
      const result2 = await validate({ data: { phone: 123456 } })
      assert.ok(!result)
      assert.ok(!result2)
    })
  })

  describe('classrooms', async () => {
    const validate = validations('classrooms')
    it('throws 400 if no title is provided when creating or updating', async () => {
      let result
      let result2
      let result3
      try {
        await validate({ data: {}, method: 'create' })
      } catch (error) {
        result = error.code
      }
      try {
        await validate({ data: {}, method: 'update' })
      } catch (error) {
        result2 = error.code
      }
      result3 = await validate({ data: {}, method: 'patch' })
      assert.equal(result, 400)
      assert.equal(result2, 400)
      assert.ok(!result3)
    })

    it('throws 400 if no tuition is provided when creating or updating', async () => {
      let result
      let result2
      let result3
      try {
        await validate({ data: { title: 'Some class' }, method: 'create' })
      } catch (error) {
        result = error.code
      }
      try {
        await validate({ data: { title: 'Some class' }, method: 'update' })
      } catch (error) {
        result2 = error.code
      }
      result3 = await validate({
        data: { title: 'Some class' },
        method: 'patch',
      })
      assert.equal(result, 400)
      assert.equal(result2, 400)
      assert.ok(!result3)
    })
  })

  describe('with non existent servide', () => {
    it('returs hook if not used properly', () => {
      const result = validations('foo')('bar')
      assert.equal(result, 'bar')
    })
  })
})
