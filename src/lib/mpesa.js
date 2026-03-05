/**
 * M-Pesa Payment Integration
 * Handles M-Pesa STK Push for payments
 */

const crypto = require('crypto')

// M-Pesa Configuration
const mpesaConfig = {
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  shortcode: process.env.MPESA_SHORTCODE,
  passkey: process.env.MPESA_PASSKEY,
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://api.safaricom.co.ke' 
    : 'https://sandbox.safaricom.co.ke'
}

/**
 * Generate M-Pesa OAuth Token
 */
async function getOAuthToken() {
  try {
    const auth = Buffer.from(`${mpesaConfig.consumerKey}:${mpesaConfig.consumerSecret}`).toString('base64')
    
    const response = await fetch(`${mpesaConfig.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('Error getting OAuth token:', error)
    throw new Error('Failed to get M-Pesa OAuth token')
  }
}

/**
 * Generate password for M-Pesa API
 */
function generatePassword() {
  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)
  const passwordString = `${mpesaConfig.shortcode}${mpesaConfig.passkey}${timestamp}`
  return Buffer.from(passwordString).toString('base64')
}

/**
 * Initiate M-Pesa STK Push
 */
async function initiateSTKPush(phoneNumber, amount, accountReference, transactionDesc) {
  try {
    const token = await getOAuthToken()
    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)
    const password = generatePassword()

    const requestBody = {
      BusinessShortCode: mpesaConfig.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: phoneNumber,
      PartyB: mpesaConfig.shortcode,
      PhoneNumber: phoneNumber,
      CallBackURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa/callback`,
      AccountReference: accountReference || 'GLADTIDINGS',
      TransactionDesc: transactionDesc || 'Payment for Gladtidings Health',
      TransactionType: 'CustomerPayBillOnline'
    }

    const response = await fetch(`${mpesaConfig.baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    const data = await response.json()
    
    if (data.ResponseCode === '0') {
      return {
        success: true,
        checkoutRequestID: data.CheckoutRequestID,
        merchantRequestID: data.MerchantRequestID,
        responseDescription: data.ResponseDescription
      }
    } else {
      return {
        success: false,
        error: data.ResponseDescription || 'Failed to initiate payment'
      }
    }
  } catch (error) {
    console.error('Error initiating STK Push:', error)
    return {
      success: false,
      error: 'Payment initiation failed'
    }
  }
}

/**
 * Verify M-Pesa transaction
 */
async function verifyTransaction(checkoutRequestID) {
  try {
    const token = await getOAuthToken()
    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)
    const password = generatePassword()

    const requestBody = {
      BusinessShortCode: mpesaConfig.shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestID
    }

    const response = await fetch(`${mpesaConfig.baseUrl}/mpesa/stkpushquery/v1/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    const data = await response.json()
    
    return {
      success: data.ResponseCode === '0',
      resultCode: data.ResultCode,
      resultDesc: data.ResultDesc,
      metadata: data.Metadata
    }
  } catch (error) {
    console.error('Error verifying transaction:', error)
    return {
      success: false,
      error: 'Transaction verification failed'
    }
  }
}

module.exports = {
  initiateSTKPush,
  verifyTransaction,
  getOAuthToken,
  generatePassword
}
