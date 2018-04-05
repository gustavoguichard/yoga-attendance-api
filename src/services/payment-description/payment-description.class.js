/* eslint-disable no-unused-vars */
const { calculatePayment, getTimeRangeQuery } = require('./payment-description.helpers')
const { omit, pick } = require('lodash')

class Service {
  constructor (app, options) {
    this.app = app
    this.options = options || {};
  }

  async find (params) {
    return [];
  }

  async get (id, params) {
    const months = pick(params.query, 'months')
    const query = omit(params.query, 'months')
    const practitioner = await this.app.service('practitioners').get(id, {
      ...params,
      query: {
        populateEnrollments: true,
        ...query,
      },
    })
    const frequencies = await this.app.service('frequency').find({
      query: {
        createdAt: getTimeRangeQuery('month', months),
        practitioners: id,
        $limit: 10000,
        populateClassroom: true,
      },
    })
    const result = calculatePayment(practitioner, frequencies)
    return result
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return await Promise.all(data.map(current => this.create(current)));
    }

    return data;
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }
}

module.exports = function (app, options) {
  return new Service(app, options);
};

module.exports.Service = Service;
