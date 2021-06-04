const SystemHelper = require('./system')

exports.getApplicationCounts = (applications, options) => {
  if (!options) {
    return null
  }

  // console.log('Options:', options);

  const counts = {}
  counts.totalApplications = applications.length

  const dimension1 = this.getDimensionData(options.dimension1)

  // console.log('Dimension 1', dimension1);

  let dimension2 = {}
  if (options.dimension2) {
    dimension2 = this.getDimensionData(options.dimension2)
  }

  // console.log('Dimension 2', dimension2);

  let dimension3 = {}
  if (options.dimension3) {
    dimension3 = this.getDimensionData(options.dimension3)
  }

  // console.log('Dimension 3', dimension3);

  let dimension4 = {}
  if (options.dimension4) {
    dimension4 = this.getDimensionData(options.dimension4)
  }

  // console.log('Dimension 4', dimension4);

  // DIMENSION 1 – Row
  dimension1.data.forEach((dm1, i) => {
    counts[dm1] = {}
    counts[dm1].total = applications.filter(application => application.subject === dm1).length
    counts[dm1].percentage = ((counts[dm1].total / counts.totalApplications) * 100).toFixed(2)

    // DIMENSION 2 - Column
    if (dimension2 && dimension2.data) {

      dimension2.data.forEach((dm2, i) => {
        counts[dm1][dm2] = {}
        counts[dm1][dm2].total = applications.filter(application => application[dimension1.label] === dm1 && application[dimension2.label] === dm2).length
        counts[dm1][dm2].percentage = ((counts[dm1][dm2].total / counts.totalApplications) * 100).toFixed(2)

        // DIMENSION 3 - Sub-column
        if (dimension3 && dimension3.data) {

          dimension3.data.forEach((dm3, i) => {
            counts[dm1][dm2][dm3] = {}

            counts[dm1][dm2][dm3].total = applications.filter(application => application[dimension1.label] === dm1 && application[dimension2.label] === dm2 && application[dimension3.label] === dm3).length
            counts[dm1][dm2][dm3].percentage = ((counts[dm1][dm2][dm3].total / counts.totalApplications) * 100).toFixed(2)

            // DIMENSION 4  - Sub-row
            if (dimension4 && dimension4.data) {

              dimension4.data.forEach((dm4, i) => {
                // Get the group count
                counts[dm1][dm2][dm4] = {}

                counts[dm1][dm2][dm4].total = applications.filter(application => application[dimension1.label] === dm1 && application[dimension2.label] === dm2 && application[dimension4.label] === dm4).length
                counts[dm1][dm2][dm4].percentage = ((counts[dm1][dm2][dm4].total / counts.totalApplications) * 100).toFixed(2)

                // Get the dimension count
                counts[dm1][dm2][dm3][dm4] = {}

                counts[dm1][dm2][dm3][dm4].total = applications.filter(application => application[dimension1.label] === dm1 && application[dimension2.label] === dm2 && application[dimension3.label] === dm3 && application[dimension4.label] === dm4).length
                counts[dm1][dm2][dm3][dm4].percentage = ((counts[dm1][dm2][dm3][dm4].total / counts.totalApplications) * 100).toFixed(2)

              })

            }

          })

        }

      })

    }

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