const express = require('express')
const router = express.Router()

const organisations = require('./data/registrations.json')
                        .filter(org => !org.isRegistered && org.isAccreditedBody)
                        .sort((a, b) => a.name.localeCompare(b.name))
const providers = require('./data/registrations.json').filter(org => !org.isAccreditedBody)

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
  delete req.session.data.isAuthenticated

  res.render('register/v4/index', {
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

    // put the training providers into the session for convenience
    req.session.data.registration.trainingProviders = trainingProviders

    // get the training providers already onboarded
    const trainingProvidersOnboarded = trainingProviders.filter(org => org.isRegistered === true)

    // put the training providers into the session for convenience
    req.session.data.registration.trainingProvidersOnboarded = trainingProvidersOnboarded

    // get the training providers not already onboarded
    const trainingProvidersNotOnboarded = trainingProviders.filter(org => org.isRegistered === false)

    // put the training providers into the session for convenience
    req.session.data.registration.trainingProvidersNotOnboarded = trainingProvidersNotOnboarded

    // put the training provider ids into an array so we can use them to work out back routing
    req.session.data.registration.trainingProvidersIds = getTrainingProvidersIds(trainingProvidersNotOnboarded)
  }

  // if signed in, next is the agreement, else sign-in
  let next = `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/sign-in`
  if (req.session.data.isAuthenticated === true) {
    next = `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/agreement`
  }

  res.render('register/v4/start', {
    actions: {
      next: next
    },
    accreditingBody: req.session.data.registration.accreditingBody,
    trainingProvidersOnboarded: req.session.data.registration.trainingProvidersOnboarded,
    trainingProvidersNotOnboarded: req.session.data.registration.trainingProvidersNotOnboarded
  })
})

router.get('/organisations/:organisationId/agreement', checkHasAnswers, (req, res) => {
  const lastTrainingProviderId = req.session.data.registration.lastTrainingProviderId

  res.render('register/v4/agreement', {
    actions: {
      save: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/agreement`,
      back: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/start`
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
    res.render('register/v4/agreement', {
      actions: {
        save: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/agreement`,
        back: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/start`
      },
      accreditingBody: req.session.data.registration.accreditingBody,
      errors: errors
    })
  } else {
    res.redirect(`/${req.feature}/${req.version}/organisations/${req.params.organisationId}/next`)
  }
})

router.get('/organisations/:organisationId/next', checkHasAnswers, (req, res) => {
  // set the first training provider id
  const firstTrainingProviderId = req.session.data.registration.trainingProvidersIds[0]

  res.render('register/v4/next', {
    actions: {
      next: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/providers/${firstTrainingProviderId}`,
      back: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/agreement`
    },
    accreditingBody: req.session.data.registration.accreditingBody,
    trainingProvidersOnboarded: req.session.data.registration.trainingProvidersOnboarded,
    trainingProvidersNotOnboarded: req.session.data.registration.trainingProvidersNotOnboarded
  })
})

router.get('/organisations/:organisationId/providers/:providerId', checkHasAnswers, (req, res) => {
  const trainingProvider = req.session.data.registration.trainingProvidersNotOnboarded.filter(org => org.id === req.params.providerId)[0]

  // get the position of the current provider id
  const position = req.session.data.registration.trainingProvidersIds.indexOf(req.params.providerId)

  // set the save route for new or change flow
  let save = `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/providers/${req.params.providerId}`
  if (req.headers.referer.includes('check-your-answers')) {
    save = save + '?referer=check-your-answers'
  }

  // set the back button default to the start page
  let back = `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/next`

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

  res.render('register/v4/provider', {
    actions: {
      save: save,
      back: back
    },
    accreditingBody: req.session.data.registration.accreditingBody,
    trainingProvider
  })
})

router.post('/organisations/:organisationId/providers/:providerId', checkHasAnswers, (req, res) => {
  const trainingProvider = req.session.data.registration.trainingProviders.filter(org => org.id === req.params.providerId)[0]

  // get the training provider user and populate the contact object
  if (req.session.data.registration.contact.choice !== undefined && req.session.data.registration.contact.choice != 'other') {
    const choice = req.session.data.registration.contact.choice
    const contact = trainingProvider.users[choice]
    contact.choice = choice
    req.session.data.registration.contact = contact
  }

  // get the position of the current provider id
  const position = req.session.data.registration.trainingProvidersIds.indexOf(req.params.providerId)

  // combine the provider form details with the associated training provider object
  req.session.data.registration.trainingProvidersNotOnboarded[position].contact = req.session.data.registration.contact

  // clear out the form data since we no longer need it, ready for the next provider
  delete req.session.data.registration.contact

  if (req.query.referer == 'check-your-answers') {
    // redirect to the data sharing agreement
    res.redirect(`/${req.feature}/${req.version}/organisations/${req.params.organisationId}/check-your-answers`)
  } else {
    // if we've reached the last provider, move to the next step, else next continue with the providers
    if (position == (req.session.data.registration.trainingProvidersNotOnboarded.length - 1)) {
      // set the last provider id for use in the back link
      req.session.data.registration.lastTrainingProviderId = req.params.providerId

      // redirect to the data sharing agreement
      res.redirect(`/${req.feature}/${req.version}/organisations/${req.params.organisationId}/check-your-answers`)

    } else {
      // set the next training provider id
      const nextTrainingProviderId = req.session.data.registration.trainingProvidersIds[position + 1]

      res.redirect(`/${req.feature}/${req.version}/organisations/${req.params.organisationId}/providers/${nextTrainingProviderId}`)
    }
  }
})

router.get('/organisations/:organisationId/check-your-answers', checkHasAnswers, (req, res) => {
  res.render('register/v4/check-your-answers', {
    actions: {
      next: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/done`,
      back: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/agreement`,
      change: `/${req.feature}/${req.version}/organisations`
    },
    accreditingBody: req.session.data.registration.accreditingBody,
    trainingProviders: req.session.data.registration.trainingProvidersNotOnboarded,
    acceptAgreement: req.session.data.registration.acceptAgreement
  })
})

router.get('/organisations/:organisationId/done', checkHasAnswers, (req, res) => {
  // set invitation count for use in pluralising content
  // const trainingProviderInviteCount = req.session.data.registration.trainingProviders.filter(org => org.onboard == 'yes').length

  res.render('register/v4/done', {
    // trainingProviderInviteCount
  })
})

// ===========================================================================
// Sign in / register
// ===========================================================================

router.get('/organisations/:organisationId/sign-in', (req, res) => {
  res.render('register/v4/sign-in/sign-in', {
    actions: {
      save: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/sign-in`,
      create: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/register`,
      terms: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/terms`,
      forgotten: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/forgotten-password`
    }
  })
})

router.post('/organisations/:organisationId/sign-in', (req, res) => {
  const errors = []

  req.session.data.routes = {
    signout: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/sign-out`,
    account: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/account`
  }
  req.session.data.isAuthenticated = true
  res.redirect(`/${req.feature}/${req.version}/organisations/${req.params.organisationId}/agreement`)
})

router.get('/organisations/:organisationId/register', (req, res) => {
  res.render('register/v4/sign-in/register', {
    actions: {
      save: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/register`,
      back: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/sign-in`,
      signin: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/sign-in`,
      terms: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/terms`
    }
  })
})

router.post('/organisations/:organisationId/register', (req, res) => {
  const errors = []

  req.flash('success', {
    title: 'Verification email sent',
    description: 'A verification email has been sent to ' + req.session.data.email
  })

  res.redirect(`/${req.feature}/${req.version}/organisations/${req.params.organisationId}/confirm-email`)
})

router.get('/organisations/:organisationId/confirm-email', (req, res) => {
  res.render('register/v4/sign-in/confirm-email', {
    actions: {
      save: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/confirm-email`,
      back: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/register`,
      resend: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/resend-code`
    }
  })
})

router.post('/organisations/:organisationId/confirm-email', (req, res) => {
  const errors = []

  if (!req.session.data.code.length) {
    const error = {}
    error.fieldName = 'code'
    error.href = '#code'
    error.text = 'Enter your verification code'
    errors.push(error)
  }

  if (errors.length) {
    res.render('register/v4/sign-in/confirm-email', {
      actions: {
        save: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/confirm-email`,
        back: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/register`,
        resend: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/resend-code`
      },
      errors
    })
  } else {
    res.redirect(`/${req.feature}/${req.version}/organisations/${req.params.organisationId}/sign-in`)
  }
})

router.get('/organisations/:organisationId/resend-code', (req, res) => {
  res.render('register/v4/sign-in/resend-code', {
    actions: {
      save: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/resend-code`,
      back: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/confirm-email`
    }
  })
})

router.post('/organisations/:organisationId/resend-code', (req, res) => {
  const errors = []

  res.redirect(`/${req.feature}/${req.version}/organisations/${req.params.organisationId}/confirm-email`)
})

router.get('/organisations/:organisationId/forgotten-password', (req, res) => {
  res.render('register/v4/sign-in/forgotten-password', {
    actions: {
      save: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/forgotten-password`,
      back: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/sign-in`
    }
  })
})

router.post('/organisations/:organisationId/forgotten-password', (req, res) => {
  const errors = []

  req.flash('success', {
    title: 'Verification email sent',
    description: 'A verification email has been sent to ' + req.session.data.email
  })

  res.redirect(`/${req.feature}/${req.version}/organisations/${req.params.organisationId}/verification-code`)
})

router.get('/organisations/:organisationId/verification-code', (req, res) => {
  res.render('register/v4/sign-in/verification-code', {
    actions: {
      save: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/verification-code`,
      back: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/sign-in`
    }
  })
})

router.post('/organisations/:organisationId/verification-code', (req, res) => {
  const errors = []

  if (!req.session.data.code.length) {
    const error = {}
    error.fieldName = 'code'
    error.href = '#code'
    error.text = 'Enter your verification code'
    errors.push(error)
  }

  if (errors.length) {
    res.render('register/v4/sign-in/verification-code', {
      actions: {
        save: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/verification-code`,
        back: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/sign-in`
      },
      errors
    })
  } else {
    res.redirect(`/${req.feature}/${req.version}/organisations/${req.params.organisationId}/create-password`)
  }
})

router.get('/organisations/:organisationId/create-password', (req, res) => {
  res.render('register/v4/sign-in/create-password', {
    actions: {
      save: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/create-password`,
      back: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/sign-in`
    }
  })
})

router.post('/organisations/:organisationId/create-password', (req, res) => {
  const errors = []

  res.redirect(`/${req.feature}/${req.version}/organisations/${req.params.organisationId}/password-reset`)
})

router.get('/organisations/:organisationId/password-reset', (req, res) => {
  res.render('register/v4/sign-in/password-reset', {
    actions: {
      next: `/${req.feature}/${req.version}/organisations/${req.params.organisationId}/sign-in`
    }
  })
})

router.get('/organisations/:organisationId/terms', (req, res) => {
  res.render('register/v4/sign-in/terms', {
    actions: {
      back: req.headers.referer
    }
  })
})

router.get('/organisations/:organisationId/sign-out', (req, res) => {
  delete req.session.data.isAuthenticated
  delete req.session.data.routes
  req.flash('success','You have successfully signed out')
  res.redirect(`/${req.feature}/${req.version}/organisations/${req.params.organisationId}/start`)
})

module.exports = router
