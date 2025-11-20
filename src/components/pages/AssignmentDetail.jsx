import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { format, isPast } from "date-fns"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import DeadlineTimer from "@/components/molecules/DeadlineTimer"
import FileUpload from "@/components/molecules/FileUpload"
import assignmentService from "@/services/api/assignmentService"
import submissionService from "@/services/api/submissionService"

const AssignmentDetail = () => {
  const { id } = useParams()
  const [assignment, setAssignment] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  
  const loadAssignmentData = async () => {
    if (!id) return
    
    try {
      setError("")
      setLoading(true)
      
      const [assignmentData, submissionData] = await Promise.all([
        assignmentService.getById(id),
        submissionService.getByAssignmentId(id)
      ])
      
      setAssignment(assignmentData)
      setSubmissions(submissionData)
    } catch (err) {
      setError(err.message || "Failed to load assignment details")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadAssignmentData()
  }, [id])
  
  const handleFileUpload = async (file) => {
    setSelectedFile(file)
    setShowConfirmModal(true)
  }
  
  const confirmSubmission = async () => {
    if (!selectedFile || !assignment) return
    
    try {
      await submissionService.submitFile(assignment.Id, selectedFile)
      toast.success("Assignment submitted successfully!")
      setShowConfirmModal(false)
      setSelectedFile(null)
      
      // Reload submissions
      const updatedSubmissions = await submissionService.getByAssignmentId(assignment.Id)
      setSubmissions(updatedSubmissions)
      
      // Update assignment status
      await assignmentService.update(assignment.Id, { status: "submitted" })
      setAssignment(prev => ({ ...prev, status: "submitted" }))
      
    } catch (err) {
      toast.error(err.message || "Failed to submit assignment")
    }
  }
  
  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadAssignmentData} />
  if (!assignment) return <ErrorView message="Assignment not found" />
  
  const dueDate = new Date(assignment.dueDate)
  const isOverdue = isPast(dueDate)
  const hasSubmission = submissions.length > 0
  const canSubmit = !isOverdue && !hasSubmission
  
  const getStatusBadge = () => {
    if (hasSubmission) return <Badge variant="success">Submitted</Badge>
    if (isOverdue) return <Badge variant="error">Overdue</Badge>
    return <Badge variant="warning">Pending</Badge>
  }
  
  const getCourseInitials = (courseName) => {
    return courseName
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }
  
  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-slate-600">
        <Link to="/assignments" className="hover:text-primary">Assignments</Link>
        <ApperIcon name="ChevronRight" size={14} />
        <span className="text-slate-800 font-medium">{assignment.title}</span>
      </div>
      
      {/* Assignment Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-lg font-bold text-white">
                {getCourseInitials(assignment.courseName)}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                {assignment.title}
              </h1>
              <p className="text-lg text-slate-600 mb-3">{assignment.courseName}</p>
              <div className="flex items-center space-x-4">
                {getStatusBadge()}
                <DeadlineTimer deadline={assignment.dueDate} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Assignment Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ApperIcon name="Calendar" size={16} className="text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Due Date</span>
            </div>
            <p className="text-lg font-semibold text-slate-800">
              {format(dueDate, "EEEE, MMMM dd, yyyy")}
            </p>
            <p className="text-sm text-slate-600">
              {format(dueDate, "h:mm a")}
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ApperIcon name="Target" size={16} className="text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Points</span>
            </div>
            <p className="text-lg font-semibold text-slate-800">
              {assignment.maxPoints} points
            </p>
            <p className="text-sm text-slate-600">Maximum score</p>
          </div>
          
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ApperIcon name="FileText" size={16} className="text-slate-600" />
              <span className="text-sm font-medium text-slate-700">File Types</span>
            </div>
            <p className="text-lg font-semibold text-slate-800">
              {assignment.allowedFileTypes?.length || 0} types
            </p>
            <p className="text-sm text-slate-600">
              {assignment.allowedFileTypes?.join(", ") || "None specified"}
            </p>
          </div>
        </div>
      </Card>
      
      {/* Assignment Description */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Assignment Description</h2>
        <div className="prose max-w-none">
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {assignment.description}
          </p>
        </div>
      </Card>
      
      {/* Submission Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Upload */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Submit Your Work</h2>
          {hasSubmission ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <ApperIcon name="CheckCircle" size={20} className="text-green-600" />
                  <span className="font-medium text-green-800">Submitted Successfully</span>
                </div>
                <p className="text-green-700">
                  Your assignment has been submitted and is awaiting grading.
                </p>
              </div>
              
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">{submissions[0].fileName}</p>
                    <p className="text-sm text-slate-600">
                      Submitted: {format(new Date(submissions[0].submittedAt), "MMM dd, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <ApperIcon name="FileText" size={24} className="text-slate-400" />
                </div>
              </div>
            </div>
          ) : (
            <FileUpload
              onFileUpload={handleFileUpload}
              allowedTypes={assignment.allowedFileTypes}
              maxSize={assignment.maxFileSize}
              disabled={!canSubmit}
            />
          )}
          
          {isOverdue && !hasSubmission && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <div className="flex items-center space-x-2">
                <ApperIcon name="AlertCircle" size={20} className="text-red-600" />
                <span className="font-medium text-red-800">Submission Deadline Passed</span>
              </div>
              <p className="text-red-700 mt-1">
                The deadline for this assignment has passed. Contact your instructor if you need an extension.
              </p>
            </div>
          )}
        </Card>
        
        {/* Submission Requirements */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Submission Requirements</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <ApperIcon name="FileText" size={16} className="text-slate-600 mt-0.5" />
              <div>
                <p className="font-medium text-slate-800">Accepted File Types</p>
                <p className="text-sm text-slate-600">
                  {assignment.allowedFileTypes?.join(", ") || "All file types accepted"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <ApperIcon name="HardDrive" size={16} className="text-slate-600 mt-0.5" />
              <div>
                <p className="font-medium text-slate-800">Maximum File Size</p>
                <p className="text-sm text-slate-600">
                  {assignment.maxFileSize ? `${(assignment.maxFileSize / 1024 / 1024).toFixed(1)} MB` : "No limit"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <ApperIcon name="Upload" size={16} className="text-slate-600 mt-0.5" />
              <div>
                <p className="font-medium text-slate-800">Submission Method</p>
                <p className="text-sm text-slate-600">Single file upload via web interface</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <ApperIcon name="Clock" size={16} className="text-slate-600 mt-0.5" />
              <div>
                <p className="font-medium text-slate-800">Late Policy</p>
                <p className="text-sm text-slate-600">
                  Submissions are automatically blocked after the deadline
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="AlertTriangle" size={32} className="text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Confirm Submission
              </h3>
              <p className="text-slate-600">
                Are you sure you want to submit this file? This action cannot be undone.
              </p>
            </div>
            
            {selectedFile && (
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="FileText" size={20} className="text-slate-600" />
                  <div>
                    <p className="font-medium text-slate-800">{selectedFile.name}</p>
                    <p className="text-sm text-slate-600">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setShowConfirmModal(false)
                  setSelectedFile(null)
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={confirmSubmission}
              >
                Submit Assignment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AssignmentDetail