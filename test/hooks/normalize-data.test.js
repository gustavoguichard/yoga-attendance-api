const assert = require('assert')
const { includes, toString } = require('lodash')
const fx = require('../fixtures')
const app = require('../../src/app')
const normalizeData = require('../../src/hooks/normalize-data')

describe('normalizeData', async () => {
  describe('practitioners', async () => {
    let service
    before(() => {
      app.service('practitioners').remove(null)
      service = app.service('practitioners')
    })

    describe('birthdate field', async () => {
      let result

      before(async () => {
        result = await fx.practitioner({ fullName: 'Birthday Bro', birthdate: '05051992', email: 'test3@test.com' })
      })

      it('normalizes brazilian DD/MM/YYYY', async () => {
        assert.ok(includes(toString(result.birthdate), 'May 05 1992'))
      })

      it('accepts normal date', async () => {
        result = await service.patch(result._id, { birthdate: '1992-05-05T03:00:00.000Z' })
        assert.ok(includes(toString(result.birthdate), 'May 05 1992'))
      })

      it('skips blank date', async () => {
        result = await service.patch(result._id, { birthdate: null })
        assert.ok(!result.birthdate)
      })

      it('skips weird date', async () => {
        result = await service.patch(result._id, { birthdate: 'foobar' })
        assert.ok(!result.birthdate)
      })
    })

  })

  describe('with non existent service', () => {
    it('returs hook if not used properly', () => {
      const result = normalizeData('foo')('bar')
      assert.equal(result, 'bar')
    })
  })
})
