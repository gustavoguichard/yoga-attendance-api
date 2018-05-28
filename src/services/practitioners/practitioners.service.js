// Initializes the `practitioners` service on path `/practitioners`
const createService = require('feathers-mongoose')
const createModel = require('../../models/practitioners.model')
const hooks = require('./practitioners.hooks')

module.exports = function () {
  const app = this
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    name: 'practitioners',
    Model,
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/practitioners', createService(options))

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('practitioners')

  service.hooks(hooks)
}
