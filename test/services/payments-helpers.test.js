const moment = require('moment')
const assert = require('assert')
const subject = require('../../src/services/payments/payments-helpers')

describe(`'payments' helpers`, () => {
  let _id

  before(() => {
    _id = 180
  })

  describe('classId', () => {
    it('returns the stringified _id if not a regularClass', () => {
      const result = subject.classId({ _id })
      assert.strictEqual(result, '180')
    })

    it('returns null if it is a regularClass', () => {
      const result = subject.classId({ _id, regularClass: true })
      assert.strictEqual(result, null)
    })
  })

  describe('buildIndex', () => {
    it('concats id, date and classroomId into a string', () => {
      const frequency = {
        createdAt: moment('2010-05-05')._d,
        practitionerId: 'foo_bar$',
      }
      const classroom = { _id }
      const result = subject.buildIndex(frequency, classroom)
      const result2 = subject.buildIndex(frequency, { ...classroom, regularClass: true })
      assert.equal(result, 'foo_bar$_180_2010-05')
      assert.equal(result2, 'foo_bar$_2010-05')
    })
  })

  describe('calculateEnrollment', () => {
    let classroom, enrollment, person

    beforeEach(() => {
      enrollment = {
        enrollmentId: 'foo',
        enrollmentPrice: 'bar',
        data: {
          classId: 'classFoo',
          pricing: [{
            _id: 'bar',
            amount: 2,
            value: 100,
            desc: '1x por semana',
          }],
        },
        discount: '',
        note: 'Some note',
      }

      classroom = { title: 'My Classroom', tuition: 180, _id: 'classFoo' }
      person = { enrollments: [enrollment] }
    })

    it('returns details about payment values', () => {
      const result = subject.calculateEnrollment(person, classroom)

      assert.equal(result.value, 100)
      assert.equal(result.total, 100)
      assert.equal(result.enrollmentId, 'foo')
      assert.equal(result.amount, 2)
      assert.equal(result.note, 'Some note')
      assert.equal(result.title, 'My Classroom - 1x por semana')
      assert.ok(!result.discount)
    })

    it('uses tuition price when there is no corresponding enrollment', () => {
      const result = subject.calculateEnrollment({}, classroom)

      assert.equal(result.value, 180)
      assert.equal(result.total, 180)
      assert.ok(!result.enrollmentId)
      assert.ok(!result.amount)
      assert.ok(!result.note)
      assert.equal(result.title, 'My Classroom - Avulsa')
    })

    it('prints Aulas regulares when it is a regularClass', () => {
      enrollment.data.classId = null
      person.enrollments = [enrollment]
      classroom.regularClass = true
      const result = subject.calculateEnrollment({}, classroom)
      const result2 = subject.calculateEnrollment(person, classroom)

      assert.equal(result.total, 180)
      assert.equal(result.title, 'Aulas Regulares - Avulsa')
      assert.equal(result2.title, 'Aulas Regulares - 1x por semana')
    })

    it('uses percent discount', () => {
      enrollment.discount = '50%'
      person.enrollments = [enrollment]
      const result = subject.calculateEnrollment(person, classroom)

      assert.equal(result.value, 100)
      assert.equal(result.total, 50)
      assert.equal(result.discount, 'Desconto: 50%')
    })

    it('uses subraction discount', () => {
      enrollment.discount = '-20'
      person.enrollments = [enrollment]
      const result = subject.calculateEnrollment(person, classroom)

      assert.equal(result.value, 100)
      assert.equal(result.total, 80)
      assert.equal(result.discount, 'Desconto: R$ -20,00')
    })

    it('uses absolute discount', () => {
      enrollment.discount = '20'
      person.enrollments = [enrollment]
      const result = subject.calculateEnrollment(person, classroom)

      assert.equal(result.value, 100)
      assert.equal(result.total, 20)
      assert.equal(result.discount, 'Valor combinado')
    })

    it('uses family if there is no other discount', () => {
      enrollment.data.classId = null
      classroom.regularClass = true
      person.family = ['foo']
      person.enrollments = [enrollment]
      const result = subject.calculateEnrollment(person, classroom)

      assert.equal(result.total, 90)
      assert.equal(result.discount, 'Desconto família')
    })
  })
})
