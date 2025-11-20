import React, { useState, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import AssignmentCard from "@/components/organisms/AssignmentCard"
import assignmentService from "@/services/api/assignmentService"

const Assignments = () => {
  const [assignments, setAssignments] = useState([])
  const [filteredAssignments, setFilteredAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedCourse, setSelectedCourse] = useState("all")
  
  const loadAssignments = async () => {
    try {
      setError("")
      setLoading(true)
      const data = await assignmentService.getAll()
      setAssignments(data)
      setFilteredAssignments(data)
    } catch (err) {
      setError(err.message || "Failed to load assignments")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadAssignments()
  }, [])
  
  useEffect(() => {
    let filtered = [...assignments]
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Filter by status
    if (selectedFilter !== "all") {
      filtered = filtered.filter(assignment => assignment.status === selectedFilter)
    }
    
    // Filter by course
    if (selectedCourse !== "all") {
      filtered = filtered.filter(assignment => assignment.courseId === selectedCourse)
    }
    
    // Sort by due date
    filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    
    setFilteredAssignments(filtered)
  }, [assignments, searchTerm, selectedFilter, selectedCourse])
  
  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadAssignments} />
  
  const filters = [
    { key: "all", label: "All Assignments" },
    { key: "pending", label: "Pending" },
    { key: "submitted", label: "Submitted" },
    { key: "overdue", label: "Overdue" }
  ]
  
  const courses = [
    { key: "all", label: "All Courses" },
    ...Array.from(new Set(assignments.map(a => a.courseId)))
      .map(courseId => {
        const assignment = assignments.find(a => a.courseId === courseId)
        return { key: courseId, label: assignment?.courseName || courseId }
      })
  ]
  
  const getFilterCount = (filterKey) => {
    if (filterKey === "all") return assignments.length
    return assignments.filter(a => a.status === filterKey).length
  }
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Assignments</h1>
            <p className="text-slate-600 mt-1">
              Showing {filteredAssignments.length} of {assignments.length} assignments
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <ApperIcon name="Filter" size={16} />
              <span>Filters active: {[selectedFilter, selectedCourse].filter(f => f !== "all").length}</span>
            </div>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {filters.map(filter => (
                <option key={filter.key} value={filter.key}>
                  {filter.label} ({getFilterCount(filter.key)})
                </option>
              ))}
            </select>
            
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
          
          {/* Active Filters */}
          {(selectedFilter !== "all" || selectedCourse !== "all" || searchTerm) && (
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="text-sm text-slate-600">Active filters:</span>
              {searchTerm && (
                <Badge variant="info" className="flex items-center space-x-1">
                  <span>Search: "{searchTerm}"</span>
                  <button onClick={() => setSearchTerm("")}>
                    <ApperIcon name="X" size={12} />
                  </button>
                </Badge>
              )}
              {selectedFilter !== "all" && (
                <Badge variant="info" className="flex items-center space-x-1">
                  <span>{filters.find(f => f.key === selectedFilter)?.label}</span>
                  <button onClick={() => setSelectedFilter("all")}>
                    <ApperIcon name="X" size={12} />
                  </button>
                </Badge>
              )}
              {selectedCourse !== "all" && (
                <Badge variant="info" className="flex items-center space-x-1">
                  <span>{courses.find(c => c.key === selectedCourse)?.label}</span>
                  <button onClick={() => setSelectedCourse("all")}>
                    <ApperIcon name="X" size={12} />
                  </button>
                </Badge>
              )}
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => {
                  setSearchTerm("")
                  setSelectedFilter("all")
                  setSelectedCourse("all")
                }}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Assignment Grid */}
      {filteredAssignments.length === 0 ? (
        <Empty
          icon="BookOpen"
          title="No assignments found"
          description={assignments.length === 0 
            ? "You don't have any assignments yet." 
            : "No assignments match your current filters. Try adjusting your search criteria."
          }
          actionText={assignments.length > 0 ? "Clear Filters" : undefined}
          onAction={assignments.length > 0 ? () => {
            setSearchTerm("")
            setSelectedFilter("all")
            setSelectedCourse("all")
          } : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard 
              key={assignment.Id} 
              assignment={assignment} 
              showSubmissionStatus={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Assignments