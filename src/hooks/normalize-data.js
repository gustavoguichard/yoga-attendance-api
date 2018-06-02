const { get, includes } = require('lodash')
const moment = require('moment')

module.exports = serviceName => {
  const options = {
    practitioners: hook => {
      const { data } = hook

      if(data.birthdate) {
        const date = moment(data.birthdate).isValid()
          ? moment(data.birthdate)
          : moment(data.birthdate, 'DD/MM/YYYY')
        data.birthdate = date.isValid() ? date._d : null
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
