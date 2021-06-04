const SystemHelper = require('./system')

exports.getApplicationCountsByStatus = (applications) => {
  const statuses = SystemHelper.statuses
  const counts = {}
  statuses.forEach((status, i) => {
    counts[status] = applications.filter(application => application.status === status).length
  })
  return counts
}

exports.getApplicationCountsByStudyMode = (applications) => {
  const studyModes = SystemHelper.studyModes
  const counts = {}
  studyModes.forEach((studyMode, i) => {
    counts[studyMode] = applications.filter(application => application.studyMode === studyMode).length
  })
  return counts
}

exports.getApplicationCountsByFundingType = (applications) => {
  const fundingTypes = SystemHelper.fundingTypes
  const counts = {}
  fundingTypes.forEach((fundingType, i) => {
    counts[fundingType] = applications.filter(application => application.fundingType === fundingType).length
  })
  return counts
}

exports.getApplicationCountsBySubject = (applications) => {
  const subjects = SystemHelper.subjects
  const counts = {}
  subjects.forEach((subject, i) => {
    counts[subject.name] = applications.filter(application => application.subject === subject.name).length
  })
  return counts
}

exports.getApplicationCountsByTrainingProvider = (applications) => {
  const organisations = SystemHelper.trainingProviders
  const counts = {}
  organisations.forEach((organisation, i) => {
    counts[organisation] = applications.filter(application => application.provider === organisation).length
  })
  return counts
}

exports.getApplicationCountsByTrainingLocation = (applications) => {
  const trainingLocations = SystemHelper.trainingLocations
  const counts = {}
  trainingLocations.forEach((location, i) => {
    counts[location] = applications.filter(application => application.location === location).length
  })
  return counts
}

exports.getApplicationCountsByReasonsForRejection = (applications) => {
  const reasonsForRejection = SystemHelper.reasonsForRejection
  const counts = {}
  reasonsForRejection.forEach((reason, i) => {
    counts[reason.name] = applications.filter(application => {
      if (application.rejectedReasons) {
        return application.status === 'Rejected' && application.rejectedReasons[reason.code] === 'Yes'
      }
    }).length
  })
  return counts
}
