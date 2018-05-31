const { populate } = require('feathers-hooks-common')

module.exports = {
  populatePractitioner: populate({ schema: {
    include: {
      service: 'practitioners',
      nameAs: 'practitioner',
      parentField: 'practitionerId',
      childField: '_id',
      provider: undefined,
    }
  }}),
  populateClassroom: populate({ schema: {
    include: {
      service: 'classrooms',
      nameAs: 'classroom',
      parentField: 'classId',
      childField: '_id',
      provider: undefined,
    }
  }}),
  populateTeacher: populate({ schema: {
    include: {
      service: 'practitioners',
      nameAs: 'teacherData',
      parentField: 'teacher',
      childField: '_id',
      provider: undefined,
    }
  }}),
  populateFamily: populate({ schema: {
    include: {
      service: 'practitioners',
      nameAs: 'familyData',
      parentField: 'family',
      childField: '_id',
      provider: undefined,
      asArray: true,
    }
  }}),
}
