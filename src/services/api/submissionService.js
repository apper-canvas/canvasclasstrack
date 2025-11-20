import submissionsData from "@/services/mockData/submissions.json"

class SubmissionService {
  constructor() {
    this.submissions = [...submissionsData]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.submissions]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 250))
    const submission = this.submissions.find(item => item.Id === parseInt(id))
    if (!submission) {
      throw new Error(`Submission with id ${id} not found`)
    }
    return { ...submission }
  }

  async getByAssignmentId(assignmentId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return this.submissions.filter(s => s.assignmentId === assignmentId.toString())
  }

  async getByStudentId(studentId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return this.submissions.filter(s => s.studentId === studentId)
  }

  async create(submission) {
    await new Promise(resolve => setTimeout(resolve, 500)) // Longer delay for upload simulation
    const maxId = Math.max(...this.submissions.map(s => s.Id), 0)
    const newSubmission = {
      ...submission,
      Id: maxId + 1,
      submittedAt: new Date().toISOString(),
      grade: null,
      feedback: null,
      gradedAt: null
    }
    this.submissions.push(newSubmission)
    return { ...newSubmission }
  }

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 350))
    const index = this.submissions.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Submission with id ${id} not found`)
    }
    this.submissions[index] = { ...this.submissions[index], ...data }
    return { ...this.submissions[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = this.submissions.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Submission with id ${id} not found`)
    }
    const deleted = { ...this.submissions[index] }
    this.submissions.splice(index, 1)
    return deleted
  }

  async submitFile(assignmentId, file) {
    await new Promise(resolve => setTimeout(resolve, 800)) // Simulate file upload
    
    const submission = {
      assignmentId: assignmentId.toString(),
      studentId: "student1",
      studentName: "John Smith",
      fileName: file.name,
      fileUrl: `/uploads/${file.name}`,
      fileSize: file.size
    }
    
    return this.create(submission)
  }

  async getGradedSubmissions() {
    await new Promise(resolve => setTimeout(resolve, 250))
    return this.submissions.filter(s => s.grade !== null)
  }
}

export default new SubmissionService()