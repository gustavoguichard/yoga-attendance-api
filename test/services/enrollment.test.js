const assert = require('assert')
const app = require('../../src/app')

describe('\'enrollment\' service', () => {
  it('registered the service', () => {
    const service = app.service('enrollment')

    assert.ok(service, 'Registered the service')
  })

  describe('decorates the enrollment with className', () => {
    it('className is "Aulas regulares" when no classroom is given', async () => {
      const enrollment = await app.service('enrollment').create({
        pricing: {
          desc: '1x por semana',
          value: 100,
        },
      })
      const resp = await app.service('enrollment').get(enrollment._id)
      assert.equal(resp.className, 'Aulas regulares')
    })

    it('className is classroom.title when it is given', async () => {
      const classroom = await app.service('classrooms').create({
        title: 'Special class',
        tuition: 50,
      })
      const enrollment = await app.service('enrollment').create({
        pricing: {
          desc: '1x por semana',
          value: 100,
        },
        classroom: classroom._id,
      })
      const resp = await app.service('enrollment').get(enrollment._id)
      assert.equal(resp.className, 'Special class')
    })
  })
})
