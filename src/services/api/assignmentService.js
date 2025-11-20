import assignmentsData from "@/services/mockData/assignments.json"

class AssignmentService {
  constructor() {
    this.assignments = [...assignmentsData]
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.assignments]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 250))
    const assignment = this.assignments.find(item => item.Id === parseInt(id))
    if (!assignment) {
      throw new Error(`Assignment with id ${id} not found`)
    }
    return { ...assignment }
  }

  async create(assignment) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const maxId = Math.max(...this.assignments.map(a => a.Id), 0)
    const newAssignment = {
      ...assignment,
      Id: maxId + 1,
      status: "pending"
    }
    this.assignments.push(newAssignment)
    return { ...newAssignment }
  }

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 350))
    const index = this.assignments.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Assignment with id ${id} not found`)
    }
    this.assignments[index] = { ...this.assignments[index], ...data }
    return { ...this.assignments[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = this.assignments.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Assignment with id ${id} not found`)
    }
    const deleted = { ...this.assignments[index] }
    this.assignments.splice(index, 1)
    return deleted
  }

  async getPending() {
    await new Promise(resolve => setTimeout(resolve, 250))
    return this.assignments.filter(a => a.status === "pending")
  }

  async getUpcoming() {
    await new Promise(resolve => setTimeout(resolve, 250))
    const now = new Date()
    const upcoming = this.assignments.filter(a => {
      const dueDate = new Date(a.dueDate)
      const diffDays = (dueDate - now) / (1000 * 60 * 60 * 24)
      return a.status === "pending" && diffDays <= 7 && diffDays > 0
    })
    return upcoming.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  }
}

export default new AssignmentService()