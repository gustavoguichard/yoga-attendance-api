const assert = require('assert')
const rp = require('request-promise')
const app = require('../src/app')

describe('Feathers application tests', () => {
  before(done => {
    this.server = app.listen(3030)
    this.server.once('listening', () => done())
  })

  after(done => {
    this.server.close(done)
  })

  it('starts and shows the index page', async () => {
    const body = await rp('http://localhost:3030')
    assert.ok(body.indexOf('<html>') !== -1)
  })

  describe('404', () => {
    it('shows a 404 HTML page', async () =>
      rp({
        url: 'http://localhost:3030/path/to/nowhere',
        headers: {
          Accept: 'text/html',
        },
      }).catch(res => {
        assert.equal(res.statusCode, 404)
        assert.ok(res.error.indexOf('<html>') !== -1)
      }))

    it('shows a 404 JSON error without stack trace', () =>
      rp({
        url: 'http://localhost:3030/path/to/nowhere',
        json: true,
      }).catch(res => {
        assert.equal(res.statusCode, 404)
        assert.equal(res.error.code, 404)
        assert.equal(res.error.message, 'Page not found')
        assert.equal(res.error.name, 'NotFound')
      }))
  })
})
