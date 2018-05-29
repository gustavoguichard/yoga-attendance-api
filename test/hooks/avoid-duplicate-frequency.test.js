const assert = require('assert')
const moment = require('moment')
const feathers = require('@feathersjs/feathers')
const service = require('feathers-memory')
const avoidDuplicateFrequency = require('../../src/hooks/avoid-duplicate-frequency')

describe(`'avoid-duplicate-frequency' hook`, () => {
  let app

  beforeEach(async () => {
    const options = { paginate: { default: 10, max: 25 } }
    app = feathers()

    app.use('/frequency', service(options))
    app.service('frequency').hooks({
      before: { create: avoidDuplicateFrequency() }
    })

    await app.service('frequency').create({
      classId: 'foo',
      practitionerId: 'bar',
      createdAt: moment().subtract(1, 'minutes')._d,
    })
  })

  it('does not allow 2 frequencies of same practitioner, class and day', async () => {
    const freq = await app.service('frequency').create({
      classId: 'foo',
      practitionerId: 'bar',
      createdAt: moment()._d,
    })

    assert.ok(!freq.id)
  })

  it('allows 2 frequencies of different practitioner, class on same day', async () => {
    const freq = await app.service('frequency').create({
      classId: 'foo2',
      practitionerId: 'bar',
      createdAt: moment()._d,
    })

    const freq2 = await app.service('frequency').create({
      classId: 'foo',
      practitionerId: 'bar2',
      createdAt: moment()._d,
    })

    assert.ok(freq.id)
    assert.ok(freq2.id)
  })

  it('allows 2 frequencies of same practitioner, class on different days', async () => {
    const freq = await app.service('frequency').create({
      classId: 'foo',
      practitionerId: 'bar',
      createdAt: moment().subtract(2, 'days')._d,
    })

    assert.ok(freq.id)
  })
})
