const app = require('../src/app')
const { pick } = require('lodash')

const data = {
  practitioner: {
    fullName: 'Test User',
    email: 'test@test.com',
    birthdate: new Date(),
    picture: 'foo',
    family: [],
    accessCode: '1010',
  },
  classroom: {
    title: 'Sunday class',
    tuition: 100,
    regularClass: true,
  },
  user: {
    email: 'test@example.com',
    password: 'secret',
  },
}

module.exports = {
  data,
  practitioner: (params, fields = ['fullName', 'email', 'family']) =>
    app.service('practitioners').create({
      ...pick(data.practitioner, fields),
      ...params,
    }),
  classroom: (params, fields = ['title', 'tuition']) =>
    app.service('classrooms').create({
      ...pick(data.classroom, fields),
      ...params,
    }),
  user: (params, fields = ['email', 'password']) =>
    app.service('users').create({
      ...pick(data.user, fields),
      ...params,
    }),
}
