const SystemHelper = require('./system')

const path = require('path')
const fs = require('fs')

const dataDirectoryPath = path.join(__dirname, '../data/')

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

exports.getApplicationCountsBySubjectAndStatus = (applications) => {
  const subjects = SystemHelper.subjects
  const statuses = SystemHelper.statuses
  const counts = {}
  subjects.forEach((subject, i) => {
    counts[subject.name] = {}
    statuses.forEach((status, i) => {
      counts[subject.name][status] = applications.filter(application => application.subject === subject.name && application.status === status).length
    })
    counts[subject.name]['total'] = applications.filter(application => application.subject === subject.name).length
  })
  return counts
}

exports.getApplicationCountsBySubjectAndTrainingProvider = (applications) => {
  const organisations = SystemHelper.trainingProviders
  const subjects = SystemHelper.subjects
  const counts = {}
  subjects.forEach((subject, i) => {
    counts[subject.name] = {}
    organisations.forEach((organisation, i) => {
      counts[subject.name][organisation.name] = applications.filter(application => application.subject === subject.name && application.provider === organisation.name).length
    })
    counts[subject.name]['total'] = applications.filter(application => application.subject === subject.name).length
  })
  return counts
}

exports.getApplicationCountsBySubjectAndLocation = (applications) => {
  const subjects = SystemHelper.subjects
  const locations = SystemHelper.trainingLocations
  const counts = {}
  subjects.forEach((subject, i) => {
    counts[subject.name] = {}
    locations.forEach((location, i) => {
      counts[subject.name][location] = applications.filter(application => application.subject === subject.name && application.location === location).length
    })
    counts[subject.name]['total'] = applications.filter(application => application.subject === subject.name).length
  })
  return counts
}

exports.getApplicationCountsBySubjectAndReasonsForRejection = (applications) => {
  const subjects = SystemHelper.subjects
  const reasonsForRejection = SystemHelper.reasonsForRejection
  const counts = {}
  subjects.forEach((subject, i) => {
    counts[subject.name] = {}
    reasonsForRejection.forEach((reason, i) => {
      counts[subject.name][reason.name] = applications.filter(application => {
        if (application.rejectedReasons) {
          return application.status === 'Rejected' && application.subject === subject.name && application.rejectedReasons[reason.code] === 'Yes'
        }
      }).length
    })
    counts[subject.name]['total'] = applications.filter(application => application.status === 'Rejected' && application.subject === subject.name).length
  })
  return counts
}

exports.getSubjectPerformance = (applications) => {
  const subjects = SystemHelper.subjects
  const counts = {}

  subjects.forEach((subject, i) => {
    counts[subject.name] = {}

    // Offer counts
    counts[subject.name]['Offers sent'] = applications.filter(application => application.offer !== null && application.subject === subject.name).length

    counts[subject.name]['Offers accepted'] = applications.filter(application => application.offer !== null && application.subject === subject.name && application.status === 'Ready to enroll').length

    counts[subject.name]['Offers accepted'] = applications.filter(application => application.offer !== null && application.subject === subject.name && application.status === 'Ready to enroll').length

    counts[subject.name]['Offers declined'] = applications.filter(application => application.offer !== null && application.subject === subject.name && application.status === 'Declined').length

    counts[subject.name]['Offers deferred'] = applications.filter(application => application.offer !== null && application.subject === subject.name && application.status === 'Deferred').length

    counts[subject.name]['Offers awaiting conditions'] = applications.filter(application => application.offer !== null && application.subject === subject.name && application.status === 'Awaiting conditions').length

    // Application counts
    counts[subject.name]['Applications withdrawn'] = applications.filter(application => application.subject === subject.name && application.status === 'Withdrawn').length

    counts[subject.name]['Applications rejected before interview'] = applications.filter(application => application.subject === subject.name && application.status === 'Rejected' && application.interviews === undefined).length

    counts[subject.name]['Applications rejected after interview'] = applications.filter(application => application.subject === subject.name && application.status === 'Rejected' && application.interviews !== undefined).length
  })

  return counts
}

exports.getApplicationCountsBySubjectAndSex = (applications) => {
  const subjects = SystemHelper.subjects
  const sexes = SystemHelper.sex
  const counts = {}
  subjects.forEach((subject, i) => {
    counts[subject.name] = {}
    sexes.forEach((sex, i) => {
      counts[subject.name][sex] = applications.filter(application => application.subject === subject.name && application.personalDetails.sex === sex).length
    })
  })
  return counts
}

exports.getApplicationCountsBySubjectAndEthnicity = (applications) => {
  const subjects = SystemHelper.subjects
  const ethnicities = SystemHelper.ethnicity
  const counts = {}
  subjects.forEach((subject, i) => {
    counts[subject.name] = {}
    ethnicities.forEach((ethnicity, i) => {
      counts[subject.name][ethnicity] = applications.filter(application => application.subject === subject.name && application.personalDetails.ethnicGroup === ethnicity).length
    })
  })
  return counts
}

exports.getApplicationCountsBySubjectAndNationality = (applications) => {
  const subjects = SystemHelper.subjects
  const countries = SystemHelper.countries
  const counts = {}
  subjects.forEach((subject, i) => {
    counts[subject.name] = {}

    counts[subject.name]['British'] = 0
    counts[subject.name]['British (Dual)'] = 0
    counts[subject.name]['Irish'] = 0
    counts[subject.name]['Europe'] = 0
    counts[subject.name]['Rest of world'] = 0

    countries.forEach((country, i) => {

      if (country.nationality === 'British') {
        // The applicant is only British
        counts[subject.name]['British'] = applications.filter(application => {
          if (application.personalDetails.nationality.length === 1) {
            return application.subject === subject.name && application.personalDetails.nationality.includes(country.nationality)
          }
        }).length

        // The applicant has dual or multiple nationalities with British as one of them
        counts[subject.name]['British (Dual)'] = applications.filter(application => {
          if (application.personalDetails.nationality.length > 1) {
            return application.subject === subject.name &&  application.personalDetails.nationality.includes(country.nationality)
          }
        }).length
      }

      // The applicant is only Irish
      if (country.nationality === 'Irish') {
        counts[subject.name]['Irish'] = applications.filter(application => {
          if (application.personalDetails.nationality.length === 1) {
            return application.subject === subject.name &&  application.personalDetails.nationality.includes(country.nationality)
          }
        }).length
      }

      // The applicant is from the EU, Switzerland, Norway, Iceland or Liechtenstein (not including Ireland)
      if (country.region === 'europe') {
        counts[subject.name]['Europe'] += applications.filter(application => {
          return application.subject === subject.name &&  application.personalDetails.nationality.includes(country.nationality) && !(application.personalDetails.nationality.includes('British') || application.personalDetails.nationality.includes('Irish'))
        }).length
      }

      // The applicant is from somewhere else in the world
      if (country.region === 'row') {
        counts[subject.name]['Rest of world'] += applications.filter(application => {
          return application.subject === subject.name &&  application.personalDetails.nationality.includes(country.nationality) && !(application.personalDetails.nationality.includes('British') || application.personalDetails.nationality.includes('Irish'))
        }).length
      }
    })

  })
  return counts
}


exports.getApplicationCountsByOrganisation = (applications) => {
  const organisations = SystemHelper.trainingProviders
  const counts = {}
  organisations.forEach((organisation, i) => {
    counts[organisation.name] = applications.filter(application => application.provider === organisation.name).length
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

exports.getApplicationCountsByCandidateNationality = (applications) => {
  const countries = SystemHelper.countries
  const counts = {}

  counts['British'] = 0
  counts['British (Dual)'] = 0
  counts['Irish'] = 0
  counts['Europe'] = 0
  counts['Europe (Dual)'] = 0
  counts['Rest of world'] = 0
  counts['Rest of world (Dual)'] = 0

  countries.forEach((country, i) => {

    if (country.nationality === 'British') {
      counts['British'] = applications.filter(application => {
        if (application.personalDetails.nationality.length === 1) {
          return application.personalDetails.nationality.includes(country.nationality)
        }
      }).length

      counts['British (Dual)'] = applications.filter(application => {
        if (application.personalDetails.nationality.length > 1) {
          return application.personalDetails.nationality.includes(country.nationality)
        }
      }).length
    }

    if (country.nationality === 'Irish') {
      counts['Irish'] = applications.filter(application => {
        if (application.personalDetails.nationality.length === 1) {
          return application.personalDetails.nationality.includes(country.nationality)
        }
      }).length
    }

    // EU, Switzerland, Norway, Iceland or Liechtenstein
    if (country.region === 'europe') {
      counts['Europe'] += applications.filter(application => {
        return application.personalDetails.nationality.includes(country.nationality) && !(application.personalDetails.nationality.includes('British') || application.personalDetails.nationality.includes('Irish'))
      }).length

      // counts['Europe'] += applications.filter(application => {
      //   if (application.personalDetails.nationality.length === 1) {
      //     return application.personalDetails.nationality.includes(country.nationality)
      //   }
      // }).length
      //
      // counts['Europe (Dual)'] += applications.filter(application => {
      //   if (application.personalDetails.nationality.length > 1) {
      //     return application.personalDetails.nationality.includes(country.nationality) && !(application.personalDetails.nationality.includes('British') || application.personalDetails.nationality.includes('Irish'))
      //   }
      // }).length
    }

    if (country.region === 'row') {

      counts['Rest of world'] += applications.filter(application => {
        return application.personalDetails.nationality.includes(country.nationality) && !(application.personalDetails.nationality.includes('British') || application.personalDetails.nationality.includes('Irish'))
      }).length

      // counts['Rest of world'] += applications.filter(application => {
      //   if (application.personalDetails.nationality.length === 1) {
      //     return application.personalDetails.nationality.includes(country.nationality)
      //   }
      // }).length
      //
      // counts['Rest of world (Dual)'] += applications.filter(application => {
      //   if (application.personalDetails.nationality.length > 1) {
      //     return application.personalDetails.nationality.includes(country.nationality) && !(application.personalDetails.nationality.includes('British') || application.personalDetails.nationality.includes('Irish'))
      //   }
      // }).length
    }
  })

  return counts
}

exports.getApplicationCountsByCandidateResidence = (applications) => {
  const residenceTypes = ['uk','international']
  const counts = {}
  residenceTypes.forEach((type, i) => {
    counts[type] = applications.filter(application => application.contactDetails.addressType === type).length
  })
  return counts
}

exports.getApplicationCountsByCandidateRightToWorkStudy = (applications) => {
  const hasRightToWorkStudy = ['Yes', 'Not yet, or not sure']
  const counts = {}
  hasRightToWorkStudy.forEach((right, i) => {
    counts[right] = applications.filter(application => application.personalDetails.residency.rightToWorkStudy === right).length
  })
  return counts
}

exports.getApplicationCountsByCandidateLanguageAssessment = (applications) => {
  const hasEnglishLanguageQualifictions = ['Yes', 'No', 'Not needed']
  const counts = {}
  hasEnglishLanguageQualifictions.forEach((qualification, i) => {
    counts[qualification] = applications.filter(application => application.englishLanguageQualification.hasQualification === qualification).length
  })
  return counts
}


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

exports.getApplicationCountsV2 = (applications, options) => {
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
