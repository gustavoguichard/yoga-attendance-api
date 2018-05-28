const assert = require('assert')
const feathers = require('@feathersjs/feathers')
const service = require('feathers-memory')
const decorateEnrollment = require('../../src/hooks/decorate-enrollment')

describe(`'decorate-enrollment' hook`, () => {
  let app, classroom //, enrollment
  const data = {
    pricing: { desc: '1x por semana', value: 150 }
  }

  beforeEach(async () => {
    const options = { paginate: { default: 10, max: 25 } }
    app = feathers()

    app.use('/classrooms', service(options))
    app.use('/enrollment', service(options))
    app.service('enrollment').hooks({
      after: decorateEnrollment(),
    })

    classroom = await app.service('classrooms').create({
      id: 10,
      title: 'Some special class',
      tuition: 100,
    })

  })

  it('adds className according to the enrollment classroom ID', async () => {
    await app.service('enrollment').create({
      ...data,
      classroom: classroom.id,
    })

    const enrollments = await app.service('enrollment').find()
    const enrollment = enrollments.data[0]

    assert.equal(enrollment.className, 'Some special class')
  })

  it('adds className "Aulas regulares" when there is no specific class', async () => {
    await app.service('enrollment').create(data)

    const enrollments = await app.service('enrollment').find()
    const enrollment = enrollments.data[0]

    assert.equal(enrollment.className, 'Aulas regulares')
  })
})
