const { random, includes, map, takeRight } = require('lodash')
const moment = require('moment')

const generate2Random = (init = 0) => takeRight((''+random(init, 100)).split(''), 2).join('')
const generateRandom = () => generate2Random(32) + generate2Random(13)
const generateFromBD = bd => moment(bd).format('DDMM')

module.exports = function () {
  return function (hook) {
    const { app, data } = hook

    if(!data.accessCode) {
      return app.service('practitioners').find({ query: { $limit: 10000, $select: ['accessCode']} }).then(results => {
        const accessCodes = map(results.data, 'accessCode')
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
