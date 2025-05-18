import React, { useState, useEffect } from 'react'
import { Save, ArrowLeft, Briefcase, AlertCircle } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'

export default function EditDepartment() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [departmentName, setDepartmentName] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    fetchDepartment()
  }, [id])

  const fetchDepartment = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/department/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setDepartmentName(data.department.name)
        setDescription(data.department.description || '')
      }
    } catch (error) {
      console.error('Error fetching department:', error)
      setFormError('Failed to load department details')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!departmentName.trim()) {
      setFormError('Department name is required')
      return
    }
    
    setIsSubmitting(true)
    setFormError('')
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/department/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: departmentName,
          description
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message)
      }
      
      navigate('/admin-dashboard/departments')
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to update department')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-center">
          <button
            onClick={() => navigate('/admin-dashboard/departments')}
            className="mr-4 p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center">
            <Briefcase className="mr-3 text-blue-600" size={24} />
            <h1 className="text-2xl font-bold text-gray-800">Edit Department</h1>
          </div>
        </div>

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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-8">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/admin-dashboard/departments')}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Update Department
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
