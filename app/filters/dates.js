// -------------------------------------------------------------------
// Imports and setup
// -------------------------------------------------------------------
const moment = require('moment')
const _ = require('lodash')

// Leave this filters line
const filters = {}

/*
  ====================================================================
  date
  --------------------------------------------------------------------
  Utility function to parse the date format
  ====================================================================

  Usage:

  {{ "1970-01-01" | date("DD/MM/YYYY") }}

  = 01/01/1970

*/

filters.date = (timestamp, format) => {
  return moment(timestamp).format(format)
}

/*
  ====================================================================
  dateDiff
  --------------------------------------------------------------------
  Utility function to the get difference between dates
  ====================================================================

  Usage:

  {{ "1970-01-01" | date("DD/MM/YYYY") }}

  = 01/01/1970

*/

filters.dateDiff = (start, end, unit = 'days') => {
  const a = moment(start)
  const b = moment(end)
  return b.diff(a, unit)
}

/*
  ====================================================================
  arrayToDateObject
  --------------------------------------------------------------------
  Convert array to javascript date object
  ====================================================================

  Usage:

  {{ [1,2,2020] | arrayToDateObject }}

  = 2020-02-01T00:00:00.000Z

*/

filters.arrayToDateObject = (array) => {
  return new Date(array[2], array[1] - 1, array[0])
}

/*
  ====================================================================
  today
  --------------------------------------------------------------------
  Today's date as javascript date object
  ====================================================================

  Usage:

  {{ "" | today }}

  = 2020-02-01T00:00:00.000Z

*/

filters.today = () => {
  return new Date()
}

/*
  ====================================================================
  todayGovuk
  --------------------------------------------------------------------
  Today's date GOV.UK formatted
  ====================================================================

  Usage:

  {{ "" | todayGovuk }}

  = 19 March 2020

*/

filters.todayGovuk = () => {
  return moment().format('D MMMM YYYY')
}

/*
  ====================================================================
  dateToGovukDate
  --------------------------------------------------------------------
  Convert date object to govuk date (1 February 2020)
  ====================================================================

  Usage:

  {{ date | dateToGovukDate }}

  = 1 February 2020

*/

filters.dateToGovukDate = (date) => {
  const theDate = moment(date)
  if (theDate.isValid()) {
    return theDate.format('D MMMM YYYY')
  } else {
    return ''
  }
}

/*
  ====================================================================
  arrayToGovukDate
  --------------------------------------------------------------------
  Convert array to govuk date
  ====================================================================

  Usage:

  {{ [1, 2, 2020] | arrayToGovukDate }}

  = 1 February 2020

*/

filters.arrayToGovukDate = (array) => {
  const dateObject = filters.arrayToDateObject(array)
  const govukDate = filters.dateToGovukDate(dateObject)
  return govukDate
}

/*
  ====================================================================
  prettyMonth
  --------------------------------------------------------------------
  Return month names from numbers.
  ====================================================================

  Usage:

  {{ 1 | prettyMonth }}

  = January

*/

filters.prettyMonth = (monthNumber) => {
  if (monthNumber) {
    return moment().month(monthNumber - 1).format('MMMM')
  } else {
    return ''
  }
}

/*
  ====================================================================
  sortDateArrays
  --------------------------------------------------------------------
  Add support for sorting by date arrays
  ====================================================================
  Copied from https://github.com/mozilla/nunjucks/blob/master/nunjucks/src/filters.js#L425

  Requires positional args, no named args
*/

filters.sortDateArrays = (arr, reversed, attr) => {
  const array = _.map(arr, v => v)
  array.sort((a, b) => {
    let x = (attr) ? a[attr] : a
    let y = (attr) ? b[attr] : b
    // Convert arrays of 3 to date objects
    x = (_.isArray(x) && (x.length === 3)) ? filters.arrayToDateObject(x) : x
    y = (_.isArray(y) && (y.length === 3)) ? filters.arrayToDateObject(y) : y
    if (x < y) {
      return reversed ? 1 : -1
    } else if (x > y) {
      return reversed ? -1 : 1
    } else {
      return 0
    }
  })
  return array
}

/*
  ====================================================================
  formateDate
  --------------------------------------------------------------------
  https://momentjs.com/docs/#/displaying/format/
  ====================================================================

  Usage:

  [Usage here]

*/

filters.formatDate = (date, format, dateFormat) => {
  let returnDate
  // No date provided.
  if (!date) {
    return 'Error in formatDate: no date provided'
  } else if (dateFormat && moment(date, dateFormat).isValid()) { // Check for valid date
    returnDate = moment(date, dateFormat)
  } else if (moment(date).isValid()) {
    returnDate = moment(date)
  } else { // Invalid date
    return 'Error in formatDate: invalid date'
  }

  switch (true) {
    // 2018-03-21
    case (format === 'dashDate'):
      return returnDate.format('YYYY-MM-DD')

    // 2018/03/21
    case (format === 'slashDate'):
      return returnDate.format('YYYY/MM/DD')

    // 2018/03
    case (format === 'yearMonth'):
      return returnDate.format('YYYY/MM')

    // 2018-03-21T00:00:00.000Z
    case (format === 'iso8601'):
      return returnDate.toISOString()

    // a year ago
    case (format === 'relative'):
      return returnDate.fromNow()

    // 21st March 2018
    case (format === 'pretty'):
      return returnDate.format('Do MMMM YYYY')

    // 21st March 2018, 12:00:00 am
    case (format === 'full'):
      return returnDate.format('Do MMMM YYYY, h:mm:ss a')

    // pass format through to moment
    case _.isString(format):
      return returnDate.format(format)

    // Default
    default:
      return returnDate.format()
  }
}

/*
  ====================================================================
  dateAdd
  --------------------------------------------------------------------
  Short description for the filter
  ====================================================================

  Usage:

  {{ '1970-01-01' | dateAdd(1, 'weeks') | date("DD/MM/YYYY") }}

  = 08/01/1970

*/

filters.dateAdd = (date, num, unit = 'days') => {
  return moment(date).add(num, unit).toDate()
}

/*
  ====================================================================
  govDate
  --------------------------------------------------------------------
  Short description for the filter
  ====================================================================

  Usage:

*/

filters.govDate = (timestamp) => {
  return moment(timestamp).format('D MMMM YYYY')
}

/*
  ====================================================================
  govShortDate
  --------------------------------------------------------------------
  Short description for the filter
  ====================================================================

  Usage:

*/

filters.govShortDate = (timestamp) => {
  return moment(timestamp).format('D MMM YYYY')
}

/*
  ====================================================================
  govTime
  --------------------------------------------------------------------
  Short description for the filter
  ====================================================================

  Usage:

*/

filters.govTime = (timestamp) => {
  const t = moment(timestamp)
  if (t.minutes() > 0) {
    return t.format('h:mma')
  } else {
    return t.format('ha')
  }
}

// -------------------------------------------------------------------
// keep the following line to return your filters to the app
// -------------------------------------------------------------------
exports.filters = filters
