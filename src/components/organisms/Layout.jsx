import React, { useState } from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  
  const navigation = [
    { name: "Dashboard", href: "/", icon: "Home" },
    { name: "Assignments", href: "/assignments", icon: "BookOpen" },
    { name: "Grades", href: "/grades", icon: "Award" },
    { name: "Progress", href: "/progress", icon: "TrendingUp" },
    { name: "Notifications", href: "/notifications", icon: "Bell" }
  ]
  
  const isActive = (href) => {
    if (href === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(href)
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-white border-r border-slate-200 backdrop-blur-lg">
          <div className="flex items-center flex-shrink-0 px-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  ClassTrack
                </h1>
                <p className="text-xs text-slate-500">Student Portal</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex-1 flex flex-col">
            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive(item.href)
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-primary border-l-4 border-primary"
                      : "text-slate-600 hover:text-primary hover:bg-slate-50"
                  )}
                >
                  <ApperIcon
                    name={item.icon}
                    size={20}
                    className={cn(
                      "mr-3 transition-colors",
                      isActive(item.href) ? "text-primary" : "text-slate-400 group-hover:text-primary"
                    )}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* User Info */}
            <div className="flex-shrink-0 p-4">
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">JS</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">John Smith</p>
                    <p className="text-xs text-slate-500 truncate">Computer Science</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-40 bg-slate-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed inset-0 z-50 flex">
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-transform duration-300 ease-in-out translate-x-0">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ApperIcon name="X" size={24} className="text-white" />
                </button>
              </div>
              
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                      <ApperIcon name="GraduationCap" size={20} className="text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        ClassTrack
                      </h1>
                      <p className="text-xs text-slate-500">Student Portal</p>
                    </div>
                  </div>
                </div>
                
                <nav className="mt-8 px-4 space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive(item.href)
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-primary border-l-4 border-primary"
                          : "text-slate-600 hover:text-primary hover:bg-slate-50"
                      )}
                    >
                      <ApperIcon
                        name={item.icon}
                        size={20}
                        className={cn(
                          "mr-3 transition-colors",
                          isActive(item.href) ? "text-primary" : "text-slate-400 group-hover:text-primary"
                        )}
                      />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              
              {/* Mobile User Info */}
              <div className="flex-shrink-0 p-4">
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">JS</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">John Smith</p>
                      <p className="text-xs text-slate-500 truncate">Computer Science</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                ClassTrack
              </h1>
            </div>
            <button
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <ApperIcon name="Menu" size={24} />
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout