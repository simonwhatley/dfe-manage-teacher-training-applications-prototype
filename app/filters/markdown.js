// -------------------------------------------------------------------
// Imports and setup
// -------------------------------------------------------------------
const marked = require('marked')

// Leave this filters line
const filters = {}

/*
  ====================================================================
  markdownToHtml
  --------------------------------------------------------------------
  Create HTML from markdown
  ====================================================================

  Usage:

  {{ "**Enter a title**" | markdownToHtml }}

  = "<strong>Enter a title</strong>"

*/

filters.markdownToHtml = (markdown) => {
  if (!markdown) {
    return null
  }
  const html = marked(markdown)
  return html
}

// -------------------------------------------------------------------
// keep the following line to return your filters to the app
// -------------------------------------------------------------------
exports.filters = filters
