const { difference, find, get, includes, keys, map, replace, reduce, some, sumBy, toInteger, toString } = require('lodash')
const moment = require('moment')

const calculateEnrollment = ({ enrollmentPrice, data, discount, note }, separateFrequencies, family) => {
  const { classroom, className, pricing } = data
  const priceData = find(pricing, p => toString(p._id) === enrollmentPrice)
  if (!priceData) return {}

  const { value, desc, amount } = priceData
  const frequented = classroom
    ? get(separateFrequencies, `${classroom}.length`) || 0
    : get(separateFrequencies, 'regularClass.length') || 0

  const result = { note, title: `${className} - ${desc}`, frequented, amount }
  if (includes(discount, '%')) {
    const perc = 100 - toInteger(replace(discount, '%', ''))
    return { ...result, discount: `Desconto: ${discount}`, value, total: (value * perc) / 100 }
  } else if (includes(discount, '-')) {
    return { ...result, discount: `Desconto: ${toMoney(discount)}`, value, total: value + (discount * 1) }
  } else if (discount) {
    return { ...result, discount: 'Valor combinado', value, total: discount * 1 }
  } else if(!classroom && family) {
    return { ...result, discount: 'Desconto família', value, total: value }
  }
  return { ...result, value, total: value }
}

const calculateTuitions = (separateFrequencies, enrollments, family) => {
  const subscribedList = map(enrollments, e => toString(e.data.classroom) || 'regularClass')
  const frequentedList = keys(separateFrequencies)
  const notSubscribedList = difference(frequentedList, subscribedList)
  return map(notSubscribedList, id => {
    const list = get(separateFrequencies, id)
    const classroom = get(list, '[0].classroom')
    const value = classroom.tuition + (family ? -5 : 0)
    return {
      value,
      title: `${classroom.title} - Avulsa`,
      frequented: list.length,
      discount: family ? 'Desconto família' : null,
      total: value * list.length,
    }
  })
}

const frequencyByClassType = frequencies =>
  reduce(frequencies.data, (sum, curr) => {
    get(curr, 'classroom.regularClass')
      ? sum.regularClass = sum.regularClass ? [...sum.regularClass, curr] : [curr]
      : sum[curr.classId] = sum[curr.classId] ? [...sum[curr.classId], curr] : [curr]
    return sum
  }, {})

const calculatePayment = ({ enrollments, family }, frequencies = []) => {
  const separateFrequencies = frequencyByClassType(frequencies)
  const familyDiscount = (separateFrequencies.regularClass && family.length) ? -10 : 0
  const payments = map(enrollments, e => calculateEnrollment(e, separateFrequencies, familyDiscount))
  const tuitions = calculateTuitions(separateFrequencies, enrollments, familyDiscount)
  const detailing = [
    ...payments,
    ...tuitions,
  ]
  return {
    detailing,
    total: Math.max(sumBy(detailing, 'total'), 0),
  }
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
  getPrevDate,
  getStartOfDate,
  getTimeRangeQuery,
}
