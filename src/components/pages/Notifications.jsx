import React, { useState, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import NotificationItem from "@/components/organisms/NotificationItem"
import notificationService from "@/services/api/notificationService"

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")
  
  const loadNotifications = async () => {
    try {
      setError("")
      setLoading(true)
      const data = await notificationService.getAll()
      setNotifications(data)
    } catch (err) {
      setError(err.message || "Failed to load notifications")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadNotifications()
  }, [])
  
  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications(prev =>
        prev.map(notification =>
          notification.Id === id ? { ...notification, read: true } : notification
        )
      )
    } catch (err) {
      console.error("Failed to mark notification as read:", err)
    }
  }
  
  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      )
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err)
    }
  }
  
  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadNotifications} />
  
  const filteredNotifications = notifications.filter(notification => {
    if (filter === "unread") return !notification.read
    if (filter === "read") return notification.read
    return true
  })
  
  const unreadCount = notifications.filter(n => !n.read).length
  
  const getNotificationTypeLabel = (type) => {
    switch (type) {
      case "new_submission":
        return "New Submission"
      case "late_submission":
        return "Late Submission"
      case "grade_posted":
        return "Grade Posted"
      default:
        return "Notification"
    }
  }
  
  const getNotificationTypeCount = (type) => {
    return notifications.filter(n => n.type === type).length
  }
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Notifications</h1>
            <p className="text-slate-600 mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          </div>
          
          {unreadCount > 0 && (
            <Button 
              variant="primary" 
              size="sm"
              onClick={handleMarkAllAsRead}
            >
              <ApperIcon name="CheckCheck" size={16} className="mr-2" />
              Mark All as Read
            </Button>
          )}
        </div>
        
        {/* Notification Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                <ApperIcon name="Bell" size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-blue-800">{notifications.length}</p>
                <p className="text-sm text-blue-600">Total</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                <ApperIcon name="Upload" size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-green-800">
                  {getNotificationTypeCount("new_submission")}
                </p>
                <p className="text-sm text-green-600">Submissions</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center">
                <ApperIcon name="AlertTriangle" size={20} className="text-yellow-600" />
              </div>
              <div>
                <p className="font-semibold text-yellow-800">
                  {getNotificationTypeCount("late_submission")}
                </p>
                <p className="text-sm text-yellow-600">Late</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                <ApperIcon name="Award" size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-purple-800">
                  {getNotificationTypeCount("grade_posted")}
                </p>
                <p className="text-sm text-purple-600">Grades</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filter Tabs */}
        <div className="bg-white rounded-lg border border-slate-200 p-2">
          <div className="flex space-x-1">
            {[
              { key: "all", label: "All Notifications" },
              { key: "unread", label: "Unread" },
              { key: "read", label: "Read" }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  filter === tab.key
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-600 hover:text-primary hover:bg-slate-50"
                }`}
              >
                {tab.label}
                {tab.key === "unread" && unreadCount > 0 && (
                  <Badge variant="error" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Empty
          icon="Bell"
          title={filter === "unread" ? "No unread notifications" : "No notifications found"}
          description={
            filter === "unread"
              ? "You're all caught up! No new notifications to review."
              : "Notifications will appear here when there's activity on your assignments."
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.Id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
            />
          ))}
        </div>
      )}
      
      {/* Instructor View Notice */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <ApperIcon name="Info" size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">Instructor Notification Center</h3>
            <p className="text-blue-700 text-sm leading-relaxed">
              This view simulates an instructor's notification panel showing student submission activity. 
              In the actual application, instructors would receive real-time alerts when students submit 
              assignments, enabling quick review and grading workflows.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notifications