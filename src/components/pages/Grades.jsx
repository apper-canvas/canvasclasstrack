import React, { useState, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import Input from "@/components/atoms/Input"
import Badge from "@/components/atoms/Badge"
import Card from "@/components/atoms/Card"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import GradeCard from "@/components/organisms/GradeCard"
import submissionService from "@/services/api/submissionService"
import assignmentService from "@/services/api/assignmentService"

const Grades = () => {
  const [submissions, setSubmissions] = useState([])
  const [assignments, setAssignments] = useState([])
  const [filteredGrades, setFilteredGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("all")
  const [gradeStats, setGradeStats] = useState({})
  
  const loadGradesData = async () => {
    try {
      setError("")
      setLoading(true)
      
      const [submissionsData, assignmentsData] = await Promise.all([
        submissionService.getGradedSubmissions(),
        assignmentService.getAll()
      ])
      
      setSubmissions(submissionsData)
      setAssignments(assignmentsData)
      
      // Calculate grade statistics
      if (submissionsData.length > 0) {
        const grades = submissionsData.map(sub => {
          const assignment = assignmentsData.find(a => a.Id.toString() === sub.assignmentId)
          return assignment ? (sub.grade / assignment.maxPoints) * 100 : 0
        })
        
        const average = grades.reduce((sum, grade) => sum + grade, 0) / grades.length
        const highest = Math.max(...grades)
        const lowest = Math.min(...grades)
        
        setGradeStats({
          average: average.toFixed(1),
          highest: highest.toFixed(1),
          lowest: lowest.toFixed(1),
          total: submissionsData.length
        })
      }
      
    } catch (err) {
      setError(err.message || "Failed to load grades")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadGradesData()
  }, [])
  
  useEffect(() => {
    let filtered = [...submissions]
    
    // Filter by search term
    if (searchTerm && assignments.length > 0) {
      filtered = filtered.filter(submission => {
        const assignment = assignments.find(a => a.Id.toString() === submission.assignmentId)
        return assignment && (
          assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }
    
    // Filter by course
    if (selectedCourse !== "all" && assignments.length > 0) {
      filtered = filtered.filter(submission => {
        const assignment = assignments.find(a => a.Id.toString() === submission.assignmentId)
        return assignment && assignment.courseId === selectedCourse
      })
    }
    
    // Sort by graded date (most recent first)
    filtered.sort((a, b) => new Date(b.gradedAt) - new Date(a.gradedAt))
    
    setFilteredGrades(filtered)
  }, [submissions, assignments, searchTerm, selectedCourse])
  
  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadGradesData} />
  
  const courses = [
    { key: "all", label: "All Courses" },
    ...Array.from(new Set(assignments.map(a => a.courseId)))
      .map(courseId => {
        const assignment = assignments.find(a => a.courseId === courseId)
        return { key: courseId, label: assignment?.courseName || courseId }
      })
  ]
  
  const getGradeDistribution = () => {
    if (submissions.length === 0) return { A: 0, B: 0, C: 0, D: 0, F: 0 }
    
    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 }
    
    submissions.forEach(sub => {
      const assignment = assignments.find(a => a.Id.toString() === sub.assignmentId)
      if (assignment) {
        const percentage = (sub.grade / assignment.maxPoints) * 100
        if (percentage >= 90) distribution.A++
        else if (percentage >= 80) distribution.B++
        else if (percentage >= 70) distribution.C++
        else if (percentage >= 60) distribution.D++
        else distribution.F++
      }
    })
    
    return distribution
  }
  
  const gradeDistribution = getGradeDistribution()
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Grades</h1>
            <p className="text-slate-600 mt-1">
              {submissions.length} graded assignment{submissions.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        
        {/* Grade Statistics */}
        {submissions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Average Grade</p>
                  <p className="text-3xl font-bold text-slate-800">{gradeStats.average}%</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Award" size={24} className="text-blue-600" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Highest Grade</p>
                  <p className="text-3xl font-bold text-green-600">{gradeStats.highest}%</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="TrendingUp" size={24} className="text-green-600" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Lowest Grade</p>
                  <p className="text-3xl font-bold text-red-600">{gradeStats.lowest}%</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="TrendingDown" size={24} className="text-red-600" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Total Graded</p>
                  <p className="text-3xl font-bold text-slate-800">{gradeStats.total}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="FileCheck" size={24} className="text-purple-600" />
                </div>
              </div>
            </Card>
          </div>
        )}
        
        {/* Grade Distribution */}
        {submissions.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Grade Distribution</h3>
            <div className="grid grid-cols-5 gap-4">
              {Object.entries(gradeDistribution).map(([grade, count]) => (
                <div key={grade} className="text-center">
                  <div className="text-2xl font-bold text-slate-800 mb-1">{count}</div>
                  <Badge 
                    variant={
                      grade === "A" ? "success" :
                      grade === "B" ? "info" :
                      grade === "C" ? "warning" :
                      "error"
                    }
                  >
                    Grade {grade}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
        
        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search by assignment or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {courses.map(course => (
                <option key={course.key} value={course.key}>
                  {course.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Grades List */}
      {filteredGrades.length === 0 ? (
        <Empty
          icon="Award"
          title={submissions.length === 0 ? "No graded assignments yet" : "No grades found"}
          description={
            submissions.length === 0
              ? "Your graded assignments will appear here once your instructor has reviewed your submissions."
              : "No grades match your current search criteria. Try adjusting your filters."
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGrades.map((submission) => {
            const assignment = assignments.find(a => a.Id.toString() === submission.assignmentId)
            return assignment ? (
              <GradeCard
                key={submission.Id}
                submission={submission}
                assignment={assignment}
              />
            ) : null
          })}
        </div>
      )}
    </div>
  )
}

export default Grades