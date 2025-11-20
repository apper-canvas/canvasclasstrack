import React from "react"
import { formatDistanceToNow } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const getNotificationIcon = () => {
    switch (notification.type) {
      case "new_submission":
        return "Upload"
      case "late_submission":
        return "AlertTriangle"
      case "grade_posted":
        return "Award"
      default:
        return "Bell"
    }
  }
  
  const getNotificationColor = () => {
    switch (notification.type) {
      case "new_submission":
        return "text-blue-600"
      case "late_submission":
        return "text-red-600"
      case "grade_posted":
        return "text-green-600"
      default:
        return "text-slate-600"
    }
  }
  
  const getNotificationMessage = () => {
    switch (notification.type) {
      case "new_submission":
        return `New submission received from ${notification.studentName} for "${notification.assignmentTitle}"`
      case "late_submission":
        return `Late submission from ${notification.studentName} for "${notification.assignmentTitle}"`
      case "grade_posted":
        return `Grade posted for "${notification.assignmentTitle}"`
      default:
        return "Notification"
    }
  }
  
  const handleClick = () => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.Id)
    }
  }
  
  return (
    <Card 
      className={`p-4 cursor-pointer transition-all duration-200 ${
        !notification.read ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          !notification.read 
            ? "bg-gradient-to-br from-blue-100 to-blue-200" 
            : "bg-gradient-to-br from-slate-100 to-slate-200"
        }`}>
          <ApperIcon 
            name={getNotificationIcon()} 
            size={20} 
            className={!notification.read ? "text-blue-600" : "text-slate-500"} 
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <p className={`text-sm ${!notification.read ? "font-medium text-slate-800" : "text-slate-600"}`}>
              {getNotificationMessage()}
            </p>
            {!notification.read && (
              <Badge variant="primary" className="ml-2 flex-shrink-0">
                New
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
            <span>
              {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
            </span>
            <div className="flex items-center space-x-1">
              <ApperIcon name="User" size={12} />
              <span>{notification.studentName}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default NotificationItem