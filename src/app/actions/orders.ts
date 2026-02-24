'use server'

import { neon } from '@neondatabase/serverless'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const sql = neon(process.env.DATABASE_URL!)

export interface OrderData {
  customer_name: string
  customer_phone: string
  customer_email: string
  delivery_address: string
  items: Array<{
    id: string
    title: string
    price: number
    quantity: number
    image_url?: string
  }>
  total_amount: number
}

export async function placeOrder(formData: FormData) {
  try {
    // Extract form data
    const customer_name = formData.get('customer_name') as string
    const customer_phone = formData.get('customer_phone') as string
    const customer_email = formData.get('customer_email') as string
    const delivery_address = formData.get('delivery_address') as string
    
    // Get cart items from form (passed as hidden field)
    const itemsJson = formData.get('items') as string
    const items = JSON.parse(itemsJson) as OrderData['items']
    const total_amount = parseFloat(formData.get('total_amount') as string)

    // Validate required fields
    if (!customer_name || !customer_phone || !customer_email || !delivery_address) {
      return {
        success: false,
        error: 'All fields are required'
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customer_email)) {
      return {
        success: false,
        error: 'Please enter a valid email address'
      }
    }

    // Validate phone number (Kenya format: +254XXXXXXXXX or 07XXXXXXXX)
    const phoneRegex = /^(\+254|07)[0-9]{8}$/
    if (!phoneRegex.test(customer_phone.replace(/\s/g, ''))) {
      return {
        success: false,
        error: 'Please enter a valid Kenyan phone number (+254XXXXXXXXX or 07XXXXXXXX)'
      }
    }

    // Generate unique order number
    const order_number = await generateOrderNumber()

    // Insert order into database
    const result = await sql`
      INSERT INTO orders (
        order_number, 
        customer_name, 
        customer_phone, 
        customer_email, 
        delivery_address, 
        items, 
        total_amount, 
        status
      ) VALUES (
        ${order_number},
        ${customer_name},
        ${customer_phone},
        ${customer_email},
        ${delivery_address},
        ${JSON.stringify(items)},
        ${total_amount},
        'pending'
      ) RETURNING id, order_number, created_at
    `

    // Clear the cart (this will be handled client-side)
    // Revalidate the cart page
    revalidatePath('/cart')
    revalidatePath('/checkout')

    return {
      success: true,
      order: result[0],
      message: 'Order placed successfully!'
    }

  } catch (error) {
    console.error('Error placing order:', error)
    return {
      success: false,
      error: 'Failed to place order. Please try again.'
    }
  }
}

async function generateOrderNumber(): Promise<string> {
  try {
    const result = await sql`
      SELECT COALESCE(MAX(CAST(SUBSTRING(order_number, 3) AS INTEGER)), 100000) as max_num
      FROM orders 
      WHERE order_number LIKE 'GT%'
    `
    
    const nextNum = (result[0]?.max_num || 100000) + 1
    return `GT${nextNum.toString().padStart(6, '0')}`
  } catch (error) {
    // Fallback to timestamp-based number
    return `GT${Date.now().toString().slice(-6)}`
  }
}

export async function getOrders() {
  try {
    const orders = await sql`
      SELECT * FROM orders 
      ORDER BY created_at DESC
    `
    return {
      success: true,
      orders
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    return {
      success: false,
      error: 'Failed to fetch orders'
    }
  }
}

export async function getOrderById(orderNumber: string) {
  try {
    const orders = await sql`
      SELECT * FROM orders 
      WHERE order_number = ${orderNumber}
    `
    
    if (orders.length === 0) {
      return {
        success: false,
        error: 'Order not found'
      }
    }

    return {
      success: true,
      order: orders[0]
    }
  } catch (error) {
    console.error('Error fetching order:', error)
    return {
      success: false,
      error: 'Failed to fetch order'
    }
  }
}

export async function updateOrderStatus(orderNumber: string, status: string) {
  try {
    const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return {
        success: false,
        error: 'Invalid status'
      }
    }

    const result = await sql`
      UPDATE orders 
      SET status = ${status}, updated_at = NOW()
      WHERE order_number = ${orderNumber}
      RETURNING *
    `

    if (result.length === 0) {
      return {
        success: false,
        error: 'Order not found'
      }
    }

    revalidatePath('/admin/orders')
    
    return {
      success: true,
      order: result[0]
    }
  } catch (error) {
    console.error('Error updating order status:', error)
    return {
      success: false,
      error: 'Failed to update order status'
    }
  }
}
