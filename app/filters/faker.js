// -------------------------------------------------------------------
// Imports and setup
// -------------------------------------------------------------------
const faker = require('faker')

// Leave this filters line
const filters = {}

/*
  ====================================================================
  fakePerson
  --------------------------------------------------------------------
  Short description for the filter
  ====================================================================

  Usage:

  [Usage here]

*/

filters.fakePerson = (string) => {
  // faker.seed(123)
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  const fullName = firstName + ' ' + lastName
  const email = fullName.split(' ').join('.').toLowerCase() + '@example.com'
  const user = {
    firstName: firstName,
    lastName: lastName,
    fullName: fullName,
    email: email
  }
  return user
}

/*
  ====================================================================
  fakeAddress
  --------------------------------------------------------------------
  Short description for the filter
  ====================================================================

  Usage:

  [Usage here]

*/

filters.fakeAddress = (string) => {
  const address = faker.address
  return address
}

// -------------------------------------------------------------------
// keep the following line to return your filters to the app
// -------------------------------------------------------------------
exports.filters = filters
