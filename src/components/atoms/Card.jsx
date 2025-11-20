import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Card = forwardRef(({ 
  children, 
  className, 
  hover = false,
  ...props 
}, ref) => {
  const baseClasses = "bg-white rounded-lg shadow-sm border border-slate-200 backdrop-blur-sm"
  const hoverClasses = hover ? "hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer" : ""
  
  return (
    <div
      ref={ref}
      className={cn(
        baseClasses,
        hoverClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = "Card"

export default Card