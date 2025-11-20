import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Badge = forwardRef(({ 
  children, 
  className, 
  variant = "default",
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
  
  const variants = {
    default: "bg-slate-100 text-slate-800",
    success: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200",
    warning: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-200",
    error: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-200",
    info: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200",
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
  }
  
  return (
    <span
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
})

Badge.displayName = "Badge"

export default Badge