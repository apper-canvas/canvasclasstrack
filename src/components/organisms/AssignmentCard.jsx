import React from "react"
import { Link } from "react-router-dom"
import { format, isPast } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import DeadlineTimer from "@/components/molecules/DeadlineTimer"

const AssignmentCard = ({ assignment, showSubmissionStatus = false }) => {
  const dueDate = new Date(assignment.dueDate)
  const isOverdue = isPast(dueDate)
  
  const getStatusBadge = () => {
    switch (assignment.status) {
      case "submitted":
        return <Badge variant="success">Submitted</Badge>
      case "overdue":
        return <Badge variant="error">Overdue</Badge>
      case "graded":
        return <Badge variant="info">Graded</Badge>
      default:
        return <Badge variant="warning">Pending</Badge>
    }
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
    <Card className="p-6 hover transition-all duration-300">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">
                {getCourseInitials(assignment.courseName)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-800 mb-1 line-clamp-2">
                {assignment.title}
              </h3>
              <p className="text-sm text-slate-600 mb-2">
                {assignment.courseName}
              </p>
            </div>
          </div>
          {showSubmissionStatus && getStatusBadge()}
        </div>
        
        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-3">
          {assignment.description}
        </p>
        
        {/* Deadline and Points */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <ApperIcon name="Calendar" size={14} />
              <span>Due: {format(dueDate, "MMM dd, yyyy 'at' h:mm a")}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <ApperIcon name="Target" size={14} />
              <span>{assignment.maxPoints} points</span>
            </div>
          </div>
          <DeadlineTimer deadline={assignment.dueDate} />
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <ApperIcon name="FileText" size={12} />
            <span>
              Accepts: {assignment.allowedFileTypes?.slice(0, 2).join(", ")}
              {assignment.allowedFileTypes?.length > 2 && "..."}
            </span>
          </div>
          <Link to={`/assignment/${assignment.Id}`}>
            <Button size="sm" variant={isOverdue ? "secondary" : "primary"}>
              {isOverdue ? "View Details" : "Submit Work"}
              <ApperIcon name="ArrowRight" size={14} className="ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default AssignmentCard