-- Create payment_attempts table for M-Pesa transactions
CREATE TABLE IF NOT EXISTS payment_attempts (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL,
    checkout_request_id VARCHAR(255) UNIQUE NOT NULL,
    merchant_request_id VARCHAR(255),
    phone_number VARCHAR(20),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    result_code INTEGER,
    result_desc TEXT,
    callback_metadata JSONB,
    mpesa_receipt VARCHAR(255),
    transaction_date VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_attempts_checkout_request_id ON payment_attempts(checkout_request_id);
CREATE INDEX IF NOT EXISTS idx_payment_attempts_order_id ON payment_attempts(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_attempts_status ON payment_attempts(status);
