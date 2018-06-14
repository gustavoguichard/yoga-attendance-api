const { populate } = require('feathers-hooks-common')

module.exports = {
  populatePractitioner: populate({ schema: {
    include: {
      service: 'practitioners',
      nameAs: 'practitioner',
      parentField: 'practitionerId',
      childField: '_id',
      query: { $select: ['fullName', 'picture', 'nickName', 'email', 'teacher'] },
      provider: undefined,
    }
  }}),
  populateClassroom: populate({ schema: {
    include: {
      service: 'classrooms',
      nameAs: 'classroom',
      parentField: 'classId',
      childField: '_id',
      query: { $select: ['title', 'teacher', 'regularClass', 'tuition', 'practitioners'] },
      provider: undefined,
    }
  }}),
  populateTeacher: populate({ schema: {
    include: {
      service: 'practitioners',
      nameAs: 'teacherData',
      parentField: 'teacher',
      childField: '_id',
      query: { $select: ['fullName', 'picture', 'nickName', 'email'] },
      provider: undefined,
    }
  }}),
}
