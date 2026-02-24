-- Create orders table for Glad Tidings Health
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    delivery_address TEXT NOT NULL,
    items JSONB NOT NULL, -- Array of cart items
    total_amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on order_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Function to generate unique order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    order_num TEXT;
    base_num TEXT := 'GT'; -- Glad Tidings prefix
    sequence_num TEXT;
BEGIN
    -- Get next sequence value
    sequence_num := LPAD(NEXTVAL('orders_order_number_seq')::TEXT, 6, '0');
    order_num := base_num || sequence_num;
    
    -- Ensure uniqueness (very rare collision)
    WHILE EXISTS (SELECT 1 FROM orders WHERE order_number = order_num) LOOP
        sequence_num := LPAD(NEXTVAL('orders_order_number_seq')::TEXT, 6, '0');
        order_num := base_num || sequence_num;
    END LOOP;
    
    RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS orders_order_number_seq START 100001;

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to orders table
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
