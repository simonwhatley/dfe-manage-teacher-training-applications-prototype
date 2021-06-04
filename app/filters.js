const _ = require('lodash');

module.exports = function (env) {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  const filters = {}
  
  /* ------------------------------------------------------------------
  utility function to return true or false
  example: {{ 'yes' | falsify }}
  outputs: true
  ------------------------------------------------------------------ */
  filters.falsify = (input) => {
    if (_.isNumber(input)) return input
    else if (input == false) return false
    if (_.isString(input)){
      const truthyValues = ['yes','true']
      const falsyValues = ['no', 'false']
      if (truthyValues.includes(input.toLowerCase())) return true
      else if (falsyValues.includes(input.toLowerCase())) return false
    }
    return input
  }

  /* ------------------------------------------------------------------
  utility function to get an error for a component
  example: {{ errors | getErrorMessage('title') }}
  outputs: "Enter a title"
  ------------------------------------------------------------------ */
  filters.getErrorMessage = function (array, fieldName) {
    if (!array || !fieldName) {
      return null
    }

    const error = array.filter((obj) =>
      obj.fieldName === fieldName
    )[0]

    return error
  }
  
  /* ------------------------------------------------------------------
  utility function to get the statistics cycle label
  example: {{ "2020 to 2021" | cycleText }}
  outputs: "2020 to 2021 (starts 2021)"
  ------------------------------------------------------------------ */
  filters.cycleText = (cycle) => {
    if(cycle == "2020 to 2021") {
      return "2020 to 2021 (starts 2021)"
    } else {
      return "2019 to 2020 (starts 2020)"
    }
  }
  
  /* ------------------------------------------------------------------
  utility function to get the statistics option label
  example: {{ "cycle" | getStatisticsOptionLabel }}
  outputs: "Year received"
  ------------------------------------------------------------------ */
  filters.getStatisticsOptionLabel = (option) => {
    let label = ''
    switch (option) {
      case 'cycle':
        label = 'Year received'
        break
      case 'status':
        label = 'Status'
        break
      case 'subject':
        label = 'Subject'
        break
      case 'studyMode':
        label = 'Full time or part time'
        break
      case 'fundingType':
        label = 'Fee paying or salaried'
        break
      case 'subjectLevel':
        label = 'Primary or secondary'
        break
      case 'location':
        label = 'Location'
        break
      case 'provider':
      case 'trainingProvider':
        label = 'Courses run by'
        break
      case 'accreditedBody':
        label = 'Courses ratified by'
        break
    }
    return label
  }
  
  /* ------------------------------------------------------------------
  utility function to get the nationality label
  example: {{ "Europe" | getNationalityLabel }}
  outputs: "EU, Switzerland, Norway, Iceland or Liechtenstein (not Ireland)"
  ------------------------------------------------------------------ */
  filters.getNationalityLabel = (nationality) => {
    switch (nationality) {
      case 'British':
      case 'British (Dual)':
      case 'Irish':
        return nationality
      case 'Europe':
        return 'EU, Switzerland, Norway, Iceland or Liechtenstein (not Ireland)'
      case 'Rest of world':
        return 'Somewhere else'
    }
  }

  /* ------------------------------------------------------------------
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */
  return filters
}
