const SystemHelper = require('./system')

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
      counts[subject.name][organisation] = applications.filter(application => application.subject === subject.name && application.provider === organisation).length
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

    }

    if (country.region === 'row') {

      counts['Rest of world'] += applications.filter(application => {
        return application.personalDetails.nationality.includes(country.nationality) && !(application.personalDetails.nationality.includes('British') || application.personalDetails.nationality.includes('Irish'))
      }).length

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