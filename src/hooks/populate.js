const { iff, populate } = require('feathers-hooks-common')

module.exports = {
  populatePractitioners: iff(
    ({ params }) => params.populatePractitioners,
    populate({ schema: {
      include: {
        service: 'practitioners',
        nameAs: 'practitioner',
        parentField: 'practitionerId',
        childField: '_id',
      }
    }})
  ),
  populateClassroom: iff(
    ({ params }) => params.populateClassroom,
    populate({ schema: {
      include: {
        service: 'classrooms',
        nameAs: 'classroom',
        parentField: 'classId',
        childField: '_id',
      }
    }})
  ),
  populateTeacher: populate({ schema: {
    include: {
      service: 'practitioners',
      nameAs: 'teacher',
      parentField: 'teacher',
      childField: '_id',
    }
  }}),
  populateFamily: iff(
    ({ params }) => params.populateFamily,
    populate({ schema: {
      include: {
        service: 'practitioners',
        nameAs: 'family',
        parentField: 'family',
        childField: '_id',
        asArray: true,
      }
    }})
  ),
}
