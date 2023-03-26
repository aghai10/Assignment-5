const fs = require("fs");

class Data {
constructor(students, courses) {
this.students = students;
this.courses = courses;
}
}

let dataCollection = null;

module.exports.initialize = function () {
return new Promise((resolve, reject) => {
fs.readFile("./data/courses.json", "utf8", (err, courseData) => {
if (err) {
reject("unable to load courses");
return;
}

  fs.readFile("./data/students.json", "utf8", (err, studentData) => {
    if (err) {
      reject("unable to load students");
      return;
    }

    dataCollection = new Data(
      JSON.parse(studentData),
      JSON.parse(courseData)
    );
    resolve();
  });
});
});
};

module.exports.getAllStudents = function () {
return new Promise((resolve, reject) => {
if (dataCollection.students.length === 0) {
reject("query returned 0 results");
return;
}


resolve(dataCollection.students);
});
};

module.exports.getTAs = function () {
return new Promise(function (resolve, reject) {
var filteredStudents = [];


for (let i = 0; i < dataCollection.students.length; i++) {
  if (dataCollection.students[i].TA === true) {
    filteredStudents.push(dataCollection.students[i]);
  }
}

if (filteredStudents.length === 0) {
  reject("query returned 0 results");
  return;
}

resolve(filteredStudents);
});
};

module.exports.getCourses = function () {
return new Promise((resolve, reject) => {
if (dataCollection.courses.length === 0) {
reject("query returned 0 results");
return;
}


resolve(dataCollection.courses);
});
};

module.exports.getStudentByNum = function (num) {
return new Promise(function (resolve, reject) {
const foundStudent = dataCollection.students.find(
(student) => student.studentNum === num
);


if (!foundStudent) {
  reject("no results returned");
  return;
}

resolve(foundStudent);
});
};

module.exports.getStudentsByCourse = function (course) {
return new Promise(function (resolve, reject) {
const filteredStudents = dataCollection.students.filter(
(student) => student.course === course
);


if (filteredStudents.length === 0) {
  reject("no results returned");
  return;
}

resolve(filteredStudents);
});
};

module.exports.addStudent = function (studentData) {
return new Promise(function (resolve, reject) {
if (studentData.TA === undefined) {
studentData.TA = false;
} else {
studentData.TA = true;
}
studentData.studentNum = dataCollection.students.length + 1;
dataCollection.students.push(studentData);
resolve();
});
};

module.exports.getCourseById = function (id) {
return new Promise(function (resolve, reject) {
const foundCourse = dataCollection.courses.find(
(course) => course.courseId === id
);


if (!foundCourse) {
  reject("query returned 0 results");
  return;
}

resolve(foundCourse);
});
};
    module.exports.updateStudent = function (studentData) {
      return new Promise(function (resolve, reject) {
        const studentIndex = dataCollection.students.findIndex(
          (student) => student.studentNum === studentData.studentNum
        );
    
        if (studentIndex === -1) {
          reject("no results returned");
          return;
        }
    
        // update the student record with new data
        const updatedStudent = Object.assign({}, dataCollection.students[studentIndex]);
        updatedStudent.firstName = studentData.firstName;
        updatedStudent.lastName = studentData.lastName;
        updatedStudent.course = studentData.course;
        updatedStudent.address = studentData.address;
        updatedStudent.email = studentData.email;
        updatedStudent.TA = studentData.TA === "on";
    
        dataCollection.students[studentIndex] = updatedStudent;
        resolve();
      });
    };
    
