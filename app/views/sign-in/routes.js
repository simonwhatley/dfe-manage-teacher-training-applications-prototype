const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('sign-in/index', {
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
  
  if (!req.session.data.email.length) {
    const error = {}
    error.fieldName = 'email'
    error.href = '#email'
    error.text = 'Enter an email address'
    errors.push(error)
  }
  
  if (!req.session.data.password.length) {
    const error = {}
    error.fieldName = 'password'
    error.href = '#password'
    error.text = 'Enter a password'
    errors.push(error)
  }
  
  if (errors.length) {
    res.render('sign-in/index', {
      actions: {
        save: `/${req.feature}/auth`,
        create: `/${req.feature}/register`,
        terms: `/${req.feature}/terms`,
        forgotten: `/${req.feature}/forgotten-password`
      },
      errors
    })
  } else {
    req.session.data.routes = {
      signout: `/${req.feature}/sign-out`,
      account: `/${req.feature}/account`
    }
    req.session.data.isAuthenticated = true
    res.redirect(`/${req.feature}/done`)
  }

})

router.get('/register', (req, res) => {
  res.render('sign-in/register', {
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
  
  if (!req.session.data.firstname.length) {
    const error = {}
    error.fieldName = 'firstname'
    error.href = '#firstname'
    error.text = 'Enter a first name'
    errors.push(error)
  }
  
  if (!req.session.data.lastname.length) {
    const error = {}
    error.fieldName = 'lastname'
    error.href = '#lastname'
    error.text = 'Enter a last name'
    errors.push(error)
  }
  
  if (!req.session.data.email.length) {
    const error = {}
    error.fieldName = 'email'
    error.href = '#email'
    error.text = 'Enter an email address'
    errors.push(error)
  }
  
  if (errors.length) {
    res.render('sign-in/register', {
      actions: {
        save: `/${req.feature}/register`,
        back: `/${req.feature}/`,
        signin: `/${req.feature}/`,
        terms: `/${req.feature}/terms`
      },
      errors
    })
  } else {
    req.flash('success', {
      title: 'Verification email sent',
      description: 'A verification email has been sent to ' + req.session.data.email
    })

    res.redirect(`/${req.feature}/confirm-email`)
  }
})

router.get('/confirm-email', (req, res) => {
  res.render('sign-in/confirm-email', {
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
    error.text = 'Enter a verification code'
    errors.push(error)
  }

  if (errors.length) {
    res.render('sign-in/confirm-email', {
      actions: {
        save: `/${req.feature}/confirm-email`,
        back: `/${req.feature}/register`,
        resend: `/${req.feature}/resend-code`
      },
      errors
    })
  } else {
    res.redirect(`/${req.feature}/registration-complete`)
  }
})

router.get('/resend-code', (req, res) => {
  res.render('sign-in/resend-code', {
    actions: {
      save: `/${req.feature}/resend-code`,
      back: `/${req.feature}/confirm-email`
    }
  })
})

router.post('/resend-code', (req, res) => {
  const errors = []

  if (!req.session.data.email.length) {
    const error = {}
    error.fieldName = 'email'
    error.href = '#email'
    error.text = 'Enter an email address'
    errors.push(error)
  }

  if (errors.length) {
    res.render('sign-in/resend-code', {
      actions: {
        save: `/${req.feature}/resend-code`,
        back: `/${req.feature}/confirm-email`
      },
      errors
    })
  } else {
    res.redirect(`/${req.feature}/confirm-email`)
  }
})

router.get('/forgotten-password', (req, res) => {
  res.render('sign-in/forgotten-password', {
    actions: {
      save: `/${req.feature}/forgotten-password`,
      back: `/${req.feature}/`
    }
  })
})

router.post('/forgotten-password', (req, res) => {
  const errors = []

  if (!req.session.data.email.length) {
    const error = {}
    error.fieldName = 'email'
    error.href = '#email'
    error.text = 'Enter an email address'
    errors.push(error)
  }
  
  if (errors.length) {
    res.render('sign-in/forgotten-password', {
      actions: {
        save: `/${req.feature}/forgotten-password`,
        back: `/${req.feature}/`
      },
      errors
    })
  } else {
    req.flash('success', {
      title: 'Verification email sent',
      description: 'A verification email has been sent to ' + req.session.data.email
    })

    res.redirect(`/${req.feature}/verification-code`)
  }  
})

router.get('/verification-code', (req, res) => {
  res.render('sign-in/verification-code', {
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
    res.render('sign-in/verification-code', {
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
  res.render('sign-in/create-password', {
    actions: {
      save: `/${req.feature}/create-password`,
      back: `/${req.feature}/`
    }
  })
})

router.post('/create-password', (req, res) => {
  const errors = []

  if (!req.session.data.password.length) {
    const error = {}
    error.fieldName = 'password'
    error.href = '#password'
    error.text = 'Enter a new password'
    errors.push(error)
  } else if (req.session.data.password.length < 12) {
    const error = {}
    error.fieldName = 'password'
    error.href = '#password'
    error.text = 'Enter a password at least 12 characters long'
    errors.push(error)
  }

  if (!req.session.data.confirmPassword.length) {
    const error = {}
    error.fieldName = 'confirmPassword'
    error.href = '#confirmPassword'
    error.text = 'Enter a password confirmation'
    errors.push(error)
  } else if (!(req.session.data.confirmPassword == req.session.data.password)) {
    const error = {}
    error.fieldName = 'confirmPassword'
    error.href = '#confirmPassword'
    error.text = 'Password confirmation does not match the password'
    errors.push(error)
  }
  
  if (errors.length) {
    res.render('sign-in/create-password', {
      actions: {
        save: `/${req.feature}/create-password`,
        back: `/${req.feature}/`
      },
      errors
    })
  } else {
    res.redirect(`/${req.feature}/password-reset`)
  }
})

router.get('/password-reset', (req, res) => {
  delete req.session.data
  res.render('sign-in/password-reset', {
    actions: {
      next: `/${req.feature}/`
    }
  })
})

router.get('/terms', (req, res) => {
  res.render('sign-in/terms', {
    actions: {
      back: req.headers.referer
    }
  })
})

router.get('/done', (req, res) => {
  res.render('sign-in/done', {
    actions: {
      next: `/${req.feature}/sign-out`
    }
  })
})

router.get('/registration-complete', (req, res) => {
  res.render('sign-in/registration-complete', {
    actions: {
      next: `/${req.feature}/`
    }
  })
})

router.get('/sign-out', (req, res) => {
  delete req.session.data
  req.flash('success','You have successfully signed out')
  res.redirect(`/${req.feature}/`)
})

module.exports = router