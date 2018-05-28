const { padStart, random, includes, map } = require('lodash')
const moment = require('moment')

const generateRandom = () => padStart(random(0, 9999), 4, '0')
const generateFromBD = bd => moment(bd).format('DDMM')

module.exports = function () {
  return function (hook) {
    const { app, data } = hook

    if(!data.accessCode) {
      return app.service('users').find({ query: { $limit: 10000, $select: ['accessCode'] } }).then((data) => {
        const accessCodes = map(data, 'accessCode')
        let tempCode = data.birthdate && generateFromBD(data.birthdate)
        let existingCode = tempCode ? includes(accessCodes, tempCode) : true
        while(existingCode) {
          tempCode = generateRandom()
          existingCode = includes(accessCodes, tempCode)
        }
        data.accessCode = tempCode
        return hook
      })
    }
    return Promise.resolve(hook)
  }
}
