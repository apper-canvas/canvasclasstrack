import React, { useState, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import DashboardStats from "@/components/organisms/DashboardStats"
import AssignmentCard from "@/components/organisms/AssignmentCard"
import assignmentService from "@/services/api/assignmentService"
import studentService from "@/services/api/studentService"

const Dashboard = () => {
  const [upcomingAssignments, setUpcomingAssignments] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  const loadDashboardData = async () => {
    try {
      setError("")
      setLoading(true)
      
      const [assignments, student, pendingAssignments] = await Promise.all([
        assignmentService.getUpcoming(),
        studentService.getCurrentStudent(),
        assignmentService.getPending()
      ])
      
      setUpcomingAssignments(assignments)
      setStats({
        pendingAssignments: pendingAssignments.length,
        upcomingDeadlines: assignments.length,
        currentGPA: student.overallGrade,
        completionRate: student.completionRate
      })
    } catch (err) {
      setError(err.message || "Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadDashboardData()
  }, [])
  
  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadDashboardData} />
  
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening"
  
  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {greeting}, John!
            </h1>
            <p className="text-blue-100 text-lg">
              You have {stats?.upcomingDeadlines || 0} assignments due this week
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <ApperIcon name="BookOpen" size={40} className="text-white" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <DashboardStats stats={stats} />
      
      {/* Upcoming Assignments */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Upcoming Assignments</h2>
            <p className="text-slate-600">Due within the next 7 days</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <ApperIcon name="Clock" size={16} />
            <span>Sorted by deadline</span>
          </div>
        </div>
        
        {upcomingAssignments.length === 0 ? (
          <Empty
            icon="CheckCircle"
            title="All caught up!"
            description="You don't have any assignments due in the next week. Great job staying on top of your work!"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingAssignments.map((assignment) => (
              <AssignmentCard 
                key={assignment.Id} 
                assignment={assignment} 
                showSubmissionStatus={true}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <ApperIcon name="BookOpen" size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">View All Assignments</p>
                <p className="text-sm text-slate-600">See your complete assignment list</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                <ApperIcon name="Award" size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">Check Grades</p>
                <p className="text-sm text-slate-600">View your recent grades and feedback</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">View Progress</p>
                <p className="text-sm text-slate-600">Track your academic progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard