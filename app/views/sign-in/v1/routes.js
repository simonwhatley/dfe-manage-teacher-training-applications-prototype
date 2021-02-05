const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render(`/${req.feature}/index`, {
    actions: {
      save: `/auth`,
      create: `/register`,
      terms: `/terms`,
      forgotten: `/forgotten-password`
    }
  })
})

router.post('/auth', (req, res) => {
  const errors = []

  req.session.data.routes = {
    signout: `/register4/${req.params.organisationId}/sign-out`,
    account: `/register4/${req.params.organisationId}/account`
  }
  req.session.data.isAuthenticated = true
  res.redirect(`/register4/${req.params.organisationId}/agreement`)
})

router.get('/register4/:organisationId/register', (req, res) => {
  res.render('register/v4/sign-in/register', {
    actions: {
      save: `/register4/${req.params.organisationId}/register`,
      back: `/register4/${req.params.organisationId}/sign-in`,
      signin: `/register4/${req.params.organisationId}/sign-in`,
      terms: `/register4/${req.params.organisationId}/terms`
    }
  })
})

router.post('/register4/:organisationId/register', (req, res) => {
  const errors = []

  req.flash('success', {
    title: 'Verification email sent',
    description: 'A verification email has been sent to ' + req.session.data.email
  })

  res.redirect(`/register4/${req.params.organisationId}/confirm-email`)
})

router.get('/register4/:organisationId/confirm-email', (req, res) => {
  res.render('register/v4/sign-in/confirm-email', {
    actions: {
      save: `/register4/${req.params.organisationId}/confirm-email`,
      back: `/register4/${req.params.organisationId}/register`,
      resend: `/register4/${req.params.organisationId}/resend-code`
    }
  })
})

router.post('/register4/:organisationId/confirm-email', (req, res) => {
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
        save: `/register4/${req.params.organisationId}/confirm-email`,
        back: `/register4/${req.params.organisationId}/register`,
        resend: `/register4/${req.params.organisationId}/resend-code`
      },
      errors
    })
  } else {
    res.redirect(`/register4/${req.params.organisationId}/sign-in`)
  }
})

router.get('/register4/:organisationId/resend-code', (req, res) => {
  res.render('register/v4/sign-in/resend-code', {
    actions: {
      save: `/register4/${req.params.organisationId}/resend-code`,
      back: `/register4/${req.params.organisationId}/confirm-email`
    }
  })
})

router.post('/register4/:organisationId/resend-code', (req, res) => {
  const errors = []

  res.redirect(`/register4/${req.params.organisationId}/confirm-email`)
})

router.get('/register4/:organisationId/forgotten-password', (req, res) => {
  res.render('register/v4/sign-in/forgotten-password', {
    actions: {
      save: `/register4/${req.params.organisationId}/forgotten-password`,
      back: `/register4/${req.params.organisationId}/sign-in`
    }
  })
})

router.post('/register4/:organisationId/forgotten-password', (req, res) => {
  const errors = []

  req.flash('success', {
    title: 'Verification email sent',
    description: 'A verification email has been sent to ' + req.session.data.email
  })

  res.redirect(`/register4/${req.params.organisationId}/verification-code`)
})

router.get('/register4/:organisationId/verification-code', (req, res) => {
  res.render('register/v4/sign-in/verification-code', {
    actions: {
      save: `/register4/${req.params.organisationId}/verification-code`,
      back: `/register4/${req.params.organisationId}/sign-in`
    }
  })
})

router.post('/register4/:organisationId/verification-code', (req, res) => {
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
        save: `/register4/${req.params.organisationId}/verification-code`,
        back: `/register4/${req.params.organisationId}/sign-in`
      },
      errors
    })
  } else {
    res.redirect(`/register4/${req.params.organisationId}/create-password`)
  }
})

router.get('/register4/:organisationId/create-password', (req, res) => {
  res.render('register/v4/sign-in/create-password', {
    actions: {
      save: `/register4/${req.params.organisationId}/create-password`,
      back: `/register4/${req.params.organisationId}/sign-in`
    }
  })
})

router.post('/register4/:organisationId/create-password', (req, res) => {
  const errors = []

  res.redirect(`/register4/${req.params.organisationId}/password-reset`)
})

router.get('/register4/:organisationId/password-reset', (req, res) => {
  res.render('register/v4/sign-in/password-reset', {
    actions: {
      next: `/register4/${req.params.organisationId}/sign-in`
    }
  })
})

router.get('/register4/:organisationId/terms', (req, res) => {
  res.render('register/v4/sign-in/terms', {
    actions: {
      back: req.headers.referer
    }
  })
})

router.get('/register4/:organisationId/sign-out', (req, res) => {
  delete req.session.data.isAuthenticated
  delete req.session.data.routes
  req.flash('success','You have successfully signed out')
  res.redirect(`/register4/${req.params.organisationId}/start`)
})

module.exports = router