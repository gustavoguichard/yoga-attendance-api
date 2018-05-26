const users = require('./users/users.service.js');
const classrooms = require('./classrooms/classrooms.service.js');
const practitioners = require('./practitioners/practitioners.service.js');
const frequency = require('./frequency/frequency.service.js');
const enrollment = require('./enrollment/enrollment.service.js');
const payments = require('./payments/payments.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(classrooms);
  app.configure(practitioners);
  app.configure(frequency);
  app.configure(enrollment);
  app.configure(payments);
};
