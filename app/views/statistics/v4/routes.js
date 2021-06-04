const express = require('express')
const router = express.Router()

const ApplicationHelper = require('./helpers/application')
const SystemHelper = require('./helpers/system')

const getFilters = (req) => {
  if (req.session.data.statisticsFilters === undefined) {
    req.session.data.statisticsFilters = {}
  }

  let filters = {}
  filters.cycles = req.session.data.statisticsFilters.cycle
  filters.statuses = req.session.data.statisticsFilters.status
  filters.studyModes = req.session.data.statisticsFilters.studyMode
  filters.fundingTypes = req.session.data.statisticsFilters.fundingType
  filters.subjectLevels = req.session.data.statisticsFilters.subjectLevel
  filters.providers = req.session.data.statisticsFilters.provider
  filters.accreditedBodies = req.session.data.statisticsFilters.accreditedBody
  filters.locations = req.session.data.statisticsFilters.location

  const hasFilters = !!((filters.cycles && filters.cycles.length > 0) || (filters.statuses && filters.statuses.length > 0) || (filters.providers && filters.providers.length > 0) || (filters.accreditedBodies && filters.accreditedBodies.length > 0) || (filters.studyModes && filters.studyModes.length > 0) || (filters.fundingTypes && filters.fundingTypes.length > 0) || (filters.subjectLevels && filters.subjectLevels.length > 0) || (filters.locations && filters.locations.length > 0))

  let selectedFilters = null

  if (hasFilters) {

    const slug = `/statistics/v4${req.route.path}`

    selectedFilters = {
      categories: []
    }

    if (filters.cycles && filters.cycles.length) {
      selectedFilters.categories.push({
        heading: { text: 'Year received' },
        items: filters.cycles.map((cycle) => {
          return {
            text: cycle,
            href: `${slug}/remove-cycle-filter/${cycle}`
          }
        })
      })
    }

    if (filters.statuses && filters.statuses.length) {
      selectedFilters.categories.push({
        heading: { text: 'Status' },
        items: filters.statuses.map((status) => {
          return {
            text: status,
            href: `${slug}/remove-status-filter/${status}`
          }
        })
      })
    }

    if (filters.providers && filters.providers.length) {
      selectedFilters.categories.push({
        heading: { text: 'Training provider' },
        items: filters.providers.map((provider) => {
          return {
            text: provider,
            href: `${slug}/remove-provider-filter/${provider}`
          }
        })
      })
    }

    if (filters.locations && filters.locations.length) {
      selectedFilters.categories.push({
        heading: { text: 'Location' },
        items: filters.locations.map((location) => {
          return {
            text: location,
            href: `${slug}/remove-location-filter/${location}`
          }
        })
      })
    }

    if (filters.accreditedBodies && filters.accreditedBodies.length) {
      selectedFilters.categories.push({
        heading: { text: 'Accredited body' },
        items: filters.accreditedBodies.map((accreditedbody) => {
          return {
            text: accreditedbody,
            href: `${slug}/remove-accreditedbody-filter/${accreditedbody}`
          }
        })
      })
    }

    if (filters.studyModes && filters.studyModes.length) {
      selectedFilters.categories.push({
        heading: { text: 'Full time or part time' },
        items: filters.studyModes.map((studyMode) => {
          return {
            text: studyMode,
            href: `${slug}/remove-studymode-filter/${studyMode}`
          }
        })
      })
    }

    if (filters.fundingTypes && filters.fundingTypes.length) {
      selectedFilters.categories.push({
        heading: { text: 'Funding type' },
        items: filters.fundingTypes.map((fundingType) => {
          return {
            text: fundingType,
            href: `${slug}/remove-fundingtype-filter/${fundingType}`
          }
        })
      })
    }

    if (filters.subjectLevels && filters.subjectLevels.length) {
      selectedFilters.categories.push({
        heading: { text: 'Subject level' },
        items: filters.subjectLevels.map((subjectLevel) => {
          return {
            text: subjectLevel,
            href: `${slug}/remove-subjectlevel-filter/${subjectLevel}`
          }
        })
      })
    }
  }

  return { hasFilters, selectedFilters, filters }
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

router.get('/', (req, res) => {
  delete req.session.data.statisticsOptions
  delete req.session.data.statisticsFilters
  
  res.render('statistics/v4/index', {
    
  })
})

router.get('/courses', (req, res) => {
  if (!req.session.data.applications) {
    req.session.data.applications = SystemHelper.loadApplications
  }
  
  let applications = req.session.data.applications
  const options = req.session.data.statisticsOptions
  const filters = getFilters(req)

  // if the user hasn't configured the report to include cycle data,
  // we just want the current cycle's data
  if (!options || !((options.dimension2 === 'cycle') || (options.dimension3 === 'cycle') || (options.dimension4 === 'cycle'))) {
    applications = applications.filter(application => application.cycle === '2020 to 2021')
  }

  if (filters.hasFilters) {
    applications = getApplications(applications, filters.filters)
  }

  const showFilters = []
  if (options) {
    // parse the dimensions so we know what filters to show
    for (const [key, value] of Object.entries(options)) {
      showFilters.push(value)
    }
  }

  // get the default counts for the report
  let counts = ApplicationHelper.getApplicationCountsBySubject(applications)

  // get the counts based on the dimenstions chosen by the user
  if (options) {
    counts = ApplicationHelper.getApplicationCounts(applications, options)
  }

  // default dimension 1 to the subject (a proxy for course)
  const dimension1 = ApplicationHelper.getDimensionData('subject').data

  let dimension2 = []
  if (options && options.dimension2) {
    dimension2 = ApplicationHelper.getDimensionData(options.dimension2).data
  }

  let dimension3 = []
  if (options && options.dimension3) {
    dimension3 = ApplicationHelper.getDimensionData(options.dimension3).data
  }

  let dimension4 = []
  if (options && options.dimension4) {
    dimension4 = ApplicationHelper.getDimensionData(options.dimension4).data
  }

  // Dimension 3 and 4 are optional

  // | =============== | Dimension 2               | Dimension 2               |
  // | =============== | Dimension 3 | Dimension 3 | Dimension 3 | Dimension 3 |
  // | Dimension 1     | =========== | =========== | =========== | =========== |
  // |  -- Dimension 4 | =========== | =========== | =========== | =========== |
  // |  -- Dimension 4 | =========== | =========== | =========== | =========== |
  // |  -- Dimension 4 | =========== | =========== | =========== | =========== |
  // | Dimension 1     | =========== | =========== | =========== | =========== |
  // |  -- Dimension 4 | =========== | =========== | =========== | =========== |
  // |  -- Dimension 4 | =========== | =========== | =========== | =========== |
  // |  -- Dimension 4 | =========== | =========== | =========== | =========== |

  res.render('statistics/v4/courses', {
    section: 'applications',
    report: 'courses',
    totalApplications: applications.length,
    options,
    dimension1,
    dimension2,
    dimension3,
    dimension4,
    counts,
    hasFilters: filters.hasFilters,
    selectedFilters: filters.selectedFilters,
    showFilters
  })
})

// ===========================================================================
// Configure
// ===========================================================================

router.get('/:report/settings', (req, res) => {
  if (!req.session.data.statisticsOptions) {
    req.session.data.statisticsOptions = { dimension1: 'subject' }
  }

  const options = req.session.data.statisticsOptions

  const chosenOptions = []
  if (options) {
    // parse the dimensions so we know what filters to show
    for (const [key, value] of Object.entries(options)) {
      chosenOptions.push(value)
    }
  }

  let counter = 1
  if (options) {
    counter = chosenOptions.length + 1
  }

  res.render('statistics/v4/settings', {
    report: req.params.report,
    reportName: 'Courses',
    counter,
    chosenOptions
  })
})

router.post('/:report/settings', (req, res) => {
  if (req.session.data.button.submit === 'continue') {
    res.redirect(`/statistics/v4/${req.params.report}/settings`)
  } else {
    res.redirect(`/statistics/v4/${req.params.report}`)
  }
})

// ===========================================================================
// Settings
// ===========================================================================

router.get('/:report/remove-all-settings', (req, res) => {
  delete req.session.data.statisticsOptions
  delete req.session.data.statisticsFilters
  res.redirect(`/statistics/v4/${req.params.report}`)
})

// ===========================================================================
// Filters
// ===========================================================================

router.get('/:report/remove-cycle-filter/:cycle', (req, res) => {
  req.session.data.statisticsFilters.cycle = req.session.data.statisticsFilters.cycle.filter(item => item !== req.params.cycle)
  res.redirect(`/statistics/v4/${req.params.report}`)
})

router.get('/:report/remove-status-filter/:status', (req, res) => {
  req.session.data.statisticsFilters.status = req.session.data.statisticsFilters.status.filter(item => item !== req.params.status)
  res.redirect(`/statistics/v4/${req.params.report}`)
})

router.get('/:report/remove-provider-filter/:provider', (req, res) => {
  req.session.data.statisticsFilters.provider = req.session.data.statisticsFilters.provider.filter(item => item !== req.params.provider)
  res.redirect(`/statistics/v4/${req.params.report}`)
})

router.get('/:report/remove-accreditedbody-filter/:accreditedBody', (req, res) => {
  req.session.data.statisticsFilters.accreditedBody = req.session.data.statisticsFilters.accreditedBody.filter(item => item !== req.params.accreditedBody)
  res.redirect(`/statistics/v4/${req.params.report}`)
})

router.get('/:report/remove-studymode-filter/:studyMode', (req, res) => {
  req.session.data.statisticsFilters.studyMode = req.session.data.statisticsFilters.studyMode.filter(item => item !== req.params.studyMode)
  res.redirect(`/statistics/v4/${req.params.report}`)
})

router.get('/:report/remove-fundingtype-filter/:fundingType', (req, res) => {
  req.session.data.statisticsFilters.fundingType = req.session.data.statisticsFilters.fundingType.filter(item => item !== req.params.fundingType)
  res.redirect(`/statistics/v4/${req.params.report}`)
})

router.get('/:report/remove-subjectlevel-filter/:subjectLevel', (req, res) => {
  req.session.data.statisticsFilters.subjectLevel = req.session.data.statisticsFilters.subjectLevel.filter(item => item !== req.params.subjectLevel)
  res.redirect(`/statistics/v4/${req.params.report}`)
})

router.get('/:report/remove-location-filter/:location', (req, res) => {
  req.session.data.statisticsFilters.location = req.session.data.statisticsFilters.location.filter(item => item !== req.params.location)
  res.redirect(`/statistics/v4/${req.params.report}`)
})

router.get('/:report/remove-all-filters', (req, res) => {
  req.session.data.statisticsFilters.cycle = null
  req.session.data.statisticsFilters.status = null
  req.session.data.statisticsFilters.provider = null
  req.session.data.statisticsFilters.accreditedBody = null
  req.session.data.statisticsFilters.studyMode = null
  req.session.data.statisticsFilters.fundingType = null
  req.session.data.statisticsFilters.subjectLevel = null
  req.session.data.statisticsFilters.location = null
  res.redirect(`/statistics/v4/${req.params.report}`)
})

module.exports = router