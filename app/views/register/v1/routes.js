const express = require('express')
const router = express.Router()

const organisations = require('./data/organisations.json').filter(org => !org.isRegistered && org.isAccreditedBody)
const providers = require('./data/organisations.json').filter(org => !org.isAccreditedBody)

function checkHasAnswers (req, res, next) {
  // console.log(req.session.data.registration)
  if (req.session.data.registration === undefined) {
    res.redirect('/')
  } else {
    next()
  }
}

function getTrainingProvidersIds (data) {
  const array = []
  for (let i = 0; i < data.length; i++) {
    array.push(data[i].id)
  }
  return array
}


router.get('/', (req, res) => {
  // delete any previous onboarding data
  delete req.session.data.registration
  
  res.render('register/v1/index', {
    actions: {
      start: `/${req.feature}/${req.version}/organisations`
    },
    organisations
  })
})


router.get('/organisations/:organisationId/start', (req, res) => {
  // set up the structure into which we'll put the onboarding data
  if (req.session.data.registration === undefined || req.session.data.registration.accreditingBody.id !== req.params.organisationId) {
    req.session.data.registration = {}

    // get the accrediting body (HEI) information
    const accreditingBody = organisations.filter(org => org.id == req.params.organisationId)[0]

    // put the accrediting body into the session for convenience
    req.session.data.registration.accreditingBody = accreditingBody

    // get the training providers for the accrediting body
    const trainingProviders = providers
                                .filter(org => org.accreditingBodies.includes(req.params.organisationId))
                                .sort((a, b) => a.name.localeCompare(b.name))

    // put the training prviders into the session for convenience
    req.session.data.registration.trainingProviders = trainingProviders

    // put the training provider ids into an array so we can use them to work out back routing
    req.session.data.registration.trainingProvidersIds = getTrainingProvidersIds(trainingProviders)
  }

  // set the first training provider id
  const trainingProviderId = req.session.data.registration.trainingProvidersIds[0]

  res.render('register/v1/start', {
    actions: {
      next: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/providers/${trainingProviderId}`
    },
    accreditingBody: req.session.data.registration.accreditingBody,
    trainingProviders: req.session.data.registration.trainingProviders
  })
})


router.get('/organisations/:organisationId/providers/:providerId', checkHasAnswers, (req, res) => {
  const trainingProvider = req.session.data.registration.trainingProviders.filter(org => org.id === req.params.providerId)[0]

  // get the position of the current provider id
  const position = req.session.data.registration.trainingProvidersIds.indexOf(req.params.providerId)

  // set the save route for new or change flow
  let save = `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/providers/${req.params.providerId}`
  if (req.headers.referer.includes('check-your-answers')) {
    save = save + '?referer=check-your-answers'
  }

  // set the back button default to the start page
  let back = `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/start`

  // set the back button to the check your answers page if that's where the user came from
  if (req.query.referer == 'check-your-answers') {
    back = `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/check-your-answers`
  } else {
    // if we're no on the first provider, we need to change the back button
    if (position > 0) {
      // get the previous provider id from the array
      const previousProviderId = req.session.data.registration.trainingProvidersIds[position - 1]
      // set the back link
      back = `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/providers/${previousProviderId}`
    }
  }

  res.render('register/v1/provider', {
    actions: {
      save: save,
      back: back
    },
    accreditingBody: req.session.data.registration.accreditingBody,
    trainingProvider
  })
})

router.post('/organisations/:organisationId/providers/:providerId', checkHasAnswers, (req, res) => {
  // get the position of the current provider id
  const position = req.session.data.registration.trainingProvidersIds.indexOf(req.params.providerId)

  // delete unnecessary fields from the data
  if (req.session.data.registration.onboarding.onboard == 'no') {
    delete req.session.data.registration.onboarding.contactName
    delete req.session.data.registration.onboarding.contactEmail
  }

  // combine the provider form details with the associated training provider object
  req.session.data.registration.trainingProviders[position] = {...req.session.data.registration.trainingProviders[position], ...req.session.data.registration.onboarding}

  // clear out the onboarding form data since we no longer need it, ready for the next provider
  delete req.session.data.registration.onboarding

  if (req.query.referer == 'check-your-answers') {
    // redirect to the data sharing agreement
    res.redirect(`/${req.feature}/${req.version}/organisations/${req.params.organisationId}/check-your-answers`)
  } else {
    // if we've reached the last provider, move to the next step, else next continue with the providers
    if (position == (req.session.data.registration.trainingProviders.length - 1)) {
      // set the last provider id for use in the back link
      req.session.data.registration.lastTrainingProviderId = req.params.providerId

      // redirect to the data sharing agreement
      res.redirect(`/${req.feature}/${req.version}/organisations/${req.params.organisationId}/agreement`)

    } else {
      // set the next training provider id
      const nextTrainingProviderId = req.session.data.registration.trainingProvidersIds[position + 1]

      res.redirect(`/${req.feature}/${req.version}/organisations/${req.params.organisationId}/providers/${nextTrainingProviderId}`)
    }
  }
})

router.get('/organisations/:organisationId/agreement', checkHasAnswers, (req, res) => {
  const lastTrainingProviderId = req.session.data.registration.lastTrainingProviderId

  res.render('register/v1/agreement', {
    actions: {
      save: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/agreement`,
      back: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/providers/${lastTrainingProviderId}`
    },
    accreditingBody: req.session.data.registration.accreditingBody
  })
})

router.post('/organisations/:organisationId/agreement', checkHasAnswers, (req, res) => {
  const errors = []

  if (req.session.data.registration.acceptAgreement === undefined) {
    const error = {}
    error.fieldName = 'acceptAgreement'
    error.href = '#acceptAgreement'
    error.text = 'You must agree to these terms to use this service'
    errors.push(error)
  }

  if (errors.length) {
    const lastTrainingProviderId = req.session.data.registration.lastTrainingProviderId

    res.render('register/v1/agreement', {
      actions: {
        save: `/${req.feature}/${req.version}organisations/${req.params.organisationId}/agreement`,
        back: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/providers/${lastTrainingProviderId}`
      },
      accreditingBody: req.session.data.registration.accreditingBody,
      errors: errors
    })
  } else {
    res.redirect(`/${req.feature}/${req.version}/organisations/${req.params.organisationId}/check-your-answers`)
  }
})

router.get('/organisations/:organisationId/check-your-answers', checkHasAnswers, (req, res) => {
  res.render('register/v1/check-your-answers', {
    actions: {
      next: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/done`,
      back: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/agreement`
    },
    registration: req.session.data.registration
  })
})

router.get('/organisations/:organisationId/done', checkHasAnswers, (req, res) => {
  // set invitation count for use in pluralising content
  const trainingProviderInviteCount = req.session.data.registration.trainingProviders.filter(org => org.onboard == 'yes').length

  res.render('register/v1/done', {
    trainingProviderInviteCount
  })
})

module.exports = router
