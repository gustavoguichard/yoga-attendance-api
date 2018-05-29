const {
  compact, find, join, includes, replace, toInteger, toString
} = require('lodash')
const moment = require('moment')

const FAMILY_DISCOUNT = 10

const classId = classroom => classroom.regularClass ? null : toString(classroom._id)

const buildIndex = ({ createdAt, practitionerId }, classroom) => {
  const month = moment(createdAt).format('YYYY-MM')
  return join(compact([ practitionerId, classId(classroom), month ]), '_')
}

const calculateEnrollment = ({ enrollments, family }, classroom) => {
  const enrollment = find(enrollments, en => en.data.classId === classId(classroom))
  const { enrollmentId, enrollmentPrice, data, discount, note } = enrollment || {}
  const { pricing } = data || {}
  const priceData = find(pricing, p => toString(p._id) === enrollmentPrice)
    || { value: classroom.tuition, desc: 'Avulsa' }

  const { value, desc, amount } = priceData

  const values = () => {
    if (includes(discount, '%')) {
      const perc = 100 - toInteger(replace(discount, '%', ''))
      return { discount: `Desconto: ${discount}`, value, total: (value * perc) / 100 }
    } else if (includes(discount, '-')) {
      return { discount: `Desconto: R$ ${discount},00`, value, total: value + toInteger(discount) }
    } else if (discount) {
      return { discount: 'Valor combinado', value, total: toInteger(discount) }
    } else if(classroom.regularClass && family && family.length) {
      return { discount: 'Desconto família', value, total: value - FAMILY_DISCOUNT }
    }
    return { value, total: value }
  }

  return {
    ...values(),
    enrollmentId,
    enrollmentPrice,
    amount,
    note,
    title: `${classroom.regularClass ? 'Aulas Regulares' : classroom.title} - ${desc}`,
  }
}

module.exports = {
  classId,
  buildIndex,
  calculateEnrollment,
}
