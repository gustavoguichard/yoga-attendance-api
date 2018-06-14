const { Conflict } = require('@feathersjs/errors')

module.exports = function () {
  return async function (hook) {
    const { app, data } = hook
    if (!data.practitionerId && data.email) {
      const { email } = data
      const result = await app.service('practitioners').find({ query: { email } })
      if (result.total) {
        const practitioner = result.data[0]
        data.practitionerId = practitioner._id
      } else {
        throw new Conflict(`Não foi possível adicionar novo praticante (${data.email}) à chamada`)
      }
      delete data.email
    }
    return hook
  }
}
