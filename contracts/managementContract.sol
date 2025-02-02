// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract StudentManagement {
    address owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the admin");
        _;
    }

    enum Gender{ Male, Female }
    enum EnrollCourse { science, art, commercial}
    enum Subjects {English, Mathmathics, Biology, Chemistry,Music}

    mapping (uint256 => string) name;
    mapping(uint8 => Student) students;
    // maping for enroling students with the key been a uint8 which is the student is and the value being a struct
    mapping(uint8 => Enroll) public courses;

    // mapping for paying student school fees, key will be the student is while value will be about being sent.
    mapping(uint8 => uint) public schoolFess;

    // maping for grading of students
    mapping(uint => Grade) public grading;
    

    uint[] public studentsID;

    // Events
    event CreatedStudent(
        string indexed  name,
        string indexed class,
        uint8 indexed age
    );

    // event for school fess payment

    event paymentOfFess(
        address indexed sender,
        uint  indexed  amount
    );

    

    struct Student {
        string name;
        uint8 age;
        string class;
        bool isEnrolled;
        Gender gender;
    }
    struct Enroll{
        string name;
        EnrollCourse course; 
    }

    struct Grade{
        string name;
        uint8  scores;
        Subjects suject;
    }
    
    uint8 studentId = 0;
    // Student[] allStudents;
    

    function registerStudent(
        string memory _name,
        uint8 _age,
        string memory _class,
        Gender _gender
    ) external onlyOwner {

        Student memory student = Student({
            name: _name,
            age: _age,
            class: _class,
            isEnrolled: true,
            gender: _gender
        });

        
        studentId++;
        students[studentId] = student;
        studentsID.push(studentId);

        

        emit CreatedStudent(_name, _class, _age);
    }



    function getStudent(uint8 _studentId) public view  returns (Student memory student_) {
        student_ = students[_studentId];
    }

    function getStudents() public view  returns (Student[] memory students_) {
        students_ = new Student[](studentId);

       for (uint8 i = 1; i <= studentId; i++) {
        students_[i - 1] = students[i];
       }

       students_;
    }
    //  enroll student for a particular class
    function enrollCourse(uint8 _studentId, EnrollCourse course)public returns(string memory student) {
         student=students[_studentId].name;
         Enroll memory enrollStudent=Enroll(student,course);

         courses[_studentId]= enrollStudent;
    }

    // pay students school fees

    function payFess(uint8 _studentID)public payable  {
        require(msg.value > 0, "insufficient funds");

         schoolFess[_studentID] += msg.value;

         emit  paymentOfFess(msg.sender, msg.value);
    }

    // grade student

    function gradeStudent(uint8 _studentId, Subjects _subject, uint8 _scores) public {
       require(students[_studentId].isEnrolled, "Student is not enrolled");
       string memory studentName= students[_studentId].name;
       Grade memory grade = Grade(studentName,_scores,_subject);
       grading[_studentId]=grade;
    }
   
}