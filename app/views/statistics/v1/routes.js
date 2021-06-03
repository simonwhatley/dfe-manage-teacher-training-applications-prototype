const express = require('express')
const router = express.Router()

const ApplicationHelper = require('./helpers/application')
const SystemHelper = require('./helpers/system')

router.get('/status', (req, res) => {
  
  res.render('statistics/v1/status', {
    
  })
})

router.get('/subject', (req, res) => {
  
  res.render('statistics/v1/subject', {
    
  })
})

router.get('/training-provider', (req, res) => {
  
  res.render('statistics/v1/training-provider', {
    
  })
})

router.get('/training-location', (req, res) => {
  
  res.render('statistics/v1/training-location', {
    
  })
})

router.get('/reasons-for-rejection', (req, res) => {
  
  res.render('statistics/v1/reasons-for-rejection', {
    
  })
})


module.exports = router