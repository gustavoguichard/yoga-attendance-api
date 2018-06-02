const { BadRequest, Conflict } = require('@feathersjs/errors')
const { get, includes, isNaN, size, toString, words } = require('lodash')
// const moment = require('moment')

const isNumber = value => !isNaN(+value)
const isFullRecord = method => includes(['create', 'update'], method)

module.exports = function (serviceName) {

  const options = {
    practitioners: async (hook) => {
      const { data, app, id } = hook
      const { fullName, email, phone } = data
      if (!fullName && fullName !== undefined) {
        throw new BadRequest('É necessário informar o nome completo')
      }
      if (fullName && size(words(fullName)) < 2) {
        throw new BadRequest('Nome completo deve conter ao menos 2 palavras')
      }
      if (email) {
        const result = (await app.service('practitioners').find({ query: { email } })).data[0]
        if (result && toString(result._id) !== id) {
          throw new Conflict(`Email ${email} já está sendo utilizado`)
        }
      }
      if (phone && !isNumber(phone)) {
        throw new BadRequest('Por favor, confira o número de telefone')
      }
    },
    classrooms: async (hook) => {
      const { data, method } = hook
      const { title, tuition } = data
      if (!title && isFullRecord(method)) {
        throw new BadRequest('É necessário informar um título')
      }
      if (!tuition && tuition !== 0 && isFullRecord(method)) {
        throw new BadRequest('É necessário informar um preço')
      }
    },
  }
  return get(options, serviceName, hook => hook)
}