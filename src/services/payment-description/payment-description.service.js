// Initializes the `payment-description` service on path `/payment-description`
const createService = require('./payment-description.class.js');
const hooks = require('./payment-description.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    name: 'payment-description',
    paginate,
  };

  // Initialize our service with any options it requires
  app.use('/payment-description', createService(app, options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('payment-description');

  service.hooks(hooks);
};
