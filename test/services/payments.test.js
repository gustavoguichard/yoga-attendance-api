const assert = require('assert')
const moment = require('moment')
const app = require('../../src/app')
const fx = require('../fixtures')
const beforeAll = require('../beforeAll')

const service = app.service('payments')
describe('\'payments\' service', () => {
  it('registered the service', () => {
    assert.ok(service, 'Registered the service')
  })

  describe(`'update payments' hook`, async () => {
    let practitioner, classroom, enrollment, date, addFrequency

    beforeAll(async () => {
      await app.service('practitioners').remove(null)
      await app.service('classrooms').remove(null)
      await app.service('enrollment').remove(null)
      practitioner = await fx.practitioner()
      classroom = await fx.classroom()
      enrollment = await app.service('enrollment').create({
        pricing: { desc: '1x por semana', value: 100 },
        classId: classroom._id,
      })
      date = moment().startOf('month').add(1)._d
      addFrequency = (createdAt = date, teacher, classId = classroom._id) => app.service('frequency').create({ classId, practitionerId: practitioner._id, createdAt, teacher })
    })

    beforeEach(async () => {
      await app.service('payments').remove(null)
      await app.service('frequency').remove(null)
    })

    it('creates a payment when a new frequency is created', async () => {
      await addFrequency()
      const payment = (await service.find()).data[0]

      assert.equal(payment.status, 'open')
      assert.equal(payment.total, classroom.tuition)
      assert.equal(payment.totalPaid, 0)
      assert.ok(payment.description)
      assert.ok(payment.index)
    })

    it('creates a new payment when a frequency is changed from teacher to student', async () => {
      let freq = await addFrequency(undefined, true)
      let result = await service.find()
      assert.equal(result.total, 0)

      await app.service('frequency').patch(freq._id, { teacher: false })
      result = await service.find()
      assert.equal(result.total, 1)
    })

    describe('removes the payment', async () => {
      it('when a frequency is removed', async () => {
        let freq = await addFrequency()
        let freq2 = await addFrequency(moment(date).add(2, 'day')._d)
        await app.service('frequency').remove(freq._id)

        let payment = (await service.find()).data[0]
        assert.equal(payment.frequented.length, 1)

        await app.service('frequency').remove(freq2._id)
        const result = await service.find()
        assert.equal(result.total, 0)
      })

      it('when a frequency is changed from student to teacher', async () => {
        let freq = await addFrequency()
        let result = await service.find()
        assert.equal(result.total, 1)

        await app.service('frequency').patch(freq._id, { teacher: true })
        result = await service.find()
        assert.equal(result.total, 0)
      })

      it('does not remove when it is not open', async () => {
        let freq = await addFrequency()
        let payment = (await service.find()).data[0]
        await service.patch(payment._id, { status: 'paid' })
        await app.service('frequency').remove(freq._id)

        const result = await service.find()
        assert.equal(result.total, 1)
      })
    })

    describe('when is tuition', async () => {
      it('duplicates the tuition price when user has no enrollment in the class', async () => {
        await addFrequency()
        await addFrequency(moment(date).add(2, 'day')._d)

        const payment = (await service.find()).data[0]
        assert.equal(payment.total, 200)
      })

      it('creates a new payment when payment is not open or pending', async () => {
        await addFrequency()
        let payment = (await service.find()).data[0]
        await service.patch(payment._id, { status: 'paid' })
        await addFrequency(moment(date).add(2, 'day')._d)
        const result = await service.find()

        assert.equal(result.total, 2)
      })
    })

    describe('with enrollment', async () => {
      before(async () => {
        await app.service('practitioners').patch(practitioner._id, { enrollments: [{ enrollmentId: enrollment._id, enrollmentPrice: enrollment.pricing[0]._id }] })
      })

      it('keeps total value when practitioner has enrollment in the class', async () => {
        await addFrequency()
        await addFrequency(moment(date).add(2, 'day')._d)
        const payment = (await service.find()).data[0]

        assert.equal(payment.total, 100)
      })

      it('keeps total value when practitioner has enrollment in the class', async () => {
        await addFrequency()
        let payment = (await service.find()).data[0]
        await service.patch(payment._id, { status: 'paid' })
        await addFrequency(moment(date).add(2, 'day')._d)
        const result = await service.find()

        assert.equal(result.total, 1)
      })

      it('starts new payment when it is new month', async () => {
        await addFrequency()
        await addFrequency(moment(date).add(1, 'month')._d)
        const result = await service.find()

        assert.equal(result.total, 2)
      })
    })

    describe('regularClass', async () => {
      let class2, class3
      before(async () => {
        await app.service('classrooms').patch(classroom._id, { regularClass: true })
        class2 = await fx.classroom({ title: 'Foo', regularClass: true })
        class3 = await fx.classroom({ title: 'Bar' })
      })

      it('increases frequented when it is a different regular class', async () => {
        let freq = await addFrequency()
        await addFrequency(undefined, undefined, class2._id)
        let freq3 = await addFrequency(undefined, undefined, class3._id)
        let payments = await service.find()
        let payment = (await service.find()).data[0]

        assert.equal(payments.total, 2)
        assert.equal(payment.total, 200)

        await app.service('frequency').remove(freq._id)
        await app.service('frequency').remove(freq3._id)

        payments = await service.find()
        assert.equal(payments.total, 1)
      })

    })
  })
})
