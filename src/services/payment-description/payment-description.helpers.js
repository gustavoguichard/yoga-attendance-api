const {
  difference, filter, find, flatten, get, includes, keys, map,
  replace, reduce, sumBy, toInteger, toString,
} = require('lodash')
const moment = require('moment')

const calculateEnrollment = ({ enrollmentId, enrollmentPrice, data, discount, note }, separateFrequencies, family) => {
  const { classroom, className, pricing } = data
  const priceData = find(pricing, p => toString(p._id) === enrollmentPrice)
  if (!priceData) return {}

  const { value, desc, amount } = priceData
  const frequented = classroom
    ? get(separateFrequencies, `${classroom}.length`) || 0
    : get(separateFrequencies, 'regularClass.length') || 0

  const result = {
    enrollmentId,
    enrollmentPrice,
    frequented,
    amount,
    classroom,
    note,
    title: `${className} - ${desc}`,
  }
  if (includes(discount, '%')) {
    const perc = 100 - toInteger(replace(discount, '%', ''))
    return { ...result, discount: `Desconto: ${discount}`, value, total: (value * perc) / 100 }
  } else if (includes(discount, '-')) {
    return { ...result, discount: `Desconto: R$ ${discount},00`, value, total: value + (discount * 1) }
  } else if (discount) {
    return { ...result, discount: 'Valor combinado', value, total: discount * 1 }
  } else if(!classroom && family) {
    return { ...result, discount: 'Desconto família', value, total: value + family }
  }
  return { ...result, value, total: value }
}

const calculateTuitions = (separateFrequencies, enrollments, family) => {
  const subscribedList = map(enrollments, e => toString(e.data.classroom) || 'regularClass')
  const frequentedList = keys(separateFrequencies)
  const notSubscribedList = difference(frequentedList, subscribedList)
  return flatten(map(notSubscribedList, id => {
    const list = get(separateFrequencies, id)
    const classroom = get(list, '[0].classroom')
    const familyDiscount = classroom.regularClass && family
    const value = classroom.tuition + (familyDiscount ? -5 : 0)
    return map(list, lesson => ({
      classroom: classroom.regularClass ? null : classroom._id,
      value,
      date: lesson.createdAt,
      title: `${classroom.title} - Avulsa`,
      discount: familyDiscount ? 'Desconto família' : null,
      total: value,
    }))
  }))
}

const frequencyByClassType = frequencies =>
  reduce(frequencies, (sum, curr) => {
    get(curr, 'classroom.regularClass')
      ? sum.regularClass = sum.regularClass ? [...sum.regularClass, curr] : [curr]
      : sum[curr.classId] = sum[curr.classId] ? [...sum[curr.classId], curr] : [curr]
    return sum
  }, {})

const filterFrequency = ({ data }, _id) => {
  return filter(data, f => {
    const ids = map(f.practitioners, toString)
    return includes(ids, toString(_id))
  })
}

const calculatePayment = ({ _id, enrollments, family }, frequencies = []) => {
  const practitionerFrequency = filterFrequency(frequencies, _id)
  const separateFrequencies = frequencyByClassType(practitionerFrequency)
  const familyDiscount = (separateFrequencies.regularClass && family.length) ? -10 : 0
  const payments = map(enrollments, e => calculateEnrollment(e, separateFrequencies, familyDiscount))
  const tuitions = calculateTuitions(separateFrequencies, enrollments, familyDiscount)
  const detailing = [ ...payments, ...tuitions ]
  const total = Math.max(sumBy(detailing, 'total'), 0)
  return { detailing, total }
}

const getPrevDate = (unit = 'month', unitsAgo = 0) =>
  moment().subtract(unitsAgo, unit)

const getStartOfDate = (unit = 'month', unitsAgo = 0) =>
  getPrevDate(unit, unitsAgo).startOf(unit)

const getTimeRangeQuery = (unit = 'month', unitsAgo = 0) => ({
  $gte: getPrevDate(unit, unitsAgo).startOf(unit)._d,
  $lt: getPrevDate(unit, unitsAgo).endOf(unit)._d,
})

module.exports = {
  calculateEnrollment,
  calculatePayment,
  calculateTuitions,
  getPrevDate,
  getStartOfDate,
  getTimeRangeQuery,
}
