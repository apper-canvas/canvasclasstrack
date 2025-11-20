import React from "react"
import { format } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"

const GradeCard = ({ submission, assignment }) => {
  const percentage = submission.grade ? (submission.grade / assignment.maxPoints * 100) : 0
  
  const getGradeBadge = () => {
    if (percentage >= 90) return <Badge variant="success">A</Badge>
    if (percentage >= 80) return <Badge variant="info">B</Badge>
    if (percentage >= 70) return <Badge variant="warning">C</Badge>
    if (percentage >= 60) return <Badge variant="error">D</Badge>
    return <Badge variant="error">F</Badge>
  }
  
  const getPercentageColor = () => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-red-600"
  }
  
  return (
    <Card className="p-6 hover transition-all duration-300">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800 mb-1">
              {assignment.title}
            </h3>
            <p className="text-sm text-slate-600">
              {assignment.courseName}
            </p>
          </div>
          {getGradeBadge()}
        </div>
        
        {/* Grade Display */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Score</span>
            <span className={`text-2xl font-bold ${getPercentageColor()}`}>
              {submission.grade || "N/A"}/{assignment.maxPoints}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                percentage >= 80 ? "bg-gradient-to-r from-green-400 to-green-500" :
                percentage >= 70 ? "bg-gradient-to-r from-yellow-400 to-yellow-500" :
                "bg-gradient-to-r from-red-400 to-red-500"
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-slate-500">Percentage</span>
            <span className={`text-sm font-semibold ${getPercentageColor()}`}>
              {percentage.toFixed(1)}%
            </span>
          </div>
        </div>
        
        {/* Feedback */}
        {submission.feedback && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <ApperIcon name="MessageSquare" size={16} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Instructor Feedback</span>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
              <p className="text-sm text-slate-700 italic">
                "{submission.feedback}"
              </p>
            </div>
          </div>
        )}
        
        {/* Submission Info */}
        <div className="flex items-center justify-between text-sm text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Upload" size={12} />
              <span>
                Submitted: {format(new Date(submission.submittedAt), "MMM dd, yyyy")}
              </span>
            </div>
            {submission.gradedAt && (
              <div className="flex items-center space-x-1">
                <ApperIcon name="CheckCircle" size={12} />
                <span>
                  Graded: {format(new Date(submission.gradedAt), "MMM dd, yyyy")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default GradeCard