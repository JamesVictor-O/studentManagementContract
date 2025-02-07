import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("Lock", function () {
 
  async function deployStudentManagement() {
   
    // Contracts are deployed using the first signer/account by default
    const [owner,account1, otherAccount] = await hre.ethers.getSigners();

    const StudentManagement = await hre.ethers.getContractFactory("StudentManagement");
    const studentManagement = await StudentManagement.deploy({ value: hre.ethers.parseEther("1.0") });

    return {studentManagement,  owner, account1, otherAccount };
  }

  describe("RegisterStudent", function () {
    it("Should deploy and set the owner to sender",async function(){
      const{studentManagement,owner, otherAccount}= await loadFixture(deployStudentManagement);
      expect(await studentManagement.owner()).to.eq(owner)
    })

    it("Should check if student is registered", async function(){
      const{studentManagement,owner, otherAccount}= await  loadFixture (deployStudentManagement);
       const studentData={
        name:"james",
        age: 13,
        class: "js3",
        gender:0
       }
    
       await studentManagement.registerStudent(studentData.name,studentData.age, studentData.class,studentData.gender)
       const studentID=await studentManagement.studentsID(0);
       const student=await studentManagement.students(studentID)

       expect(studentID).to.equal(1)
       expect(student.name).to.eq(studentData.name);
       expect(student.age).to.eq(studentData.age);
    })

    it("Should check if only admin can register", async function(){
      const{studentManagement,owner, otherAccount}= await loadFixture(deployStudentManagement);
      const studentData={
       name:"james",
       age: 13,
       class: "js3",
       gender:0
      }
     

      await expect(studentManagement.connect(otherAccount).registerStudent(studentData.name,studentData.age, studentData.class,studentData.gender)).to.be.revertedWith("You are not the admin")
    })

    it("Should Emit CreateStudent Event", async function(){
      const{studentManagement,owner, otherAccount}= await loadFixture(deployStudentManagement);
      const studentData={
       name:"james",
       age: 13,
       class: "js3",
       gender:0
      }
      await expect(studentManagement.registerStudent(studentData.name,studentData.age, studentData.class,studentData.gender)).emit(studentManagement, "CreatedStudent").withArgs(studentData.name,studentData.class,studentData.age)
    })
  });


  describe("GetStudent", function(){
    it("Should Get Student",async function(){
      const{studentManagement,owner, otherAccount}= await loadFixture(deployStudentManagement);
       const studentData={
        name:"james",
        age: 13,
        class: "js3",
        gender:0
       }
       await studentManagement.registerStudent(studentData.name,studentData.age, studentData.class,studentData.gender)
       const studentID=await studentManagement.studentsID(0);
       const student=await studentManagement.getStudent(studentID);

       expect(student.name).to.eq(studentData.name)
    })
  })

  describe("Get Students", function(){
    it("Should test for student Array more than two", async function(){
      const{studentManagement,owner, otherAccount}= await loadFixture(deployStudentManagement);
      const studentData={
       name:"james",
       age: 13,
       class: "js3",
       gender:0
      }

      await studentManagement.registerStudent(studentData.name,studentData.age, studentData.class,studentData.gender)
      await studentManagement.registerStudent(studentData.name,studentData.age, studentData.class,studentData.gender)
     const students= await studentManagement.getStudents();

     expect(students.length).to.equal(2)
    
    })

    it("Should Return Empty Array When No Student",async function(){
      const{studentManagement,owner, otherAccount}= await loadFixture(deployStudentManagement);
     const students=await studentManagement.getStudents();

      expect(students.length).to.equal(0)
    })
  })

  describe("Enroll",function(){
    it("Should Enroll Student", async function(){
      const{studentManagement,owner, otherAccount}= await loadFixture(deployStudentManagement);
       const Enroll={
        student:"james",
        course:2
       }
       const studentData={
        name:"james",
        age: 13,
        class: "js3",
        gender:0
       }
 
       await studentManagement.registerStudent(studentData.name,studentData.age, studentData.class,studentData.gender)

       const studentID=await studentManagement.studentsID(0);


      await studentManagement.enrollCourse(studentID, Enroll.course)

      const enrolledCourse = await studentManagement.courses(studentID);

      
      expect(enrolledCourse.name).to.eq(Enroll.student);
    })

    it("Only Owner Can Enroll Student", async function () {
      const{studentManagement,owner,account1, otherAccount}= await loadFixture(deployStudentManagement);
      const Enroll={
       student:"james",
       course:2
      }
      const studentData={
       name:"james",
       age: 13,
       class: "js3",
       gender:0
      }

      await studentManagement.registerStudent(studentData.name,studentData.age, studentData.class,studentData.gender)


      const studentID=await studentManagement.studentsID(0);

     await expect(studentManagement.connect(account1).enrollCourse(studentID, Enroll.course)).to.revertedWith("You are not the admin")
    })
  })
  



});
