-- Create analytics tables for Glad Tidings tracking
-- This will track user registrations, appointment bookings, and newsletter signups

-- Create analytics_events table for tracking all events
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    user_id UUID,
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create daily_aggregates table for performance optimization
CREATE TABLE IF NOT EXISTS daily_aggregates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_registrations table for detailed tracking
CREATE TABLE IF NOT EXISTS user_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    registration_date DATE NOT NULL,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    acquisition_channel VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create appointment_analytics table for booking tracking
CREATE TABLE IF NOT EXISTS appointment_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL,
    user_id UUID NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    conversion_time INTEGER, -- Time from first visit to booking in minutes
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    device_type VARCHAR(50),
    browser VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create newsletter_analytics table for signup tracking
CREATE TABLE IF NOT EXISTS newsletter_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscriber_id UUID NOT NULL,
    signup_date DATE NOT NULL,
    signup_source VARCHAR(100), -- Where they signed up (footer, popup, etc.)
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    conversion_time INTEGER, -- Time from first visit to signup in minutes
    device_type VARCHAR(50),
    browser VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create funnels table for tracking conversion funnels
CREATE TABLE IF NOT EXISTS conversion_funnels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    funnel_name VARCHAR(100) NOT NULL,
    step_name VARCHAR(100) NOT NULL,
    step_number INTEGER NOT NULL,
    users_count INTEGER NOT NULL DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_aggregates_date_metric ON daily_aggregates(date, metric_name);
CREATE INDEX IF NOT EXISTS idx_user_registrations_date ON user_registrations(registration_date);
CREATE INDEX IF NOT EXISTS idx_appointment_analytics_date ON appointment_analytics(booking_date);
CREATE INDEX IF NOT EXISTS idx_newsletter_analytics_date ON newsletter_analytics(signup_date);
CREATE INDEX IF NOT EXISTS idx_conversion_funnels_date_step ON conversion_funnels(date, step_number);

-- Add foreign key constraints
ALTER TABLE analytics_events 
ADD CONSTRAINT analytics_events_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE user_registrations 
ADD CONSTRAINT user_registrations_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE appointment_analytics 
ADD CONSTRAINT appointment_analytics_appointment_id_fkey 
FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
ADD CONSTRAINT appointment_analytics_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE newsletter_analytics 
ADD CONSTRAINT newsletter_analytics_subscriber_id_fkey 
FOREIGN KEY (subscriber_id) REFERENCES newsletter_subscribers(id) ON DELETE CASCADE;

-- Create function to track analytics events
CREATE OR REPLACE FUNCTION track_analytics_event(
    p_event_type VARCHAR(50),
    p_event_data JSONB DEFAULT '{}',
    p_user_id UUID DEFAULT NULL,
    p_session_id VARCHAR(255) DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_referrer TEXT DEFAULT NULL,
    p_utm_source TEXT DEFAULT NULL,
    p_utm_medium TEXT DEFAULT NULL,
    p_utm_campaign TEXT DEFAULT NULL,
    p_utm_term TEXT DEFAULT NULL,
    p_utm_content TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO analytics_events (
        event_type, event_data, user_id, session_id, ip_address, 
        user_agent, referrer, utm_source, utm_medium, 
        utm_campaign, utm_term, utm_content
    ) VALUES (
        p_event_type, p_event_data, p_user_id, p_session_id, p_ip_address,
        p_user_agent, p_referrer, p_utm_source, p_utm_medium,
        p_utm_campaign, p_utm_term, p_utm_content
    ) RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to update daily aggregates
CREATE OR REPLACE FUNCTION update_daily_aggregate(
    p_date DATE,
    p_metric_name VARCHAR(100),
    p_increment INTEGER DEFAULT 1
) RETURNS VOID AS $$
BEGIN
    INSERT INTO daily_aggregates (date, metric_name, metric_value)
    VALUES (p_date, p_metric_name, p_increment)
    ON CONFLICT (date, metric_name) 
    DO UPDATE SET 
        metric_value = daily_aggregates.metric_value + p_increment,
        updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Create function to get user registration analytics
CREATE OR REPLACE FUNCTION get_registration_analytics(
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL,
    p_group_by VARCHAR(20) DEFAULT 'day' -- day, week, month
) RETURNS TABLE (
    date DATE,
    registrations INTEGER,
    referrers JSONB,
    utm_sources JSONB,
    acquisition_channels JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ur.registration_date as date,
        COUNT(*) as registrations,
        jsonb_agg(DISTINCT ur.referrer) as referrers,
        jsonb_agg(DISTINCT ur.utm_source) as utm_sources,
        jsonb_agg(DISTINCT ur.acquisition_channel) as acquisition_channels
    FROM user_registrations ur
    WHERE (p_start_date IS NULL OR ur.registration_date >= p_start_date)
    AND (p_end_date IS NULL OR ur.registration_date <= p_end_date)
    GROUP BY 
        CASE 
            WHEN p_group_by = 'day' THEN ur.registration_date
            WHEN p_group_by = 'week' THEN date_trunc('week', ur.registration_date)
            WHEN p_group_by = 'month' THEN date_trunc('month', ur.registration_date)
        END
    ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get appointment analytics
CREATE OR REPLACE FUNCTION get_appointment_analytics(
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL,
    p_group_by VARCHAR(20) DEFAULT 'day'
) RETURNS TABLE (
    date DATE,
    bookings INTEGER,
    conversions INTEGER,
    conversion_rate DECIMAL(5,2),
    service_types JSONB,
    avg_conversion_time INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        aa.booking_date as date,
        COUNT(*) as bookings,
        COUNT(*) FILTER (WHERE aa.status = 'approved') as conversions,
        CASE 
            WHEN COUNT(*) > 0 THEN 
                ROUND((COUNT(*) FILTER (WHERE aa.status = 'approved')::DECIMAL / COUNT(*) * 100), 2)
            ELSE 0 
        END as conversion_rate,
        jsonb_agg(DISTINCT aa.service_type) as service_types,
        AVG(aa.conversion_time) as avg_conversion_time
    FROM appointment_analytics aa
    WHERE (p_start_date IS NULL OR aa.booking_date >= p_start_date)
    AND (p_end_date IS NULL OR aa.booking_date <= p_end_date)
    GROUP BY 
        CASE 
            WHEN p_group_by = 'day' THEN aa.booking_date
            WHEN p_group_by = 'week' THEN date_trunc('week', aa.booking_date)
            WHEN p_group_by = 'month' THEN date_trunc('month', aa.booking_date)
        END
    ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get newsletter analytics
CREATE OR REPLACE FUNCTION get_newsletter_analytics(
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL,
    p_group_by VARCHAR(20) DEFAULT 'day'
) RETURNS TABLE (
    date DATE,
    signups INTEGER,
    signup_sources JSONB,
    avg_conversion_time INTEGER,
    referrers JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        na.signup_date as date,
        COUNT(*) as signups,
        jsonb_agg(DISTINCT na.signup_source) as signup_sources,
        AVG(na.conversion_time) as avg_conversion_time,
        jsonb_agg(DISTINCT na.referrer) as referrers
    FROM newsletter_analytics na
    WHERE (p_start_date IS NULL OR na.signup_date >= p_start_date)
    AND (p_end_date IS NULL OR na.signup_date <= p_end_date)
    GROUP BY 
        CASE 
            WHEN p_group_by = 'day' THEN na.signup_date
            WHEN p_group_by = 'week' THEN date_trunc('week', na.signup_date)
            WHEN p_group_by = 'month' THEN date_trunc('month', na.signup_date)
        END
    ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get funnel analytics
CREATE OR REPLACE FUNCTION get_funnel_analytics(
    p_funnel_name VARCHAR(100),
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
) RETURNS TABLE (
    step_name VARCHAR(100),
    step_number INTEGER,
    users_count INTEGER,
    conversion_rate DECIMAL(5,2),
    dropoff_rate DECIMAL(5,2)
) AS $$
DECLARE
    total_users INTEGER;
BEGIN
    -- Get total users for first step
    SELECT users_count INTO total_users
    FROM conversion_funnels 
    WHERE funnel_name = p_funnel_name 
    AND step_number = 1
    AND (p_start_date IS NULL OR date >= p_start_date)
    AND (p_end_date IS NULL OR date <= p_end_date);
    
    RETURN QUERY
    SELECT 
        cf.step_name,
        cf.step_number,
        cf.users_count,
        cf.conversion_rate,
        CASE 
            WHEN total_users > 0 THEN 
                ROUND(((total_users - cf.users_count)::DECIMAL / total_users * 100), 2)
            ELSE 0 
        END as dropoff_rate
    FROM conversion_funnels cf
    WHERE cf.funnel_name = p_funnel_name
    AND (p_start_date IS NULL OR cf.date >= p_start_date)
    AND (p_end_date IS NULL OR cf.date <= p_end_date)
    ORDER BY cf.step_number;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data for testing
INSERT INTO analytics_events (event_type, event_data) VALUES
    ('page_view', '{"page": "/home", "title": "Home"}'),
    ('user_registration', '{"source": "organic", "campaign": "spring2024"}'),
    ('appointment_booking', '{"service": "consultation", "status": "pending"}'),
    ('newsletter_signup', '{"source": "footer", "campaign": "welcome"}')
ON CONFLICT DO NOTHING;

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE ON analytics_events TO your_app_user;
-- GRANT SELECT, INSERT, UPDATE ON daily_aggregates TO your_app_user;
-- GRANT SELECT, INSERT, UPDATE ON user_registrations TO your_app_user;
-- GRANT SELECT, INSERT, UPDATE ON appointment_analytics TO your_app_user;
-- GRANT SELECT, INSERT, UPDATE ON newsletter_analytics TO your_app_user;
-- GRANT SELECT, INSERT, UPDATE ON conversion_funnels TO your_app_user;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Comments for documentation
COMMENT ON TABLE analytics_events IS 'Tracks all analytics events for user behavior tracking';
COMMENT ON TABLE daily_aggregates IS 'Pre-calculated daily metrics for performance';
COMMENT ON TABLE user_registrations IS 'Detailed tracking of user registrations with acquisition data';
COMMENT ON TABLE appointment_analytics IS 'Analytics for appointment bookings and conversions';
COMMENT ON TABLE newsletter_analytics IS 'Analytics for newsletter signups and engagement';
COMMENT ON TABLE conversion_funnels IS 'Tracks user progression through conversion funnels';

-- Create scheduled cleanup job (if using pg_cron extension)
-- Uncomment if you have pg_cron installed
-- SELECT cron.schedule('cleanup-analytics-events', '0 2 * * *', 'DELETE FROM analytics_events WHERE created_at < CURRENT_TIMESTAMP - INTERVAL ''90 days'';');
