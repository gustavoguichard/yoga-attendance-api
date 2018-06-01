const { get } = require('lodash')
const moment = require('moment')

module.exports = function (serviceName) {
  const options = {
    practitioners: (hook) => {
      const { data } = hook

      if(data.birthdate && !(data.birthdate instanceof Date)) {
        const date = moment(data.birthdate, 'DD/MM/YYYY').add(6, 'hour')
        data.birthdate = date.isValid() ? date._d : null
      }
      return hook
    }
  }
  return get(options, serviceName, hook => hook)
}
