const { get } = require('lodash')
const moment = require('moment')

module.exports = function (serviceName) {
  const options = {
    practitioners: hook => {
      const { data } = hook

      if(data.birthdate) {
        const date = moment(data.birthdate).isValid()
          ? moment(data.birthdate)
          : moment(data.birthdate, 'DD/MM/YYYY')
        data.birthdate = date.isValid() ? date.add(6, 'hour')._d : null
      }
      return hook
    },
    classrooms: async hook => {
      const { app, data } = hook
      const { tuition, regularClass } = data

      if(!tuition && tuition !== undefined && regularClass) {
        const classrooms = (await app.service('classrooms').find({ query: { regularClass: true } })).data
        if (classrooms.length) {
          data.tuition = classrooms[0].tuition
        }
      }
      return hook
    }
  }
  return get(options, serviceName, hook => hook)
}
