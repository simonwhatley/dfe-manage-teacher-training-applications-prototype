// -------------------------------------------------------------------
// Imports and setup
// -------------------------------------------------------------------
const _ = require('lodash')

// Leave this filters line
const filters = {}

/*
  ====================================================================
  objectArrayToArray
  --------------------------------------------------------------------
  Flatten object array to nested array, keeping just the values
  ====================================================================

  Input:

  array = [
    {
      firstName: "Foo",
      lastName: "Bar"
    },{
      firstName: "Zip",
      lastName: "Buz"
    }
  ]

  Output:

  [
    ["Foo", "Bar"],
    ["Zip", "Buz"]
  ]

*/

filters.objectArrayToArray = array => {
  const newArray = []
  array.forEach(item => {
    const newItem = []
    Object.keys(item).forEach(part => {
      newItem.push(item[part])
    })
    newArray.push(newItem)
  })
  return newArray
}

/*
  ====================================================================
  keepAttributes
  --------------------------------------------------------------------
  Keep only whitelisted keys from object or array of objects
  ====================================================================

  Usage:

  [Usage here]

*/

filters.keepAttributes = (array, keysToKeep) => {
  const keepKeys = theObject => {
    const newObj = {}
    // Re-orders and keeps only selected keys

    // Coerce string to array
    if (_.isString(keysToKeep)) {
      keysToKeep = [keysToKeep]
    }

    keysToKeep.forEach(key => {
      const objectKeys = Object.keys(theObject)
      if (objectKeys.includes(key)) {
        newObj[key] = theObject[key]
      }
    })
    return newObj
  }
  // Array of objects
  if (_.isArray(array)) {
    return array.map(keepKeys)
  } else { // Single object
    return keepKeys(array)
  }
}

/*
  ====================================================================
  setAttribute
  --------------------------------------------------------------------
  Set an attribute on an object
  ====================================================================

  Usage:

  [Usage here]

*/

filters.setAttribute = (dictionary, key, value) => {
  const newDictionary = Object.assign({}, dictionary)
  newDictionary[key] = value
  return newDictionary
}

/*
  ====================================================================
  clearAttribute
  --------------------------------------------------------------------
  Clear single attribute
  ====================================================================

  Usage:

  [Usage here]

*/

filters.clearAttribute = (dictionary, key) => {
  const newDictionary = Object.assign({}, dictionary)
  newDictionary[key] = ''
  return newDictionary
}

/*
  ====================================================================
  renameAttribute
  --------------------------------------------------------------------
  Rename a key on an object, preserving key order
  ====================================================================

  Usage:

  [Usage here]

*/

filters.renameAttribute = (dictionary, oldKey, newKey) => {
  const keys = Object.keys(dictionary)
  const newObj = keys.reduce((acc, val) => {
    if (val === oldKey) {
      acc[newKey] = dictionary[oldKey]
    } else {
      acc[val] = dictionary[val]
    }
    return acc
  }, {})
  return newObj
}

/*
  ====================================================================
  deleteAttribute
  --------------------------------------------------------------------
  Delete a single attribute
  ====================================================================

  Usage:

  [Usage here]

*/

filters.deleteAttribute = (dictionary, key) => {
  // Don't modify the original
  const newDictionary = Object.assign({}, dictionary)
  delete newDictionary[key]
  return newDictionary
}

/*
  ====================================================================
  deleteBlankAttributes
  --------------------------------------------------------------------
  Delete keys with blank values
  ====================================================================

  Usage:

  [Usage here]

*/

filters.deleteBlankAttributes = (dictionary) => {
  // Don't modify the original
  const newDictionary = Object.assign({}, dictionary)
  const keys = Object.keys(newDictionary)
  keys.forEach(key => {
    if (newDictionary[key] === '') {
      delete newDictionary[key]
    }
  })
  return newDictionary
}

/*
  ====================================================================
  filterAttr
  --------------------------------------------------------------------
  Filter results for only those containing attribute and value
  ====================================================================

  Usage:

  [Usage here]

*/

filters.filterAttr = function (arr, attr, test) {
  const result = arr.filter(function (item) {
    return item[attr] === test
  })
  return result
}

/*
  ====================================================================
  removeAttr
  --------------------------------------------------------------------
  Remove items with a specified attribute and value
  ====================================================================

  Usage:

  [Usage here]

*/

filters.removeAttr = function (arr, attr, test) {
  const result = arr.filter(function (item) {
    return item[attr] !== test
  })
  return result
}

// -------------------------------------------------------------------
// keep the following line to return your filters to the app
// -------------------------------------------------------------------
exports.filters = filters
