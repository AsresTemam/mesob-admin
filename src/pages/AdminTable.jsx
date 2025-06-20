import React, { useState, useEffect } from 'react'
import { backendUrl } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'

const AdminTable = () => {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const fetchReservations = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${backendUrl}/api/reservations/get`)
      setReservations(response.data.reservations)
    } catch (error) {
      console.log("Error fetching reservations:")
      console.error(error)
      toast.error("Failed to load reservations")
    } finally {
      setLoading(false)
    }
  }

  const promptDelete = (reservation) => {
    setConfirmDelete(reservation)
  }

  const cancelDelete = () => {
    setConfirmDelete(null)
  }

  const confirmAndDelete = async () => {
    if (!confirmDelete) return

    try {
      setDeleting(confirmDelete._id)
      const response = await axios.delete(`${backendUrl}/api/reservations/delete/${confirmDelete._id}`)
      
      if (response.data.success) {
        // Update state after successful deletion
        setReservations(reservations.filter(res => res._id !== confirmDelete._id))
        toast.success("Reservation deleted successfully")
      } else {
        toast.error(response.data.message || "Failed to delete reservation")
      }
    } catch (error) {
      console.log("Error deleting reservation:")
      console.error(error)
      toast.error(error.response?.data?.message || "Failed to delete reservation")
    } finally {
      setDeleting(null)
      setConfirmDelete(null)
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-amber-500 text-xl">Loading reservations...</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen'>
      <h2 className='text-3xl font-bold text-gray-700 text-center mb-6'>Restaurant Reservations</h2>
      
      <div className="mb-4 flex justify-end">
        <button 
          onClick={fetchReservations}
          className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
        >
          Refresh
        </button>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full shadow-lg rounded-xl'>
          <thead>
            <tr className='bg-amber-500 text-left text-white'>
              <th className='p-3'>Name</th>
              <th className='p-3'>Email</th>
              <th className='p-3'>Phone</th>
              <th className='p-3'>Date</th>
              <th className='p-3'>Time</th>
              <th className='p-3'>Guests</th>
              <th className='p-3'>Actions</th>
            </tr>
          </thead>

          <tbody>
            {
              reservations.length === 0 ? (
                <tr><td colSpan="7" className='p-4 text-center'>No reservations found</td></tr>
              ) : (
                reservations.map((res, index) => (
                  <tr key={res._id || index} className='border-b hover:bg-gray-50'>
                    <td className='p-3'>{res.name}</td>
                    <td className='p-3'>{res.email}</td>
                    <td className='p-3'>{res.phone}</td>
                    <td className='p-3'>{res.date}</td>
                    <td className='p-3'>{res.time}</td>
                    <td className='p-3'>{res.guests}</td>
                    <td className='p-3'>
                      <button 
                        onClick={() => promptDelete(res)} 
                        disabled={deleting === res._id}
                        className={`bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed`}
                      >
                        {deleting === res._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))  
              )
            }
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete the reservation for <span className="font-semibold">{confirmDelete.name}</span> on <span className="font-semibold">{confirmDelete.date}</span> at <span className="font-semibold">{confirmDelete.time}</span>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmAndDelete}
                disabled={deleting === confirmDelete._id}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
              >
                {deleting === confirmDelete._id ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminTable