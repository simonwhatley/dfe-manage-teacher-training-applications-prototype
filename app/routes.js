const express = require('express')
const router = express.Router()

router.use('/', (req, res, next) => {
  req.feature = req.originalUrl.split('/')[1]
  req.version = req.originalUrl.split('/')[2]
  next()
})

// Route index page
router.get('/', (req, res) => {
  res.render('index')
})

// Sign-in flow
router.use('/sign-in/', (req, res, next) => {
  require(`./views/sign-in/routes`)(req, res, next)
})

// Onboarding flow
router.use(/\/register\/v([0-9]+)/, (req, res, next) => {
  require(`./views/register/v${req.params[0]}/routes`)(req, res, next)
})



// Add your routes here - above the module.exports line

module.exports = router
