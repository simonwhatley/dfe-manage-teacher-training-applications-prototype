// -------------------------------------------------------------------
// Imports and setup
// -------------------------------------------------------------------
const pluralize = require('pluralize')

// Leave this filters line
const filters = {}

/*
  ====================================================================
  pluralise
  --------------------------------------------------------------------
  Pluralise and singularise any word
  ====================================================================

  Usage:

  {{ "person" | pluralise }}

  = "people"

*/

filters.pluralise = (content, ...args) => {
  // pluralize.addSingularRule(/lens$/i, 'lens')
  // pluralize.addPluralRule(/lens$/i, 'lenses')
  // pluralize.addPluralRule(/correspondence$/i, 'correspondence')
  return pluralize(content, ...args)
}

// -------------------------------------------------------------------
// keep the following line to return your filters to the app
// -------------------------------------------------------------------
exports.filters = filters
