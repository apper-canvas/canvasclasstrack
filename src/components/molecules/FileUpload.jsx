import React, { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { cn } from "@/utils/cn"

const FileUpload = ({ 
  onFileUpload, 
  allowedTypes = [".pdf", ".doc", ".docx", ".txt"],
  maxSize = 5 * 1024 * 1024, // 5MB
  disabled = false
}) => {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState("")
  
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError("")
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      if (rejection.errors[0]?.code === "file-too-large") {
        setError(`File size must be less than ${maxSize / 1024 / 1024}MB`)
      } else if (rejection.errors[0]?.code === "file-invalid-type") {
        setError(`File type not allowed. Accepted types: ${allowedTypes.join(", ")}`)
      }
      return
    }
    
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setSelectedFile(file)
    }
  }, [allowedTypes, maxSize])
  
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: allowedTypes.reduce((acc, type) => {
      acc[`application/${type.slice(1)}`] = [type]
      return acc
    }, {}),
    maxSize,
    multiple: false,
    disabled
  })
  
  const handleUpload = async () => {
    if (!selectedFile) return
    
    setIsUploading(true)
    setUploadProgress(0)
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)
    
    try {
      await onFileUpload(selectedFile)
      setUploadProgress(100)
      setTimeout(() => {
        setIsUploading(false)
        setSelectedFile(null)
        setUploadProgress(0)
      }, 500)
    } catch (err) {
      setError(err.message || "Upload failed")
      setIsUploading(false)
      setUploadProgress(0)
    }
    
    clearInterval(progressInterval)
  }
  
  const removeFile = () => {
    setSelectedFile(null)
    setError("")
  }
  
  if (disabled) {
    return (
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50">
        <ApperIcon name="Lock" size={32} className="mx-auto text-slate-400 mb-3" />
        <p className="text-slate-500">Submission deadline has passed</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer",
          isDragActive && !isDragReject ? "border-primary bg-blue-50" : "",
          isDragReject ? "border-red-400 bg-red-50" : "",
          !isDragActive && !isDragReject ? "border-slate-300 hover:border-slate-400 hover:bg-slate-50" : ""
        )}
      >
        <input {...getInputProps()} />
        
        {selectedFile ? (
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="FileText" size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-slate-800">{selectedFile.name}</p>
              <p className="text-sm text-slate-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            {isUploading && (
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
            <div className="flex gap-2 justify-center">
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                size="sm"
                variant="success"
              >
                {isUploading ? "Uploading..." : "Upload File"}
              </Button>
              <Button
                onClick={removeFile}
                disabled={isUploading}
                size="sm"
                variant="secondary"
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="Upload" size={24} className="text-slate-500" />
            </div>
            <div>
              <p className="font-medium text-slate-800">
                {isDragActive ? "Drop your file here" : "Choose file or drag & drop"}
              </p>
              <p className="text-sm text-slate-500">
                Accepted formats: {allowedTypes.join(", ")} (max {maxSize / 1024 / 1024}MB)
              </p>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <ApperIcon name="AlertCircle" size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  )
}

export default FileUpload