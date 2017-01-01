'use strict'

const request = require('request-promise')
const Hapi = require('hapi')

const SheetService = require('./sheet-service')
const server = new Hapi.Server()

server.connection({ port: process.env.PORT || 3000, address: '0.0.0.0' })

const service = new SheetService()

server.register(require('inert'), (err) => {
  if (err) {
      throw err;
  }

  server.route({
    method: 'GET',
    path: '/spreadsheet',
    handler: function (req, reply) {
      service.fetchValues().then((values) => {
        reply(values)
      })
    }
  })

  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply.file('./index.html')
    }
  })

  server.route({
    method: 'GET',
    path: '/public/{file*}',
    handler: {
      directory: {
        path: 'public/'
      }
    }
  })
})

// fetch the sheet so its cached from server start
service.fetchValues().then(() => {
  server.start((err) => {
    if (err) {
      throw err
    }

    console.log(`Server running at: ${server.info.uri}`)
  })
})
