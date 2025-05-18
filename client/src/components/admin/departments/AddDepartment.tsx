import React, { useState } from 'react'
import { Save, ArrowLeft, Briefcase, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'  // Add this import at the top

export default function AddDepartment() {
  const [departmentName, setDepartmentName] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const navigate = useNavigate();  // Add this line

  // Handle form submission
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    
    if (!departmentName.trim()) {
      setFormError('Department name is required')
      return
    }
    
    setIsSubmitting(true)
    setFormError('')
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authentication token not found')
      }

      const response = await fetch('http://localhost:5000/api/department/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: departmentName,
          description: description
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add department')
      }
      
      // Success handling
      setIsSubmitting(false)
      setDepartmentName('')
      setDescription('')
      
      // Show success message
      alert('Department added successfully!')
      
      // Update navigation
      navigate('/admin-dashboard/departments')  // Use navigate instead of window.history.back()
      
    } catch (error) {
      console.error('Error adding department:', error)
      setFormError(
        error instanceof Error ? error.message : 'Failed to add department. Please try again.'
      )
      setIsSubmitting(false)
    }
  }

  // Navigate back function
  const handleGoBack = () => {
    if (window.confirm('Are you sure you want to go back? Any unsaved changes will be lost.')) {
      navigate('/admin-dashboard/departments')  // Use navigate instead of window.history.back()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header with back button */}
        <div className="mb-8 flex items-center">
          <button
            onClick={handleGoBack}
            className="mr-4 p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center">
            <Briefcase className="mr-3 text-blue-600" size={24} />
            <h1 className="text-2xl font-bold text-gray-800">Add New Department</h1>
          </div>
        </div>

        {/* Main form card */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          {formError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start">
              <AlertCircle className="mr-2 flex-shrink-0 mt-0.5" size={18} />
              <p>{formError}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="departmentName" className="block text-sm font-medium text-gray-700 mb-2">
                Department Name <span className="text-red-500">*</span>
              </label>
              <input
                id="departmentName"
                type="text"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Enter department name"
                required
              />
              <p className="mt-1 text-xs text-gray-500">This will be displayed across the entire system</p>
            </div>

            <div className="mb-8">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Provide a description of this department's function and purpose"
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleGoBack}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center transition-colors duration-200 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Add Department
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}