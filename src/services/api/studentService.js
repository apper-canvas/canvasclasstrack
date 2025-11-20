import studentsData from "@/services/mockData/students.json"

class StudentService {
  constructor() {
    this.students = [...studentsData]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.students]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 250))
    const student = this.students.find(item => item.Id === parseInt(id))
    if (!student) {
      throw new Error(`Student with id ${id} not found`)
    }
    return { ...student }
  }

  async getCurrentStudent() {
    await new Promise(resolve => setTimeout(resolve, 200))
    // Return the first student as the "current" logged-in student
    return { ...this.students[0] }
  }

  async updateProgress(studentId, progressData) {
    await new Promise(resolve => setTimeout(resolve, 350))
    const index = this.students.findIndex(item => item.Id === parseInt(studentId))
    if (index === -1) {
      throw new Error(`Student with id ${studentId} not found`)
    }
    this.students[index] = { ...this.students[index], ...progressData }
    return { ...this.students[index] }
  }

  async getProgressStats(studentId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const student = await this.getById(studentId)
    
    // Simulate progress calculations
    const gradeHistory = [
      { month: "Sep", average: 75 },
      { month: "Oct", average: 78 },
      { month: "Nov", average: 82 },
      { month: "Dec", average: 80 },
      { month: "Jan", average: 82.5 }
    ]
    
    return {
      currentGPA: student.overallGrade,
      completionRate: student.completionRate,
      totalAssignments: 24,
      completedAssignments: 18,
      gradeHistory,
      coursesProgress: [
        { courseName: "Data Structures", grade: 85, completed: 8, total: 10 },
        { courseName: "Database Systems", grade: 88, completed: 6, total: 8 },
        { courseName: "Calculus III", grade: 72, completed: 7, total: 12 },
        { courseName: "Physics II Lab", grade: 80, completed: 4, total: 6 },
        { courseName: "Art History", grade: 90, completed: 3, total: 4 }
      ]
    }
  }
}

export default new StudentService()