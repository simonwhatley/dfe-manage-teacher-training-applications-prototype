const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render(`./${req.feature}/index`, {
    actions: {
      save: `/${req.feature}/auth`,
      create: `/${req.feature}/register`,
      terms: `/${req.feature}/terms`,
      forgotten: `/${req.feature}/forgotten-password`
    }
  })
})

router.post('/auth', (req, res) => {
  const errors = []

  req.session.data.routes = {
    signout: `/${req.feature}/sign-out`,
    account: `/${req.feature}/account`
  }
  req.session.data.isAuthenticated = true
  res.redirect(`/${req.feature}/done`)
})

router.get('/register', (req, res) => {
  res.render(`./${req.feature}/register`, {
    actions: {
      save: `/${req.feature}/register`,
      back: `/${req.feature}/`,
      signin: `/${req.feature}/`,
      terms: `/${req.feature}/terms`
    }
  })
})

router.post('/register', (req, res) => {
  const errors = []
  
  req.flash('success', {
    title: 'Verification email sent',
    description: 'A verification email has been sent to ' + req.session.data.email
  })

  res.redirect(`/${req.feature}/confirm-email`)
})

router.get('/confirm-email', (req, res) => {
  res.render(`./${req.feature}/confirm-email`, {
    actions: {
      save: `/${req.feature}/confirm-email`,
      back: `/${req.feature}/register`,
      resend: `/${req.feature}/resend-code`
    }
  })
})

router.post('/confirm-email', (req, res) => {
  const errors = []

  if (!req.session.data.code.length) {
    const error = {}
    error.fieldName = 'code'
    error.href = '#code'
    error.text = 'Enter your verification code'
    errors.push(error)
  }

  if (errors.length) {
    res.render(`./${req.feature}/confirm-email`, {
      actions: {
        save: `/${req.feature}/confirm-email`,
        back: `/${req.feature}/register`,
        resend: `/${req.feature}/resend-code`
      },
      errors
    })
  } else {
    res.redirect(`/${req.feature}/done`)
  }
})

router.get('/resend-code', (req, res) => {
  res.render(`./${req.feature}/resend-code`, {
    actions: {
      save: `/${req.feature}/resend-code`,
      back: `/${req.feature}/confirm-email`
    }
  })
})

router.post('/resend-code', (req, res) => {
  const errors = []

  res.redirect(`/${req.feature}/confirm-email`)
})

router.get('/forgotten-password', (req, res) => {
  res.render(`./${req.feature}/forgotten-password`, {
    actions: {
      save: `/${req.feature}/forgotten-password`,
      back: `/${req.feature}/`
    }
  })
})

router.post('/forgotten-password', (req, res) => {
  const errors = []

  req.flash('success', {
    title: 'Verification email sent',
    description: 'A verification email has been sent to ' + req.session.data.email
  })

  res.redirect(`/${req.feature}/verification-code`)
})

router.get('/verification-code', (req, res) => {
  res.render(`./${req.feature}/verification-code`, {
    actions: {
      save: `/${req.feature}/verification-code`,
      back: `/${req.feature}/`
    }
  })
})

router.post('/verification-code', (req, res) => {
  const errors = []

  if (!req.session.data.code.length) {
    const error = {}
    error.fieldName = 'code'
    error.href = '#code'
    error.text = 'Enter your verification code'
    errors.push(error)
  }

  if (errors.length) {
    res.render(`./${req.feature}/verification-code`, {
      actions: {
        save: `/${req.feature}/verification-code`,
        back: `/${req.feature}/`
      },
      errors
    })
  } else {
    res.redirect(`/${req.feature}/create-password`)
  }
})

router.get('/create-password', (req, res) => {
  res.render(`./${req.feature}/create-password`, {
    actions: {
      save: `/${req.feature}/create-password`,
      back: `/${req.feature}/`
    }
  })
})

router.post('/create-password', (req, res) => {
  const errors = []

  res.redirect(`/${req.feature}/password-reset`)
})

router.get('/password-reset', (req, res) => {
  res.render(`./${req.feature}/password-reset`, {
    actions: {
      next: `/${req.feature}/`
    }
  })
})

router.get('/terms', (req, res) => {
  res.render(`./${req.feature}/terms`, {
    actions: {
      back: req.headers.referer
    }
  })
})

router.get('/done', (req, res) => {
  res.render(`./${req.feature}/done`, {
    
  })
})

router.get('/sign-out', (req, res) => {
  delete req.session.data.isAuthenticated
  delete req.session.data.routes
  req.flash('success','You have successfully signed out')
  res.redirect(`/${req.feature}/start`)
})

module.exports = router