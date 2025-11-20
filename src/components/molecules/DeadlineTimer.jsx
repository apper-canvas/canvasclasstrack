import React, { useState, useEffect } from "react"
import { formatDistanceToNow, isPast } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const DeadlineTimer = ({ deadline, className }) => {
  const [timeLeft, setTimeLeft] = useState("")
  const [urgency, setUrgency] = useState("safe")
  
  useEffect(() => {
    const updateTimer = () => {
      if (!deadline) return
      
      const deadlineDate = new Date(deadline)
      const now = new Date()
      const diffMs = deadlineDate.getTime() - now.getTime()
      const diffHours = diffMs / (1000 * 60 * 60)
      const diffDays = diffMs / (1000 * 60 * 60 * 24)
      
      if (isPast(deadlineDate)) {
        setTimeLeft("Overdue")
        setUrgency("overdue")
        return
      }
      
      if (diffHours < 1) {
        setTimeLeft("Less than 1 hour")
        setUrgency("critical")
      } else if (diffHours < 24) {
        setTimeLeft(`${Math.floor(diffHours)} hours`)
        setUrgency("urgent")
      } else if (diffDays < 3) {
        setTimeLeft(formatDistanceToNow(deadlineDate, { addSuffix: true }))
        setUrgency("warning")
      } else {
        setTimeLeft(formatDistanceToNow(deadlineDate, { addSuffix: true }))
        setUrgency("safe")
      }
    }
    
    updateTimer()
    const interval = setInterval(updateTimer, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [deadline])
  
  const getUrgencyStyles = () => {
    switch (urgency) {
      case "overdue":
        return {
          text: "text-red-700",
          bg: "bg-gradient-to-r from-red-100 to-red-200",
          icon: "text-red-600",
          iconName: "AlertCircle"
        }
      case "critical":
        return {
          text: "text-red-700",
          bg: "bg-gradient-to-r from-red-100 to-red-200",
          icon: "text-red-600",
          iconName: "Clock",
          pulse: "animate-pulse-slow"
        }
      case "urgent":
        return {
          text: "text-yellow-700",
          bg: "bg-gradient-to-r from-yellow-100 to-yellow-200",
          icon: "text-yellow-600",
          iconName: "Clock"
        }
      case "warning":
        return {
          text: "text-yellow-700",
          bg: "bg-gradient-to-r from-yellow-100 to-yellow-200",
          icon: "text-yellow-600",
          iconName: "Clock"
        }
      default:
        return {
          text: "text-green-700",
          bg: "bg-gradient-to-r from-green-100 to-green-200",
          icon: "text-green-600",
          iconName: "CheckCircle"
        }
    }
  }
  
  const styles = getUrgencyStyles()
  
  return (
    <div className={cn(
      "inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium border",
      styles.bg,
      styles.text,
      styles.pulse,
      className
    )}>
      <ApperIcon 
        name={styles.iconName} 
        size={12} 
        className={cn(styles.icon, styles.pulse)} 
      />
      <span>{timeLeft}</span>
    </div>
  )
}

export default DeadlineTimer