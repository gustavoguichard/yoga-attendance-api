const assert = require('assert')
const { includes, toString } = require('lodash')
const fx = require('../fixtures')
const app = require('../../src/app')
const normalizeData = require('../../src/hooks/normalize-data')

describe('normalizeData', async () => {
  describe('practitioners', async () => {
    let service
    before(async () => {
      service = app.service('practitioners')
      await service.remove(null)
    })

    describe('birthdate field', async () => {
      let result

      before(async () => {
        result = await fx.practitioner({ fullName: 'Birthday Bro', birthdate: '06/05/1992', email: 'test3@test.com' })
      })

      it('normalizes brazilian DD/MM/YYYY', async () => {
        assert.ok(includes(toString(result.birthdate), 'May 06 1992'))
      })

      it('accepts normal date', async () => {
        result = await service.patch(result._id, { birthdate: new Date('1992-05-06T03:00:00.000Z') })
        assert.ok(includes(toString(result.birthdate), 'May 06 1992'))
      })

      it('skips blank date', async () => {
        result = await service.patch(result._id, { birthdate: null })
        assert.ok(!result.birthdate)
      })
    })

    describe('email field', async () => {
      let result

      before(async () => {
        result = await fx.practitioner({ fullName: 'Email Bro', birthdate: '01/05/1992', email: 'Test4@test.com' })
      })

      it('lowercases the email', async () => {
        assert.equal(result.email, 'test4@test.com')
      })
    })

  })

  describe('classrooms', async () => {
    let service
    before(async () => {
      service = app.service('classrooms')
      await service.remove(null)
    })

    it('takes tuition from other regularClass if it was not provided', async () => {
      await fx.classroom({}, ['title', 'tuition', 'regularClass'])
      const result = await fx.classroom({ title: 'Other class', regularClass: true, tuition: null })
      const result2 = await fx.classroom({ title: 'Another class', regularClass: true, tuition: '' })
      const result3 = await fx.classroom({ title: 'Yet another class', regularClass: true, tuition: undefined })

      assert.equal(result.tuition, 100)
      assert.equal(result2.tuition, 100)
      assert.equal(result3.tuition, 100)
    })
  })

  describe('with non existent service', () => {
    it('returs hook if not used properly', () => {
      const result = normalizeData('foo')('bar')
      assert.equal(result, 'bar')
    })
  })
})
