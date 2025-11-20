import React from "react"

const Loading = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full animate-pulse"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse"></div>
          <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-3/4 animate-pulse"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm border animate-pulse">
            <div className="space-y-4">
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse"></div>
              <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-2/3 animate-pulse"></div>
              <div className="flex justify-between items-center">
                <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/3 animate-pulse"></div>
                <div className="h-6 w-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Loading