'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/orders')
      const data = await response.json()

      if (data.success && data.orders) {
        setOrders(Array.isArray(data.orders) ? data.orders : [])
      } else {
        setError(data.error || 'Failed to fetch orders')
        setOrders([])
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError('Failed to fetch orders')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderNumber, status) => {
    try {
      const response = await fetch(`/api/orders/${orderNumber}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      const data = await response.json()

      if (data.success) {
        // Refresh orders list
        fetchOrders()
      } else {
        setError(data.error || 'Failed to update order status')
      }
    } catch (err) {
      console.error('Error updating order status:', err)
      setError('Failed to update order status')
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-500">
            <div className="text-lg font-medium mb-2">Loading orders...</div>
            <div className="text-sm">Please wait while we fetch your orders</div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-red-500">
            <div className="text-lg font-medium mb-2">Error</div>
            <div className="text-sm mb-4">{error}</div>
            <button
              onClick={fetchOrders}
              className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-500">
            <div className="text-lg font-medium mb-2">No orders found</div>
            <div className="text-sm">Orders will appear here when customers make purchases</div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.order_number} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.order_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customer_phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      KSH {parseFloat(order.total_amount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status || 'pending'}
                          onChange={(e) => updateOrderStatus(order.order_number, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <Link
                          href={`/admin/orders/${order.order_number}`}
                          className="text-emerald-600 hover:text-emerald-900 text-sm"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
