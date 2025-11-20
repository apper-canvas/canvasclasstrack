import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      title: "Pending Assignments",
      value: stats?.pendingAssignments || 0,
      icon: "BookOpen",
      color: "blue",
      trend: "+2 this week"
    },
    {
      title: "Upcoming Deadlines",
      value: stats?.upcomingDeadlines || 0,
      icon: "Clock",
      color: "yellow",
      trend: "Next in 2 days"
    },
    {
      title: "Current GPA",
      value: stats?.currentGPA || "0.0",
      icon: "Award",
      color: "green",
      trend: "+0.3 from last month"
    },
    {
      title: "Completion Rate",
      value: `${stats?.completionRate || 0}%`,
      icon: "TrendingUp",
      color: "purple",
      trend: "Above average"
    }
  ]
  
  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "bg-gradient-to-br from-blue-100 to-blue-200",
        icon: "text-blue-600",
        text: "text-blue-700"
      },
      yellow: {
        bg: "bg-gradient-to-br from-yellow-100 to-yellow-200",
        icon: "text-yellow-600",
        text: "text-yellow-700"
      },
      green: {
        bg: "bg-gradient-to-br from-green-100 to-green-200",
        icon: "text-green-600",
        text: "text-green-700"
      },
      purple: {
        bg: "bg-gradient-to-br from-purple-100 to-purple-200",
        icon: "text-purple-600",
        text: "text-purple-700"
      }
    }
    return colors[color] || colors.blue
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const colors = getColorClasses(stat.color)
        
        return (
          <Card key={index} className="p-6 hover">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 mb-1">
                  {stat.title}
                </p>
                <div className="flex items-baseline space-x-2">
                  <h3 className="text-3xl font-bold text-slate-800">
                    {stat.value}
                  </h3>
                </div>
                <p className={`text-xs mt-2 ${colors.text}`}>
                  {stat.trend}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.bg}`}>
                <ApperIcon name={stat.icon} size={24} className={colors.icon} />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

export default DashboardStats