const moment = require('moment')

const getPrevDate = (unitsAgo = 0, unit = 'month', date) =>
  moment(date).subtract(unitsAgo, unit)

const getTimeRangeQuery = (unitsAgo = 0, unit = 'month', date) => ({
  $gte: getPrevDate(unitsAgo, unit, date).startOf(unit)._d,
  $lt: getPrevDate(unitsAgo, unit, date).endOf(unit)._d,
})

module.exports = {
  getPrevDate,
  getTimeRangeQuery,
}
