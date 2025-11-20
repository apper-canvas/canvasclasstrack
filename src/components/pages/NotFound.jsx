import React from "react"
import { Link, useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const NotFound = () => {
  const navigate = useNavigate()
  
  const handleGoBack = () => {
    navigate(-1)
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center p-6">
      <div className="max-w-md mx-auto text-center space-y-8">
        {/* 404 Illustration */}
        <div className="space-y-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
            <ApperIcon name="BookX" size={48} className="text-white" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              404
            </h1>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-800">
                Page Not Found
              </h2>
              <p className="text-slate-600 leading-relaxed">
                The page you're looking for doesn't exist or has been moved. 
                Let's get you back to your assignments.
              </p>
            </div>
          </div>
        </div>
        
        {/* Navigation Options */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button variant="primary" className="w-full sm:w-auto">
                <ApperIcon name="Home" size={16} className="mr-2" />
                Go to Dashboard
              </Button>
            </Link>
            
            <Button 
              variant="secondary" 
              onClick={handleGoBack}
              className="w-full sm:w-auto"
            >
              <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
              Go Back
            </Button>
          </div>
          
          <div className="text-sm text-slate-500">
            <p>Or try one of these popular sections:</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Link 
              to="/assignments"
              className="p-3 bg-white rounded-lg border border-slate-200 hover:border-primary hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center space-x-2">
                <ApperIcon name="BookOpen" size={16} className="text-slate-600 group-hover:text-primary" />
                <span className="text-sm font-medium text-slate-700 group-hover:text-primary">
                  Assignments
                </span>
              </div>
            </Link>
            
            <Link 
              to="/grades"
              className="p-3 bg-white rounded-lg border border-slate-200 hover:border-primary hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center space-x-2">
                <ApperIcon name="Award" size={16} className="text-slate-600 group-hover:text-primary" />
                <span className="text-sm font-medium text-slate-700 group-hover:text-primary">
                  Grades
                </span>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Help Section */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <ApperIcon name="HelpCircle" size={20} className="text-slate-500" />
              <span className="font-medium text-slate-700">Need Help?</span>
            </div>
            <p className="text-sm text-slate-600">
              If you believe this is an error, please check the URL or contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound