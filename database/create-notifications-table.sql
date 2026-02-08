-- Create notifications table for Glad Tidings user notifications
-- This table stores user notifications with read/unread status

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint to users table
ALTER TABLE notifications 
ADD CONSTRAINT notifications_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES users(id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read_created ON notifications(user_id, read, created_at);

-- Create trigger to automatically update created_at (if needed)
CREATE OR REPLACE FUNCTION update_notifications_created_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.created_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Note: Only add trigger if you want to auto-update created_at on updates
-- CREATE TRIGGER update_notifications_created_at 
--     BEFORE UPDATE ON notifications 
--     FOR EACH ROW 
--     EXECUTE FUNCTION update_notifications_created_at_column();

-- Add check constraints
ALTER TABLE notifications 
ADD CONSTRAINT notifications_user_id_not_null CHECK (user_id IS NOT NULL),
ADD CONSTRAINT notifications_message_not_null CHECK (message IS NOT NULL),
ADD CONSTRAINT notifications_read_not_null CHECK (read IS NOT NULL),
ADD CONSTRAINT notifications_created_at_not_null CHECK (created_at IS NOT NULL);

-- Create function to get user notifications
CREATE OR REPLACE FUNCTION get_user_notifications(
    user_uuid UUID,
    limit_count INTEGER DEFAULT 50,
    offset_count INTEGER DEFAULT 0,
    unread_only BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    message TEXT,
    read BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id,
        n.user_id,
        n.message,
        n.read,
        n.created_at
    FROM notifications n
    WHERE n.user_id = user_uuid
    AND (unread_only = FALSE OR n.read = FALSE)
    ORDER BY n.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(notification_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    notification_count INTEGER;
BEGIN
    -- Check if notification exists and belongs to user
    SELECT COUNT(*) INTO notification_count
    FROM notifications 
    WHERE id = notification_uuid AND user_id = user_uuid;
    
    IF notification_count = 0 THEN
        RETURN FALSE;
    END IF;
    
    -- Mark as read
    UPDATE notifications 
    SET read = TRUE
    WHERE id = notification_uuid AND user_id = user_uuid;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create function to mark all notifications as read for user
CREATE OR REPLACE FUNCTION mark_all_notifications_read(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE notifications 
    SET read = TRUE
    WHERE user_id = user_uuid AND read = FALSE;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to get unread notification count
CREATE OR REPLACE FUNCTION get_unread_notification_count(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    unread_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO unread_count
    FROM notifications 
    WHERE user_id = user_uuid AND read = FALSE;
    
    RETURN COALESCE(unread_count, 0);
END;
$$ LANGUAGE plpgsql;

-- Create function to delete old notifications (cleanup)
CREATE OR REPLACE FUNCTION cleanup_old_notifications(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM notifications 
    WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '1 day' * days_to_keep;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Insert sample notifications for testing
INSERT INTO notifications (user_id, message, read) VALUES
    (uuid_generate_v4(), 'Welcome to Glad Tidings! Your account has been created successfully.', FALSE),
    (uuid_generate_v4(), 'Your appointment is pending approval. You will receive an email once it is confirmed.', FALSE),
    (uuid_generate_v4(), 'New wellness workshop available this weekend. Limited spots available!', FALSE),
    (uuid_generate_v4(), 'Your profile has been updated successfully.', TRUE),
    (uuid_generate_v4(), 'Appointment reminder: You have a consultation scheduled for tomorrow at 10:00 AM.', FALSE)
ON CONFLICT DO NOTHING;

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON notifications TO your_app_user;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Comments for documentation
COMMENT ON TABLE notifications IS 'Stores user notifications with read/unread status';
COMMENT ON COLUMN notifications.id IS 'Unique identifier for each notification';
COMMENT ON COLUMN notifications.user_id IS 'Foreign key to users table - notification recipient';
COMMENT ON COLUMN notifications.message IS 'Notification message content';
COMMENT ON COLUMN notifications.read IS 'Read status - FALSE for unread, TRUE for read';
COMMENT ON COLUMN notifications.created_at IS 'When the notification was created';

-- Create scheduled cleanup job (if using pg_cron extension)
-- Uncomment if you have pg_cron installed
-- SELECT cron.schedule('cleanup-notifications', '0 2 * * *', 'SELECT cleanup_old_notifications(90);');
