import React, { useState } from 'react'
import { backendUrl } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { MdDeleteForever } from 'react-icons/md'

const ListMenu = ({ token }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const fetchList = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`, { headers: { token } })
      if (response.data.success) {
        setList(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const promptDelete = (item) => {
    setConfirmDelete(item)
  }

  const cancelDelete = () => {
    setConfirmDelete(null)
  }

  const confirmAndDelete = async () => {
    if (!confirmDelete) return

    try {
      setDeleting(confirmDelete._id)
      const response = await axios.post(
        `${backendUrl}/api/product/remove`, 
        { _id: confirmDelete._id }, 
        { headers: { token } }
      )
      
      if (response.data.success) {
        // Update state after successful deletion
        setList(list.filter(item => item._id !== confirmDelete._id))
        toast.success("Menu item deleted successfully")
      } else {
        toast.error(response.data.message || "Failed to delete menu item")
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Failed to delete menu item")
    } finally {
      setDeleting(null)
      setConfirmDelete(null)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-amber-500 text-xl">Loading menu items...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className='font-bold text-2xl'>Menu List</p>
        <button 
          onClick={fetchList}
          className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
        >
          Refresh
        </button>
      </div>

      <div className='flex flex-col gap-2'>
        <div className='grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center justify-items-center bg-gray-200 p-2 rounded-t-lg border-gray-300 text-lg font-semibold'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {list.length === 0 ? (
          <div className="text-center py-4 bg-gray-100">No menu items found</div>
        ) : (
          list.map((item, index) => (
            <div key={item._id || index} className='grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center justify-items-center bg-gray-100 p-2 border-b border-gray-200 text-lg'>
              <img src={item.image} alt={item.name} className='w-[50px] h-[50px] object-cover rounded-md' />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>£{item.price}</p>
              <div className="flex justify-center items-center">
                <button
                  onClick={() => promptDelete(item)}
                  disabled={deleting === item._id}
                  className="flex items-center justify-center bg-transparent hover:bg-red-100 p-2 rounded-full transition-colors"
                  title="Delete item"
                >
                  <MdDeleteForever className='text-[28px] text-red-700 hover:text-red-800' />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete <span className="font-semibold">{confirmDelete.name}</span> from the menu?
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

export default ListMenu