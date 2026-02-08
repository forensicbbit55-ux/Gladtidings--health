-- Create appointments table for Glad Tidings health consultations
-- This table stores appointment information with proper relationships

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint to users table
ALTER TABLE appointments 
ADD CONSTRAINT appointments_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES users(id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON appointments(appointment_date, appointment_time);
CREATE INDEX IF NOT EXISTS idx_appointments_service_type ON appointments(service_type);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at);

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_appointments_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_appointments_updated_at 
    BEFORE UPDATE ON appointments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_appointments_updated_at_column();

-- Add check constraints
ALTER TABLE appointments 
ADD CONSTRAINT appointments_user_id_not_null CHECK (user_id IS NOT NULL),
ADD CONSTRAINT appointments_service_type_not_null CHECK (service_type IS NOT NULL),
ADD CONSTRAINT appointments_appointment_date_not_null CHECK (appointment_date IS NOT NULL),
ADD CONSTRAINT appointments_appointment_time_not_null CHECK (appointment_time IS NOT NULL),
ADD CONSTRAINT appointments_status_not_null CHECK (status IS NOT NULL),
ADD CONSTRAINT appointments_appointment_date_future CHECK (appointment_date >= CURRENT_DATE);

-- Create function to get user appointments
CREATE OR REPLACE FUNCTION get_user_appointments(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    service_type VARCHAR(100),
    appointment_date DATE,
    appointment_time TIME,
    status VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.user_id,
        a.service_type,
        a.appointment_date,
        a.appointment_time,
        a.status,
        a.notes,
        a.created_at,
        a.updated_at
    FROM appointments a
    WHERE a.user_id = user_uuid
    ORDER BY a.appointment_date ASC, a.appointment_time ASC;
END;
$$ LANGUAGE plpgsql;

-- Create function to check appointment availability
CREATE OR REPLACE FUNCTION check_appointment_availability(
    target_date DATE,
    target_time TIME,
    practitioner_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE appointment_date = target_date 
        AND appointment_time = target_time 
        AND status IN ('pending', 'approved')
        AND (practitioner_id IS NULL OR practitioner_id = practitioner_id)
    );
END;
$$ LANGUAGE plpgsql;

-- Create function to update appointment status
CREATE OR REPLACE FUNCTION update_appointment_status(
    appointment_uuid UUID,
    new_status VARCHAR(20),
    updated_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    appointment_count INTEGER;
BEGIN
    -- Check if appointment exists
    SELECT COUNT(*) INTO appointment_count
    FROM appointments 
    WHERE id = appointment_uuid;
    
    IF appointment_count = 0 THEN
        RETURN FALSE;
    END IF;
    
    -- Update appointment status
    UPDATE appointments 
    SET 
        status = new_status,
        notes = COALESCE(updated_notes, notes),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = appointment_uuid;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Insert sample appointments for testing
INSERT INTO appointments (user_id, service_type, appointment_date, appointment_time, status, notes) VALUES
    (uuid_generate_v4(), 'Natural Health Consultation', '2026-02-10', '10:00:00', 'pending', 'Initial consultation for herbal remedies'),
    (uuid_generate_v4(), 'Follow-up Appointment', '2026-02-15', '14:00:00', 'pending', 'Review progress on current treatment'),
    (uuid_generate_v4(), 'Wellness Workshop', '2026-02-20', '18:00:00', 'approved', 'Spiritual wellness and natural healing techniques')
ON CONFLICT DO NOTHING;

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON appointments TO your_app_user;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Comments for documentation
COMMENT ON TABLE appointments IS 'Stores health consultation and wellness appointment information';
COMMENT ON COLUMN appointments.id IS 'Unique identifier for each appointment';
COMMENT ON COLUMN appointments.user_id IS 'Foreign key to users table - who owns this appointment';
COMMENT ON COLUMN appointments.service_type IS 'Type of service (consultation, follow-up, workshop, etc.)';
COMMENT ON COLUMN appointments.appointment_date IS 'Date of the appointment';
COMMENT ON COLUMN appointments.appointment_time IS 'Time of the appointment';
COMMENT ON COLUMN appointments.status IS 'Current status: pending, approved, cancelled, completed';
COMMENT ON COLUMN appointments.notes IS 'Additional notes about the appointment';
COMMENT ON COLUMN appointments.created_at IS 'When the appointment was created';
COMMENT ON COLUMN appointments.updated_at IS 'When the appointment was last updated';
