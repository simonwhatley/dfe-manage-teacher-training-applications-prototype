const express = require('express')
const router = express.Router()

const ApplicationHelper = require('./helpers/application')
const SystemHelper = require('./helpers/system')

const getConfigOptions = (req) => {
  if (req.session.data.statisticsOptions === undefined) {
    req.session.data.statisticsOptions = {}
  }

  let options = {}
  options.cycles = req.session.data.statisticsOptions.cycle
  options.statuses = req.session.data.statisticsOptions.status
  options.studyModes = req.session.data.statisticsOptions.studyMode
  options.fundingTypes = req.session.data.statisticsOptions.fundingType
  options.subjectLevels = req.session.data.statisticsOptions.subjectLevel
  options.providers = req.session.data.statisticsOptions.provider
  options.accreditedBodies = req.session.data.statisticsOptions.accreditedBody
  options.locations = req.session.data.statisticsOptions.location

  const hasOptions = !!((options.cycles && options.cycles.length > 0) || (options.statuses && options.statuses.length > 0) || (options.providers && options.providers.length > 0) || (options.accreditedBodies && options.accreditedBodies.length > 0) || (options.studyModes && options.studyModes.length > 0) || (options.fundingTypes && options.fundingTypes.length > 0) || (options.subjectLevels && options.subjectLevels.length > 0) || (options.locations && options.locations.length > 0))

  let selectedOptions = null

  if (hasOptions) {

    let slug = `/statistics/v1${req.route.path}`
    
    selectedOptions = {
      categories: []
    }

    if (options.cycles && options.cycles.length) {
      selectedOptions.categories.push({
        heading: { text: 'Year received' },
        items: options.cycles.map((cycle) => {
          return {
            text: cycle,
            href: `${slug}/remove-cycle-option/${cycle}`
          }
        })
      })
    }

    if (options.statuses && options.statuses.length) {
      selectedOptions.categories.push({
        heading: { text: 'Status' },
        items: options.statuses.map((status) => {
          return {
            text: status,
            href: `${slug}/remove-status-option/${status}`
          }
        })
      })
    }

    if (options.providers && options.providers.length) {
      selectedOptions.categories.push({
        heading: { text: 'Training provider' },
        items: options.providers.map((provider) => {
          return {
            text: provider,
            href: `${slug}/remove-provider-option/${provider}`
          }
        })
      })
    }

    if (options.locations && options.locations.length) {
      selectedOptions.categories.push({
        heading: { text: 'Location' },
        items: options.locations.map((location) => {
          return {
            text: location,
            href: `${slug}/remove-location-option/${location}`
          }
        })
      })
    }

    if (options.accreditedBodies && options.accreditedBodies.length) {
      selectedOptions.categories.push({
        heading: { text: 'Accredited body' },
        items: options.accreditedBodies.map((accreditedbody) => {
          return {
            text: accreditedbody,
            href: `${slug}/remove-accreditedbody-option/${accreditedbody}`
          }
        })
      })
    }

    if (options.studyModes && options.studyModes.length) {
      selectedOptions.categories.push({
        heading: { text: 'Full time or part time' },
        items: options.studyModes.map((studyMode) => {
          return {
            text: studyMode,
            href: `${slug}/remove-studymode-option/${studyMode}`
          }
        })
      })
    }

    if (options.fundingTypes && options.fundingTypes.length) {
      selectedOptions.categories.push({
        heading: { text: 'Funding type' },
        items: options.fundingTypes.map((fundingType) => {
          return {
            text: fundingType,
            href: `${slug}/remove-fundingtype-option/${fundingType}`
          }
        })
      })
    }

    if (options.subjectLevels && options.subjectLevels.length) {
      selectedOptions.categories.push({
        heading: { text: 'Subject level' },
        items: options.subjectLevels.map((subjectLevel) => {
          return {
            text: subjectLevel,
            href: `${slug}/remove-subjectlevel-option/${subjectLevel}`
          }
        })
      })
    }
  }

  return { hasOptions, selectedOptions, options }
}

const getApplications = (applications, options) => {
  return applications = applications.filter((app) => {
    let cycleValid = true
    let statusValid = true
    let providerValid = true
    let accreditedBodyValid = true
    let studyModeValid = true
    let fundingTypeValid = true
    let subjectLevelValid = true
    let locationValid = true

    if (options.cycles && options.cycles.length) {
      cycleValid = options.cycles.includes(app.cycle)
    }

    if (options.statuses && options.statuses.length) {
      cycleValid = options.statuses.includes(app.status)
    }

    if (options.providers && options.providers.length) {
      providerValid = options.providers.includes(app.provider)
    }

    if (options.accreditedBodies && options.accreditedBodies.length) {
      accreditedBodyValid = options.accreditedBodies.includes(app.accreditedBody)
    }

    if (options.studyModes && options.studyModes.length) {
      studyModeValid = options.studyModes.includes(app.studyMode)
    }

    if (options.fundingTypes && options.fundingTypes.length) {
      fundingTypeValid = options.fundingTypes.includes(app.fundingType)
    }

    if (options.subjectLevels && options.subjectLevels.length) {
      subjectLevelValid = options.subjectLevels.includes(app.subjectLevel)
    }

    if (options.locations && options.locations.length) {
      locationValid = options.locations.includes(app.location)
    }

    return cycleValid && statusValid && providerValid && accreditedBodyValid && studyModeValid && fundingTypeValid && subjectLevelValid && locationValid
  })
}

const getRedirect = (referer) => {
  let redirect = '/statistics'
  if (referer.includes('/status')) {
    redirect = '/statistics/v1/status'
  } else if (referer.includes('/subject')) {
    redirect = '/statistics/v1/subject'
  } else if (referer.includes('/training-provider')) {
    redirect = '/statistics/v1/training-provider'
  } else if (referer.includes('/training-location')) {
    redirect = '/statistics/v1/training-location'
  } else if (referer.includes('/reasons-for-rejection')) {
    redirect = '/statistics/v1/reasons-for-rejection'
  }
  return redirect
}

router.get('/', (req, res) => {
  delete req.session.data.statisticsOptions
  
  res.render('statistics/v1/index', {
    
  })
})

router.get('/status', (req, res) => {
  if (!req.session.data.applications) {
    req.session.data.applications = SystemHelper.loadApplications
  }
  
  let applications = req.session.data.applications
  const options = getConfigOptions(req)

  if (options.hasOptions) {
    applications = getApplications(applications, options.options)
  }
  
  res.render('statistics/v1/status', {
    totalApplications: applications.length,
    statuses: SystemHelper.statuses,
    statusCounts: ApplicationHelper.getApplicationCountsByStatus(applications),
    hasOptions: options.hasOptions,
    selectedOptions: options.selectedOptions,
    showOptions: [
      'cycle',
      'trainingProvider',
      'accreditedBody',
      'studyMode',
      'fundingType',
      'subjectLevel'
    ]
  })
})

router.get('/subject', (req, res) => {
  if (!req.session.data.applications) {
    req.session.data.applications = SystemHelper.loadApplications
  }
  
  let applications = req.session.data.applications
  const options = getConfigOptions(req)

  if (options.hasOptions) {
    applications = getApplications(applications, options.options)
  }
  
  res.render('statistics/v1/subject', {
    totalApplications: applications.length,
    subjects: SystemHelper.subjects,
    subjectCounts: ApplicationHelper.getApplicationCountsBySubject(applications),
    hasOptions: options.hasOptions,
    selectedOptions: options.selectedOptions,
    showOptions: [
      'cycle',
      'status',
      'trainingProvider',
      'accreditedBody',
      'studyMode',
      'fundingType',
      'subjectLevel'
    ]
  })
})

router.get('/training-provider', (req, res) => {
  if (!req.session.data.applications) {
    req.session.data.applications = SystemHelper.loadApplications
  }
  
  let applications = req.session.data.applications
  const options = getConfigOptions(req)

  if (options.hasOptions) {
    applications = getApplications(applications, options.options)
  }
  
  res.render('statistics/v1/training-provider', {
    totalApplications: applications.length,
    organisations: SystemHelper.trainingProviders,
    organisationCounts: ApplicationHelper.getApplicationCountsByTrainingProvider(applications),
    hasOptions: options.hasOptions,
    selectedOptions: options.selectedOptions,
    showOptions: [
      'cycle',
      'status',
      'accreditedBody',
      'studyMode',
      'fundingType',
      'subjectLevel'
    ]
  })
})

router.get('/training-location', (req, res) => {
  if (!req.session.data.applications) {
    req.session.data.applications = SystemHelper.loadApplications
  }
  
  let applications = req.session.data.applications
  const options = getConfigOptions(req)

  if (options.hasOptions) {
    applications = getApplications(applications, options.options)
  }
  
  res.render('statistics/v1/training-location', {
    totalApplications: applications.length,
    locations: SystemHelper.trainingLocations,
    locationCounts: ApplicationHelper.getApplicationCountsByTrainingLocation(applications),
    hasOptions: options.hasOptions,
    selectedOptions: options.selectedOptions,
    showOptions: [
      'cycle',
      'status',
      'trainingProvider',
      'accreditedBody',
      'studyMode',
      'fundingType',
      'subjectLevel'
    ]
  })
})

router.get('/reasons-for-rejection', (req, res) => {
  if (!req.session.data.applications) {
    req.session.data.applications = SystemHelper.loadApplications
  }
  
  let applications = req.session.data.applications
  applications = applications.filter(application => application.status === 'Rejected')
  
  const options = getConfigOptions(req)

  if (options.hasOptions) {
    applications = getApplications(applications, options.options)
  }
  
  res.render('statistics/v1/reasons-for-rejection', {
    totalApplications: applications.length,
    reasons: SystemHelper.reasonsForRejection,
    reasonCounts: ApplicationHelper.getApplicationCountsByReasonsForRejection(applications),
    hasOptions: options.hasOptions,
    selectedOptions: options.selectedOptions,
    showOptions: [
      'cycle',
      'trainingProvider',
      'accreditedBody',
      'studyMode',
      'fundingType',
      'subjectLevel'
    ]
  })
})

router.get('/:report/remove-cycle-option/:cycle', (req, res) => {
  req.session.data.statisticsOptions.cycle = req.session.data.statisticsOptions.cycle.filter(item => item !== req.params.cycle)
  res.redirect(`/statistics/v1/${req.params.report}`)
})

router.get('/:report/remove-status-option/:status', (req, res) => {
  req.session.data.statisticsOptions.status = req.session.data.statisticsOptions.status.filter(item => item !== req.params.status)
  res.redirect(`/statistics/v1/${req.params.report}`)
})

router.get('/:report/remove-provider-option/:provider', (req, res) => {
  req.session.data.statisticsOptions.provider = req.session.data.statisticsOptions.provider.filter(item => item !== req.params.provider)
  res.redirect(`/statistics/v1/${req.params.report}`)
})

router.get('/:report/remove-accreditedbody-option/:accreditedBody', (req, res) => {
  req.session.data.statisticsOptions.accreditedBody = req.session.data.statisticsOptions.accreditedBody.filter(item => item !== req.params.accreditedBody)
  res.redirect(`/statistics/v1/${req.params.report}`)
})

router.get('/:report/remove-studymode-option/:studyMode', (req, res) => {
  req.session.data.statisticsOptions.studyMode = req.session.data.statisticsOptions.studyMode.filter(item => item !== req.params.studyMode)
  res.redirect(`/statistics/v1/${req.params.report}`)
})

router.get('/:report/remove-fundingtype-option/:fundingType', (req, res) => {
  req.session.data.statisticsOptions.fundingType = req.session.data.statisticsOptions.fundingType.filter(item => item !== req.params.fundingType)
  res.redirect(`/statistics/v1/${req.params.report}`)
})

router.get('/:report/remove-subjectlevel-option/:subjectLevel', (req, res) => {
  req.session.data.statisticsOptions.subjectLevel = req.session.data.statisticsOptions.subjectLevel.filter(item => item !== req.params.subjectLevel)
  res.redirect(`/statistics/v1/${req.params.report}`)
})

router.get('/:report/remove-location-option/:location', (req, res) => {
  req.session.data.statisticsOptions.location = req.session.data.statisticsOptions.location.filter(item => item !== req.params.location)
  res.redirect(`/statistics/v1/${req.params.report}`)
})

router.get('/remove-all-filters', (req, res) => {
  req.session.data.statisticsOptions.cycle = null
  req.session.data.statisticsOptions.status = null
  req.session.data.statisticsOptions.provider = null
  req.session.data.statisticsOptions.accreditedBody = null
  req.session.data.statisticsOptions.studyMode = null
  req.session.data.statisticsOptions.fundingType = null
  req.session.data.statisticsOptions.subjectLevel = null
  req.session.data.statisticsOptions.location = null
  res.redirect(getRedirect(req.headers.referer))
})

module.exports = router