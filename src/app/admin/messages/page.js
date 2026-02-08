'use client'

import { useState } from 'react'
;
;export default function MessagesManagement() {
  const [selectedMessages, setSelectedMessages] = useState([])
  const [viewMessage, setViewMessage] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock message data
  const messages = [
    {
      id: 1,
      senderName: 'John Doe',
      email: 'john.doe@example.com',
      subject: 'Prayer Request for Healing',
      message: 'Dear Pastor,\n\nI am writing to request prayers for my mother who has been diagnosed with a serious illness. She has been in the hospital for the past two weeks and the doctors are doing everything they can, but we believe in the power of prayer and would appreciate your spiritual support.\n\nThank you for your prayers and support.\n\nGod bless,\nJohn Doe',
      date: '2024-01-29',
      time: '10:30 AM',
      status: 'unread',
      category: 'Prayer Request'
    },
    {
      id: 2,
      senderName: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      subject: 'Volunteer for Medical Mission',
      message: 'Greetings,\n\nI am a registered nurse with 5 years of experience and I would love to volunteer for your upcoming medical mission in February. I have experience in community health outreach and have participated in similar missions before.\n\nPlease let me know how I can get involved and what the requirements are.\n\nThank you,\nSarah Johnson',
      date: '2024-01-29',
      time: '09:15 AM',
      status: 'read',
      category: 'Volunteer'
    },
    {
      id: 3,
      senderName: 'Michael Chen',
      email: 'michael.chen@email.com',
      subject: 'Testimony Request',
      message: 'Dear Glad Tidings Team,\n\nI would like to share my testimony of how your ministry has impacted my life. I was struggling with addiction for many years and through your counseling and prayer support, I have been clean for over a year now.\n\nI would be honored if you could share my story to encourage others who might be going through similar struggles.\n\nIn His Grace,\nMichael Chen',
      date: '2024-01-28',
      time: '03:45 PM',
      status: 'read',
      category: 'Testimony'
    },
    {
      id: 4,
      senderName: 'Emily Rodriguez',
      email: 'emily.r@email.com',
      subject: 'Donation Inquiry',
      message: 'Greetings,\n\nI am interested in making a donation to support your medical missionary work. Could you please provide information about how I can contribute and what specific needs you currently have?\n\nI would also like to know if there are any specific projects or campaigns I can support directly.\n\nThank you for your work in the community.\n\nBlessings,\nEmily',
      date: '2024-01-28',
      time: '02:20 PM',
      status: 'unread',
      category: 'Donation'
    },
    {
      id: 5,
      senderName: 'David Kim',
      email: 'david.kim@email.com',
      subject: 'Question About Sunday Services',
      message: 'Greetings,\n\nI am new to the area and would like to know more about your Sunday service times and locations. I see you have multiple services but I\'m not sure which one would be best for someone new to the church.\n\nAlso, do you have any programs for young adults?\n\nThank you,\nDavid Kim',
      date: '2024-01-27',
      time: '11:30 AM',
      status: 'read',
      category: 'General Inquiry'
    },
    {
      id: 6,
      senderName: 'Lisa Thompson',
      email: 'lisa.thompson@email.com',
      subject: 'Partnership Proposal',
      message: 'Dear Pastor,\n\nI represent a local business that would like to partner with your ministry for community outreach programs. We have resources and volunteers that could support your medical missions and other initiatives.\n\nWould you be available for a meeting next week to discuss potential collaboration opportunities?\n\nLooking forward to hearing from you.\n\nBest regards,\nLisa Thompson\nCommunity Outreach Coordinator',
      date: '2024-01-27',
      time: '08:45 AM',
      status: 'unread',
      category: 'Partnership'
    },
    {
      id: 7,
      senderName: 'Robert Wilson',
      email: 'robert.w@email.com',
      subject: 'Counseling Services',
      message: 'Greetings,\n\nI am going through a difficult time in my marriage and I heard that you offer counseling services. Could you please provide information about your counseling programs and how I can schedule an appointment?\n\nI would appreciate your guidance during this challenging period.\n\nThank you,\nRobert Wilson',
      date: '2024-01-26',
      time: '04:30 PM',
      status: 'read',
      category: 'Counseling'
    },
    {
      id: 8,
      senderName: 'Anonymous',
      email: 'confidential@email.com',
      subject: 'Confidential Prayer Request',
      message: 'Dear Pastor,\n\nI am writing anonymously because I need prayer for a very sensitive family situation. My brother is struggling with depression and has refused to seek help. I am very worried about him and don\'t know what to do.\n\nPlease pray for wisdom and guidance for our family.\n\nThank you for your understanding and prayers.\n\nConcerned Sister',
      date: '2024-01-26',
      time: '07:15 PM',
      status: 'unread',
      category: 'Prayer Request'
    }
  ]

  // Filter messages
  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSelectMessage = (messageId) => {
    setSelectedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    )
  }

  const handleSelectAll = () => {
    if (selectedMessages.length === filteredMessages.length) {
      setSelectedMessages([])
    } else {
      setSelectedMessages(filteredMessages.map(message => message.id))
    }
  }

  const handleMarkAsRead = (messageId) => {
    }

  const handleMarkAsUnread = (messageId) => {
    }

  const handleBulkMarkAsRead = () => {
    setSelectedMessages([])
  }

  const handleBulkMarkAsUnread = () => {
    setSelectedMessages([])
  }

  const getStatusBadge = (status) => {
    return status === 'unread' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-gray-100 text-gray-800'
  }

  const getCategoryBadge = (category) => {
    const colors = {
      'Prayer Request': 'bg-purple-100 text-purple-800',
      'Volunteer': 'bg-emerald-100 text-emerald-800',
      'Testimony': 'bg-pink-100 text-pink-800',
      'Donation': 'bg-yellow-100 text-yellow-800',
      'General Inquiry': 'bg-gray-100 text-gray-800',
      'Partnership': 'bg-indigo-100 text-indigo-800',
      'Counseling': 'bg-orange-100 text-orange-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const handleView = (message) => {
    setViewMessage(message)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Manage incoming messages, prayer requests, and communications</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {messages.filter(m => m.status === 'unread').length} unread
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search messages by name, email, or subject..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:w-48">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedMessages.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedMessages.length} selected
              </span>
              <button
                onClick={handleBulkMarkAsRead}
                className="px-3 py-1.5 text-sm bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
              >
                Mark as Read
              </button>
              <button
                onClick={handleBulkMarkAsUnread}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Mark as Unread
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    checked={selectedMessages.length === filteredMessages.length && filteredMessages.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Sender</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Subject</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <tr 
                  key={message.id} 
                  className={`hover:bg-gray-50 ${message.status === 'unread' ? 'bg-blue-50' : ''}`}
                >
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      checked={selectedMessages.includes(message.id)}
                      onChange={() => handleSelectMessage(message.id)}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{message.senderName}</div>
                      <div className="text-xs text-gray-500">{message.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryBadge(message.category)}`}>
                        {message.category}
                      </span>
                      <div className="text-sm text-gray-900 truncate max-w-xs">{message.subject}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{message.date}</div>
                    <div className="text-xs text-gray-500">{message.time}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(message.status)}`}>
                      {message.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(message)}
                        className="text-emerald-600 hover:text-emerald-900 text-sm font-medium"
                      >
                        View
                      </button>
                      {message.status === 'unread' ? (
                        <button
                          onClick={() => handleMarkAsRead(message.id)}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          Mark as Read
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarkAsUnread(message.id)}
                          className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                        >
                          Mark as Unread
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Message Modal */}
      {viewMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Message Details</h2>
                <button
                  onClick={() => setViewMessage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Message Header */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{viewMessage.subject}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryBadge(viewMessage.category)}`}>
                        {viewMessage.category}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(viewMessage.status)}`}>
                        {viewMessage.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>From: <span className="font-medium text-gray-900">{viewMessage.senderName}</span> &lt;{viewMessage.email}&gt;</p>
                    <p>Date: {viewMessage.date} at {viewMessage.time}</p>
                  </div>
                </div>
              </div>
              
              {/* Message Content */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Message:</h4>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{viewMessage.message}</p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {viewMessage.status === 'unread' && (
                    <button
                      onClick={() => handleMarkAsRead(viewMessage.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => handleMarkAsUnread(viewMessage.id)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    Mark as Unread
                  </button>
                </div>
                <button
                  onClick={() => setViewMessage(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
