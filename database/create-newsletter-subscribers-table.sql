-- Create newsletter_subscribers table for Glad Tidings email newsletter
-- This table stores email addresses for marketing communications

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_subscribed_at ON newsletter_subscribers(subscribed_at);

-- Add check constraints
ALTER TABLE newsletter_subscribers 
ADD CONSTRAINT newsletter_subscribers_email_not_null CHECK (email IS NOT NULL),
ADD CONSTRAINT newsletter_subscribers_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
ADD CONSTRAINT newsletter_subscribers_subscribed_at_not_null CHECK (subscribed_at IS NOT NULL);

-- Create function to add newsletter subscriber
CREATE OR REPLACE FUNCTION add_newsletter_subscriber(subscriber_email VARCHAR(255))
RETURNS JSON AS $$
DECLARE
    subscriber_id UUID;
    is_new_subscriber BOOLEAN := TRUE;
BEGIN
    -- Check if email already exists
    SELECT id INTO subscriber_id 
    FROM newsletter_subscribers 
    WHERE email = subscriber_email;
    
    IF subscriber_id IS NOT NULL THEN
        -- Email already subscribed
        RETURN json_build_object(
            'success', false,
            'message', 'Email is already subscribed to the newsletter',
            'subscriber_id', subscriber_id
        );
    END IF;
    
    -- Insert new subscriber
    INSERT INTO newsletter_subscribers (email)
    VALUES (subscriber_email)
    RETURNING id INTO subscriber_id;
    
    RETURN json_build_object(
        'success', true,
        'message', 'Successfully subscribed to newsletter',
        'subscriber_id', subscriber_id
    );
END;
$$ LANGUAGE plpgsql;

-- Create function to remove newsletter subscriber
CREATE OR REPLACE FUNCTION remove_newsletter_subscriber(subscriber_email VARCHAR(255))
RETURNS JSON AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM newsletter_subscribers 
    WHERE email = subscriber_email;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    IF deleted_count = 0 THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Email not found in newsletter subscribers'
        );
    END IF;
    
    RETURN json_build_object(
        'success', true,
        'message', 'Successfully unsubscribed from newsletter',
        'deleted_count', deleted_count
    );
END;
$$ LANGUAGE plpgsql;

-- Create function to get all newsletter subscribers
CREATE OR REPLACE FUNCTION get_newsletter_subscribers(
    limit_count INTEGER DEFAULT 100,
    offset_count INTEGER DEFAULT 0,
    subscribed_after TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    email VARCHAR(255),
    subscribed_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ns.id,
        ns.email,
        ns.subscribed_at
    FROM newsletter_subscribers ns
    WHERE (subscribed_after IS NULL OR ns.subscribed_at >= subscribed_after)
    ORDER BY ns.subscribed_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to get subscriber count
CREATE OR REPLACE FUNCTION get_newsletter_subscriber_count()
RETURNS INTEGER AS $$
DECLARE
    subscriber_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO subscriber_count
    FROM newsletter_subscribers;
    
    RETURN COALESCE(subscriber_count, 0);
END;
$$ LANGUAGE plpgsql;

-- Create function to check if email is subscribed
CREATE OR REPLACE FUNCTION is_email_subscribed(subscriber_email VARCHAR(255))
RETURNS BOOLEAN AS $$
DECLARE
    subscriber_exists BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM newsletter_subscribers 
        WHERE email = subscriber_email
    ) INTO subscriber_exists;
    
    RETURN COALESCE(subscriber_exists, FALSE);
END;
$$ LANGUAGE plpgsql;

-- Create function to cleanup old subscribers (if needed)
CREATE OR REPLACE FUNCTION cleanup_newsletter_subscribers(days_to_keep INTEGER DEFAULT 365)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM newsletter_subscribers 
    WHERE subscribed_at < CURRENT_TIMESTAMP - INTERVAL '1 day' * days_to_keep;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Insert sample subscribers for testing
INSERT INTO newsletter_subscribers (email) VALUES
    ('john.doe@example.com'),
    ('jane.smith@example.com'),
    ('michael.johnson@example.com'),
    ('sarah.williams@example.com'),
    ('david.brown@example.com')
ON CONFLICT (email) DO NOTHING;

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, DELETE ON newsletter_subscribers TO your_app_user;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Comments for documentation
COMMENT ON TABLE newsletter_subscribers IS 'Stores email addresses for newsletter subscriptions';
COMMENT ON COLUMN newsletter_subscribers.id IS 'Unique identifier for each subscriber';
COMMENT ON COLUMN newsletter_subscribers.email IS 'Email address of the subscriber (unique)';
COMMENT ON COLUMN newsletter_subscribers.subscribed_at IS 'When the subscriber was added to the newsletter';

-- Create scheduled cleanup job (if using pg_cron extension)
-- Uncomment if you have pg_cron installed
-- SELECT cron.schedule('cleanup-newsletter-subscribers', '0 3 * * 0', 'SELECT cleanup_newsletter_subscribers(365);');
