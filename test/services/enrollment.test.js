const assert = require('assert')
const app = require('../../src/app')

describe('\'enrollment\' service', async () => {
  it('registered the service', () => {
    const service = app.service('enrollment')

    assert.ok(service, 'Registered the service')
  })

  describe('decorates the enrollment with className', async () => {
    it('className is "Aulas regulares" when no classId is given', async () => {
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
        classId: classroom._id,
      })
      const resp = await app.service('enrollment').get(enrollment._id)
      console.log(resp)
      assert.equal(resp.className, 'Special class')
    })
  })
})
