const SystemHelper = require('./system')

exports.getApplicationCounts = (applications, options) => {
  if (!options) {
    return null
  }

  const counts = {}
  const dimension1 = SystemHelper.subjects.map((subject) => {
    return subject.name
  })
  const dimension2 = this.getDimensionData(options.dimension2).data
  const dimension2Label = this.getDimensionData(options.dimension2).label
  const dimension3 = this.getDimensionData(options.dimension3).data
  const dimension3Label = this.getDimensionData(options.dimension3).label

  // DIMENSION 1
  dimension1.forEach((dm1, i) => {
    counts[dm1] = {}
    counts[dm1].totals = {}
    counts[dm1].totals.total = applications.filter(application => application.subject === dm1).length

    // DIMENSION 2
    dimension2.forEach((dm2, i) => {
      counts[dm1][dm2] = {}
      // counts[dm1][dm2].total = applications.filter(application => application.subject === dm1 && application[dimension2Label] === dm2).length

      // DIMENSION 3
      dimension3.forEach((dm3, i) => {
        counts[dm1][dm2][dm3] = applications.filter(application => application.subject === dm1 && application[dimension2Label] === dm2 && application[dimension3Label] === dm3).length

        counts[dm1].totals[dm3] = applications.filter(application => application.subject === dm1 && application[dimension3Label] === dm3).length
      })

    })

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

exports.getDimensionData = (dimension) => {
  if (!dimension) {
    return null
  }

  let data = []
  let label = ''

  switch (dimension) {
    case 'cycle':
      data = SystemHelper.cycles
      label = 'cycle'
      break
    case 'status':
      data = SystemHelper.statuses
      label = 'status'
      break
    case 'subject':
      data = SystemHelper.subjects.map((subject) => {
        return subject.name
      })
      label = 'subject'
      break
    case 'studyMode':
      data = SystemHelper.studyModes
      label = 'studyMode'
      break
    case 'fundingType':
      data = SystemHelper.fundingTypes
      label = 'fundingType'
      break
    case 'subjectLevel':
      data = SystemHelper.subjectLevels
      label = 'subjectLevel'
      break
    case 'location':
      data = SystemHelper.trainingLocations
      label = 'location'
      break
    case 'provider':
    case 'trainingProvider':
      data = SystemHelper.trainingProviders
      label = 'provider'
      break
    case 'accreditedBody':
      data = SystemHelper.accreditedBodies
      label = 'accreditedBody'
      break
  }

  return { data, label }
}