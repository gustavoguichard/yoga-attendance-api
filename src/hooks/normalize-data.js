const { get, includes } = require('lodash')
const moment = require('moment')

module.exports = serviceName => {
  const options = {
    practitioners: hook => {
      const { data } = hook

      if(data.birthdate) {
        const date = typeof data.birthdate === 'string'
          ? moment(data.birthdate, 'DD/MM/YYYY')
          : moment(data.birthdate)
        data.birthdate = date.isValid() ? date._d : null
      }
      if(data.email) {
        data.email = data.email.toLowerCase()
      }
      return hook
    },
    classrooms: async hook => {
      const { app, data, method } = hook
      const { tuition, regularClass } = data
      if(!tuition && includes(['create', 'update'], method) && regularClass) {
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
