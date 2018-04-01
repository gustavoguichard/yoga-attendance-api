const { padStart, random, includes, map } = require('lodash')
const moment = require('moment')

const generateRandom = () => padStart(random(0, 9999), 4, '0')
const generateFromBD = bd => moment(bd).format('DDMM')

module.exports = function () {
  return function (hook) {
    if(!hook.data.accessCode) {
      return hook.service.find({ query: { $limit: 10000, $select: ['accessCode'] } }).then((data) => {
        const accessCodes = map(data, 'accessCode')
        let tempCode = hook.data.birthdate && generateFromBD(hook.data.birthdate)
        let existingCode = tempCode ? includes(accessCodes, tempCode) : true
        while(existingCode) {
          tempCode = generateRandom()
          existingCode = includes(accessCodes, tempCode)
        }
        hook.data.accessCode = tempCode
        return hook;
      });
    }
    return Promise.resolve(hook);
  };
};
