'use strict'

const cache = require('memory-cache')
const request = require('request-promise')
const _ = require('lodash')

const SPREADSHEET_ID = process.env.SPREADSHEET_ID
const SHEET_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets/'
const API_KEY = `?key=${process.env.API_KEY}`
const SHEET_URL = `${SHEET_API_URL}${SPREADSHEET_ID}${API_KEY}`
const HEADERS = { 'Referer': process.env.REFERER }

module.exports = class SheetService {
  constructor () {
    this._cache = cache
  }

  get cache () {
    return this._cache
  }

  set cache(val) {
    this._cache = val
  }

  get sheet () {
    const sheet = this.cache.get('sheet-values')
    return sheet ? JSON.parse(sheet) : null
  }

  set sheet (sheet) {
    this.cache.put('sheet-values', JSON.stringify(sheet), 3600000)
  }

  fetchValues () {
    if (this.sheet) {
      console.log('cached sheet')
      return Promise.resolve(this.sheet)
    } else {
      return this._fetchSheet().then(() => {
        return this.sheet
      })
    }
  }

  _fetchSheet () {
    return request({ url: SHEET_URL, headers: HEADERS })
      .then((body) => {
        const ranges = JSON.parse(body).sheets.map((sheet) => sheet.properties.title)

        return Promise.all(
          ranges.map((range) => {
            return request({ url: `${SHEET_API_URL}${SPREADSHEET_ID}/values/${range}${API_KEY}`, headers: HEADERS })
          })
        )
      })
      .then((responses) => {
        return responses
      })
      .then((valueRanges) => {
        const vals = valueRanges.map((v) => JSON.parse(v).values)
        this.sheet = _.flattenDeep(vals).filter((v) => v !== '' && /[x][0-9]/g.test(v))
        return this.sheet
      })
  }
}
