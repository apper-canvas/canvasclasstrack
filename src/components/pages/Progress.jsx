import React, { useState, useEffect } from "react"
import Chart from "react-apexcharts"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import ProgressRing from "@/components/molecules/ProgressRing"
import studentService from "@/services/api/studentService"

const Progress = () => {
  const [progressData, setProgressData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  const loadProgressData = async () => {
    try {
      setError("")
      setLoading(true)
      const data = await studentService.getProgressStats(1)
      setProgressData(data)
    } catch (err) {
      setError(err.message || "Failed to load progress data")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadProgressData()
  }, [])
  
  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadProgressData} />
  if (!progressData) return <ErrorView message="No progress data available" />
  
  // Chart configurations
  const gradeHistoryChart = {
    series: [{
      name: "Average Grade",
      data: progressData.gradeHistory.map(item => item.average)
    }],
    options: {
      chart: {
        type: "line",
        height: 300,
        toolbar: { show: false },
        background: "transparent"
      },
      stroke: {
        curve: "smooth",
        width: 3,
        colors: ["#2563eb"]
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.1,
          gradientToColors: ["#3b82f6"],
          stops: [0, 100]
        }
      },
      markers: {
        size: 6,
        colors: ["#2563eb"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: { size: 8 }
      },
      grid: {
        borderColor: "#e2e8f0",
        strokeDashArray: 0,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } }
      },
      xaxis: {
        categories: progressData.gradeHistory.map(item => item.month),
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: { colors: "#64748b", fontSize: "12px" }
        }
      },
      yaxis: {
        min: 0,
        max: 100,
        labels: {
          style: { colors: "#64748b", fontSize: "12px" },
          formatter: (value) => `${value}%`
        }
      },
      tooltip: {
        theme: "light",
        y: { formatter: (value) => `${value}%` }
      }
    }
  }
  
  const coursesProgressChart = {
    series: progressData.coursesProgress.map(course => course.grade),
    options: {
      chart: {
        type: "donut",
        height: 300
      },
      labels: progressData.coursesProgress.map(course => course.courseName),
      colors: ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
      plotOptions: {
        pie: {
          donut: {
            size: "60%",
            labels: {
              show: true,
              total: {
                show: true,
                label: "Overall",
                fontSize: "14px",
                fontWeight: 600,
                color: "#374151",
                formatter: () => `${progressData.currentGPA}%`
              }
            }
          }
        }
      },
      legend: {
        position: "bottom",
        fontSize: "12px",
        fontWeight: 500,
        markers: { width: 8, height: 8, radius: 4 }
      },
      tooltip: {
        y: { formatter: (value) => `${value}%` }
      }
    }
  }
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">Academic Progress</h1>
        <p className="text-slate-600">Track your performance across all courses</p>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Current GPA</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                {progressData.currentGPA}%
              </p>
            </div>
            <ProgressRing percentage={progressData.currentGPA} size={60} />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Completion Rate</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                {progressData.completionRate}%
              </p>
            </div>
            <ProgressRing percentage={progressData.completionRate} size={60} color="success" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Total Assignments</p>
              <p className="text-3xl font-bold text-slate-800">{progressData.totalAssignments}</p>
              <p className="text-xs text-slate-500 mt-1">Across all courses</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="BookOpen" size={24} className="text-purple-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-slate-800">{progressData.completedAssignments}</p>
              <p className="text-xs text-slate-500 mt-1">
                {progressData.totalAssignments - progressData.completedAssignments} remaining
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={24} className="text-blue-600" />
            </div>
          </div>
        </Card>
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade History Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Grade Trend</h3>
              <p className="text-sm text-slate-600">Monthly average performance</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span>Average Grade</span>
            </div>
          </div>
          <Chart
            options={gradeHistoryChart.options}
            series={gradeHistoryChart.series}
            type="line"
            height={300}
          />
        </Card>
        
        {/* Course Performance Chart */}
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-800">Course Performance</h3>
            <p className="text-sm text-slate-600">Grade distribution by course</p>
          </div>
          <Chart
            options={coursesProgressChart.options}
            series={coursesProgressChart.series}
            type="donut"
            height={300}
          />
        </Card>
      </div>
      
      {/* Course Progress Details */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Course Progress Details</h3>
        <div className="space-y-4">
          {progressData.coursesProgress.map((course, index) => {
            const completionPercentage = (course.completed / course.total) * 100
            
            return (
              <div key={index} className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-800">{course.courseName}</h4>
                    <p className="text-sm text-slate-600">
                      {course.completed} of {course.total} assignments completed
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-800">{course.grade}%</p>
                    <p className="text-sm text-slate-600">Current Grade</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Completion Progress</span>
                    <span className="font-medium text-slate-800">
                      {completionPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
      
      {/* Performance Insights */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="TrendingUp" size={32} className="text-green-600" />
            </div>
            <h4 className="font-semibold text-slate-800 mb-2">Improving Trend</h4>
            <p className="text-sm text-slate-600">
              Your grades have improved by 7.5% over the last 3 months
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Award" size={32} className="text-blue-600" />
            </div>
            <h4 className="font-semibold text-slate-800 mb-2">Top Performer</h4>
            <p className="text-sm text-slate-600">
              Database Systems is your strongest course at 88% average
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Target" size={32} className="text-yellow-600" />
            </div>
            <h4 className="font-semibold text-slate-800 mb-2">Focus Area</h4>
            <p className="text-sm text-slate-600">
              Consider spending more time on Calculus III assignments
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Progress