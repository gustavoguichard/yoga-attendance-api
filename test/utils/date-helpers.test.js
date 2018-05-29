const { toString } = require('lodash')
const moment = require('moment')
const assert = require('assert')
const subject = require('../../src/utils/date-helpers')

const fmt = 'YYYY-MM-DD'

describe(`'date' helpers`, () => {
  describe('getPrevDate', () => {
    it('returns now by default', () => {
      const result = subject.getPrevDate()
      assert.equal(result.format(fmt), moment().format(fmt))
    })

    it('returns month before if passing a number', () => {
      const result = subject.getPrevDate(1)
      assert.equal(result.format(fmt), moment().subtract(1, 'month').format(fmt))

      const result2 = subject.getPrevDate('day', 1)
      assert.equal(result2.format(fmt), moment().subtract(1, 'day').format(fmt))
    })
  })

  describe('getTimeRangeQuery', () => {
    it('returns start of month by default', () => {
      const result = subject.getTimeRangeQuery()
      assert.equal(toString(result.$gte), toString(moment().startOf('month')._d))
    })

    it('returns start of other values', () => {
      const result = subject.getTimeRangeQuery(undefined, 'day')
      assert.equal(toString(result.$gte), toString(moment().startOf('day')._d))
      const result2 = subject.getTimeRangeQuery(undefined, 'year')
      assert.equal(toString(result2.$gte), toString(moment().startOf('year')._d))
    })

    it('returns start of past months', () => {
      const result = subject.getTimeRangeQuery(1, 'month')
      assert.equal(toString(result.$gte), toString(moment().subtract(1, 'month').startOf('month')._d))
      assert.equal(toString(result.$lt), toString(moment().subtract(1, 'month').endOf('month')._d))
    })

    it('works with a given date', () => {
      const result = subject.getTimeRangeQuery(1, 'month', '2010-09-10')
      assert.equal(toString(result.$gte), toString(moment('2010-09-10').subtract(1, 'month').startOf('month')._d))
      assert.equal(toString(result.$lt), toString(moment('2010-09-10').subtract(1, 'month').endOf('month')._d))
    })
  })
})
