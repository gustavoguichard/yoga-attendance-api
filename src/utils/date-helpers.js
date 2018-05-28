const moment = require('moment')

const getPrevDate = (unit = 'month', unitsAgo = 0, date) =>
  moment(date).subtract(unitsAgo, unit)

const getTimeRangeQuery = (unit = 'month', unitsAgo = 0, date) => ({
  $gte: getPrevDate(unit, unitsAgo, date).startOf(unit)._d,
  $lt: getPrevDate(unit, unitsAgo, date).endOf(unit)._d,
})

module.exports = {
  getPrevDate,
  getTimeRangeQuery,
}
