// Initializes the `enrollment` service on path `/enrollment`
const createService = require('feathers-mongoose')
const createModel = require('../../models/enrollment.model')
const hooks = require('./enrollment.hooks')

module.exports = function () {
  const app = this
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    name: 'enrollment',
    Model,
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/enrollment', createService(options))

  // Get our initialized service so that we can register hooks and hooks
  const service = app.service('enrollment')

  service.hooks(hooks)
}
