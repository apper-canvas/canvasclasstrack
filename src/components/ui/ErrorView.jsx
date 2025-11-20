import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const ErrorView = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-6">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" size={32} className="text-red-600" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-slate-800">
            Oops! Something went wrong
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {message}
          </p>
        </div>
        
        {onRetry && (
          <Button 
            onClick={onRetry}
            className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  )
}

export default ErrorView