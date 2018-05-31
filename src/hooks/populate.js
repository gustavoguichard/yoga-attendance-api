const { populate } = require('feathers-hooks-common')

module.exports = {
  populatePractitioner: populate({ schema: {
    include: {
      service: 'practitioners',
      nameAs: 'practitioner',
      parentField: 'practitionerId',
      childField: '_id',
    }
  }}),
  populateClassroom: populate({ schema: {
    include: {
      service: 'classrooms',
      nameAs: 'classroom',
      parentField: 'classId',
      childField: '_id',
    }
  }}),
  populateTeacher: populate({ schema: {
    include: {
      service: 'practitioners',
      nameAs: 'teacherData',
      parentField: 'teacher',
      childField: '_id',
    }
  }}),
  populateFamily: populate({ schema: {
    include: {
      service: 'practitioners',
      nameAs: 'familyData',
      parentField: 'family',
      childField: '_id',
      asArray: true,
    }
  }}),
}
