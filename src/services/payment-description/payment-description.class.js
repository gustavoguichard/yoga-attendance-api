/* eslint-disable no-unused-vars */
const { calculatePayment, getTimeRangeQuery } = require('./payment-description.helpers')
const { map, omit, pick } = require('lodash')

class Service {
  constructor (app, options) {
    this.app = app
    this.options = options || {};
  }

  async find (params) {
    const months = pick(params.query, 'months')
    const query = omit(params.query, 'months')
    const practitioners = await this.app.service('practitioners').find({
      ...params,
      query: { populateEnrollments: true, ...query },
    })
    const ids = map(practitioners.data, '_id')
    const frequencies = await this.app.service('frequency').find({
      query: {
        createdAt: getTimeRangeQuery('month', months),
        practitioners: { $in: ids },
        $limit: 10000,
        populateClassroom: true,
      },
    })
    return map(practitioners.data, p => ({
      _id: p._id,
      ...(params.populatePractitioners ? { practitioner: p } : {}),
      paymentDescription: calculatePayment(p, frequencies),
    }))
  }

  async get (id, params) {
    const months = pick(params.query, 'months')
    const query = omit(params.query, 'months')
    const practitioner = await this.app.service('practitioners').get(id, {
      ...params,
      query: { populateEnrollments: true, ...query },
    })
    const frequencies = await this.app.service('frequency').find({
      query: {
        createdAt: getTimeRangeQuery('month', months),
        practitioners: id,
        $limit: 10000,
        populateClassroom: true,
      },
    })
    return {
      ...(params.populatePractitioners ? { practitioner } : {}),
      _id: practitioner._id,
      paymentDescription: calculatePayment(practitioner, frequencies),
    }
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
