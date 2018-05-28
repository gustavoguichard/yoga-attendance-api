// Initializes the `classrooms` service on path `/classrooms`
const createService = require('feathers-mongoose')
const createModel = require('../../models/classrooms.model')
const hooks = require('./classrooms.hooks')

module.exports = function () {
  const app = this
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    name: 'classrooms',
    Model,
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/classrooms', createService(options))

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('classrooms')

  service.hooks(hooks)
}
