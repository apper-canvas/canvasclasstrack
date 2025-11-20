import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  icon = "BookOpen", 
  title = "No items found", 
  description = "There are no items to display at this time.",
  actionText,
  onAction
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-6">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} size={40} className="text-blue-600" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-slate-800">
            {title}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {description}
          </p>
        </div>
        
        {actionText && onAction && (
          <Button 
            onClick={onAction}
            className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            {actionText}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Empty