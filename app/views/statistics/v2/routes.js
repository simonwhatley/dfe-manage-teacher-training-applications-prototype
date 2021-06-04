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

    const slug = `/statistics/v2${req.route.path}`
    
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

const getReportConfigOptions = (report) => {
  if (!report.length) {
    return null
  }

  let options = []

  switch (report) {
    case 'courses-by-year':
      options = [
        'status',
        'trainingProvider',
        'accreditedBody',
        'subjectLevel'
      ]
      break
    case 'courses-by-status':
      options = [
        'cycle',
        'status',
        'trainingProvider',
        'accreditedBody',
        'subjectLevel'
      ]
      break
    case 'courses-by-training-provider':
      options = [
        'cycle',
        'status',
        'trainingProvider',
        'accreditedBody',
        'subjectLevel'
      ]
      break
    case 'courses-by-training-location':
      options = [
        'cycle',
        'status',
        'location',
        'subject',
        'subjectLevel'
      ]
      break
    case 'courses-by-reasons-for-rejection':
      options = [
        'cycle',
        'subject',
        'subjectLevel'
      ]
      break
    case 'course-performance':
      options = [
        'cycle',
        'location',
        'subject',
        'subjectLevel'
      ]
      break
    case 'course-diversity-ethnicity':
    case 'course-diversity-nationality':
    case 'course-diversity-sex':
      options = [
        'cycle',
        'subjectLevel'
      ]
      break
  }

  return options
}

const getReportName = (report) => {
  if (!report.length) {
    return null
  }

  let name = ''

  switch (report) {
    case 'courses-by-year':
      name = 'Courses by year'
      break
    case 'courses-by-status':
      name = 'Courses by status'
      break
    case 'courses-by-training-provider':
      name = 'Courses by training provider'
      break
    case 'courses-by-training-location':
      name = 'Courses by training location'
      break
    case 'courses-by-reasons-for-rejection':
      name = 'Courses by reasons for rejection'
      break
    case 'course-performance':
      name = 'Course performance'
      break
    case 'course-diversity-ethnicity':
      name = 'Course diversity - ethnicity'
      break
    case 'course-diversity-nationality':
      name = 'Course diversity - nationality'
      break
    case 'course-diversity-sex':
      name = 'Course diversity - sex'
      break
    default:
      name = report
      break
  }

  return name
}

router.get('/', (req, res) => {
  delete req.session.data.statisticsOptions
  
  res.render('statistics/v2/index', {
    
  })
})

router.get('/courses-by-year', (req, res) => {
  if (!req.session.data.applications) {
    req.session.data.applications = SystemHelper.loadApplications
  }
  
  let applications = req.session.data.applications
  const options = getConfigOptions(req)

  if (options.hasOptions) {
    applications = getApplications(applications, options.options)
  }
  
  applicationsCurrentCycle = applications.filter(application => application.cycle === '2020 to 2021')
  applicationsPreviousCycle = applications.filter(application => application.cycle === '2019 to 2020')
  
  res.render('statistics/v2/year', {
    totalApplications: applications.length,
    subjects: SystemHelper.subjects,
    statuses: SystemHelper.statuses,
    subjectCountsCurrentCycle: ApplicationHelper.getApplicationCountsBySubjectAndStatus(applicationsCurrentCycle),
    subjectCountsPreviousCycle: ApplicationHelper.getApplicationCountsBySubjectAndStatus(applicationsPreviousCycle),
    report: 'courses-by-year',
    hasOptions: options.hasOptions,
    selectedOptions: options.selectedOptions
  })
})

router.get('/courses-by-status', (req, res) => {
  if (!req.session.data.applications) {
    req.session.data.applications = SystemHelper.loadApplications
  }
  
  let applications = req.session.data.applications
  const options = getConfigOptions(req)

  if (options.hasOptions) {
    applications = getApplications(applications, options.options)
  }
  
  console.log(ApplicationHelper.getApplicationCountsBySubjectAndStatus(applications));
  
  res.render('statistics/v2/status', {
    totalApplications: applications.length,
    subjects: SystemHelper.subjects,
    statuses: SystemHelper.statuses,
    cycles: SystemHelper.cycles,
    subjectCounts: ApplicationHelper.getApplicationCountsBySubjectAndStatus(applications),
    section: 'applications',
    report: 'courses-by-status',
    hasOptions: options.hasOptions,
    selectedOptions: options.selectedOptions
  })
})

router.get('/courses-by-training-provider', (req, res) => {
  if (!req.session.data.applications) {
    req.session.data.applications = SystemHelper.loadApplications
  }
  
  let applications = req.session.data.applications
  const options = getConfigOptions(req)

  if (options.hasOptions) {
    applications = getApplications(applications, options.options)
  }
  
  res.render('statistics/v2/training-provider', {
    totalApplications: applications.length,
    subjects: SystemHelper.subjects,
    trainingProviders: SystemHelper.trainingProviders,
    subjectCounts: ApplicationHelper.getApplicationCountsBySubjectAndTrainingProvider(applications),
    report: 'courses-by-training-provider',
    hasOptions: options.hasOptions,
    selectedOptions: options.selectedOptions
  })
})

router.get('/courses-by-training-location', (req, res) => {
  if (!req.session.data.applications) {
    req.session.data.applications = SystemHelper.loadApplications
  }
  
  let applications = req.session.data.applications
  const options = getConfigOptions(req)

  if (options.hasOptions) {
    applications = getApplications(applications, options.options)
  }
  
  res.render('statistics/v2/training-location', {
    totalApplications: applications.length,
    subjects: SystemHelper.subjects,
    locations: SystemHelper.trainingLocations,
    subjectCounts: ApplicationHelper.getApplicationCountsBySubjectAndLocation(applications),
    report: 'courses-by-training-location',
    hasOptions: options.hasOptions,
    selectedOptions: options.selectedOptions
  })
})

router.get('/courses-by-reasons-for-rejection', (req, res) => {
  if (!req.session.data.applications) {
    req.session.data.applications = SystemHelper.loadApplications
  }
  
  let applications = req.session.data.applications
  applications = applications.filter(application => application.cycle === '2020 to 2021')
  
  const options = getConfigOptions(req)

  if (options.hasOptions) {
    applications = getApplications(applications, options.options)
  }
  
  res.render('statistics/v2/reasons-for-rejection', {
    totalApplications: applications.length,
    subjects: SystemHelper.subjects,
    reasons: SystemHelper.reasonsForRejection,
    subjectCounts: ApplicationHelper.getApplicationCountsBySubjectAndReasonsForRejection(applications),
    report: 'courses-by-reasons-for-rejection',
    hasOptions: options.hasOptions,
    selectedOptions: options.selectedOptions
  })
})

router.get('/course-performance', (req, res) => {
  if (!req.session.data.applications) {
    req.session.data.applications = SystemHelper.loadApplications
  }
  
  let applications = req.session.data.applications
  applications = applications.filter(application => application.cycle === '2020 to 2021')
  
  const options = getConfigOptions(req)

  if (options.hasOptions) {
    applications = getApplications(applications, options.options)
  }
  
  res.render('statistics/v2/performance', {
    totalApplications: applications.length,
    subjects: SystemHelper.subjects,
    subjectCounts: ApplicationHelper.getSubjectPerformance(applications),
    report: 'course-performance',
    hasOptions: options.hasOptions,
    selectedOptions: options.selectedOptions
  })
})

router.get('/course-diversity-sex', (req, res) => {
  if (!req.session.data.applications) {
    req.session.data.applications = SystemHelper.loadApplications
  }
  
  let applications = req.session.data.applications
  applications = applications.filter(application => application.cycle === '2020 to 2021')
  
  const options = getConfigOptions(req)

  if (options.hasOptions) {
    applications = getApplications(applications, options.options)
  }
  
  res.render('statistics/v2/sex', {
    totalApplications: applications.length,
    subjects: SystemHelper.subjects,
    sexes: SystemHelper.sex,
    subjectCounts: ApplicationHelper.getApplicationCountsBySubjectAndSex(applications),
    report: 'course-diversity-sex',
    hasOptions: options.hasOptions,
    selectedOptions: options.selectedOptions
  })
})

router.get('/course-diversity-ethnicity', (req, res) => {
  if (!req.session.data.applications) {
    req.session.data.applications = SystemHelper.loadApplications
  }
  
  let applications = req.session.data.applications
  applications = applications.filter(application => application.cycle === '2020 to 2021')
  
  const options = getConfigOptions(req)

  if (options.hasOptions) {
    applications = getApplications(applications, options.options)
  }
  
  res.render('statistics/v2/ethnicity', {
    totalApplications: applications.length,
    subjects: SystemHelper.subjects,
    ethnicities: SystemHelper.ethnicity,
    subjectCounts: ApplicationHelper.getApplicationCountsBySubjectAndEthnicity(applications),
    report: 'course-diversity-ethnicity',
    hasOptions: options.hasOptions,
    selectedOptions: options.selectedOptions
  })
})

router.get('/course-diversity-nationality', (req, res) => {
  if (!req.session.data.applications) {
    req.session.data.applications = SystemHelper.loadApplications
  }
  
  let applications = req.session.data.applications
  applications = applications.filter(application => application.cycle === '2020 to 2021')
  
  const options = getConfigOptions(req)

  if (options.hasOptions) {
    applications = getApplications(applications, options.options)
  }
  
  res.render('statistics/v2/nationality', {
    totalApplications: applications.length,
    subjects: SystemHelper.subjects,
    nationalities: SystemHelper.nationality,
    subjectCounts: ApplicationHelper.getApplicationCountsBySubjectAndNationality(applications),
    report: 'course-diversity-nationality',
    hasOptions: options.hasOptions,
    selectedOptions: options.selectedOptions
  })
})

router.get('/candidate-nationality', (req, res) => {
  if (!req.session.data.applications) {
    req.session.data.applications = SystemHelper.loadApplications
  }
  
  let applications = req.session.data.applications
  const options = getConfigOptions(req)

  if (options.hasOptions) {
    applications = getApplications(applications, options.options)
  }
  
  res.render('statistics/v2/candidate-nationality', {
    nationalityCounts: ApplicationHelper.getApplicationCountsByCandidateNationality(applications),
    report: 'candidate-nationality',
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

router.get('/residence', (req, res) => {
  if (!req.session.data.applications) {
    req.session.data.applications = SystemHelper.loadApplications
  }
  
  let applications = req.session.data.applications
  const options = getConfigOptions(req)

  if (options.hasOptions) {
    applications = getApplications(applications, options.options)
  }
  
  res.render('statistics/v2/residence', {
    residenceCounts: ApplicationHelper.getApplicationCountsByCandidateResidence(applications),
    report: 'residence',
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

router.get('/right-to-work', (req, res) => {
  if (!req.session.data.applications) {
    req.session.data.applications = SystemHelper.loadApplications
  }
  
  let applications = req.session.data.applications
  const options = getConfigOptions(req)

  if (options.hasOptions) {
    applications = getApplications(applications, options.options)
  }
  
  res.render('statistics/v2/right-to-work', {
    rightWorkStudyCounts: ApplicationHelper.getApplicationCountsByCandidateRightToWorkStudy(applications),
    report: 'right-to-work',
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

router.get('/english-language-qualification', (req, res) => {
  if (!req.session.data.applications) {
    req.session.data.applications = SystemHelper.loadApplications
  }
  
  let applications = req.session.data.applications
  const options = getConfigOptions(req)

  if (options.hasOptions) {
    applications = getApplications(applications, options.options)
  }
  
  res.render('statistics/v2/english-language-qualification', {
    foreignLanguageCounts: ApplicationHelper.getApplicationCountsByCandidateLanguageAssessment(applications),
    report: 'english-language-qualification',
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

router.get('/:report/configure', (req, res) => {
  const options = getConfigOptions(req)
  res.render('statistics/v2/config-options', {
    report: req.params.report,
    reportName: getReportName(req.params.report),
    hasOptions: options.hasOptions,
    selectedOptions: options.selectedOptions,
    configOptions: getReportConfigOptions(req.params.report)
  })
})

router.get('/:report/remove-cycle-option/:cycle', (req, res) => {
  req.session.data.statisticsOptions.cycle = req.session.data.statisticsOptions.cycle.filter(item => item !== req.params.cycle)
  res.redirect(`/statistics/v2/${req.params.report}`)
})

router.get('/:report/remove-status-option/:status', (req, res) => {
  req.session.data.statisticsOptions.status = req.session.data.statisticsOptions.status.filter(item => item !== req.params.status)
  res.redirect(`/statistics/v2/${req.params.report}`)
})

router.get('/:report/remove-provider-option/:provider', (req, res) => {
  req.session.data.statisticsOptions.provider = req.session.data.statisticsOptions.provider.filter(item => item !== req.params.provider)
  res.redirect(`/statistics/v2/${req.params.report}`)
})

router.get('/:report/remove-accreditedbody-option/:accreditedBody', (req, res) => {
  req.session.data.statisticsOptions.accreditedBody = req.session.data.statisticsOptions.accreditedBody.filter(item => item !== req.params.accreditedBody)
  res.redirect(`/statistics/v2/${req.params.report}`)
})

router.get('/:report/remove-studymode-option/:studyMode', (req, res) => {
  req.session.data.statisticsOptions.studyMode = req.session.data.statisticsOptions.studyMode.filter(item => item !== req.params.studyMode)
  res.redirect(`/statistics/v2/${req.params.report}`)
})

router.get('/:report/remove-fundingtype-option/:fundingType', (req, res) => {
  req.session.data.statisticsOptions.fundingType = req.session.data.statisticsOptions.fundingType.filter(item => item !== req.params.fundingType)
  res.redirect(`/statistics/v2/${req.params.report}`)
})

router.get('/:report/remove-subjectlevel-option/:subjectLevel', (req, res) => {
  req.session.data.statisticsOptions.subjectLevel = req.session.data.statisticsOptions.subjectLevel.filter(item => item !== req.params.subjectLevel)
  res.redirect(`/statistics/v2/${req.params.report}`)
})

router.get('/:report/remove-location-option/:location', (req, res) => {
  req.session.data.statisticsOptions.location = req.session.data.statisticsOptions.location.filter(item => item !== req.params.location)
  res.redirect(`/statistics/v2/${req.params.report}`)
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

router.get('/:report/remove-all-options', (req, res) => {
  req.session.data.statisticsOptions.cycle = null
  req.session.data.statisticsOptions.status = null
  req.session.data.statisticsOptions.provider = null
  req.session.data.statisticsOptions.accreditedBody = null
  req.session.data.statisticsOptions.studyMode = null
  req.session.data.statisticsOptions.fundingType = null
  req.session.data.statisticsOptions.subjectLevel = null
  req.session.data.statisticsOptions.location = null
  res.redirect(`/statistics/v2/${req.params.report}`)
})

module.exports = router