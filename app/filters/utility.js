// -------------------------------------------------------------------
// Imports and setup
// -------------------------------------------------------------------
const _ = require('lodash')

// Leave this filters line
const filters = {}

/*
  ====================================================================
  debug
  --------------------------------------------------------------------
  Short description for the filter
  ====================================================================

  Usage:

  [Usage here]

*/

filters.debug = (item) => {
  console.log('Debug', item)
  return item
}

/*
  ====================================================================
  falsify
  --------------------------------------------------------------------
  Short description for the filter
  ====================================================================

  Usage:

  [Usage here]

*/

filters.falsify = (input) => {
  if (_.isNumber(input)) return input
  else if (input === false) return false
  else if (input === 'true') return true
  else if (input === 'false') return false
  return input
}

/*
  ====================================================================
  addIndexCount
  --------------------------------------------------------------------
  Short description for the filter
  ====================================================================

  Usage:

  [Usage here]

*/

filters.addIndexCount = array => {
  array.forEach((item, index) => {
    item.index = index
  })
  return array
}

// -------------------------------------------------------------------
// keep the following line to return your filters to the app
// -------------------------------------------------------------------
exports.filters = filters
