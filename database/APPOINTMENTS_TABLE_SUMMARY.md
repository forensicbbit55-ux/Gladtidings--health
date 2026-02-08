# Appointments Table Implementation

## 📋 Table Structure Created

### **SQL Table Schema**
```sql
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### **Prisma Model Added**
```prisma
model Appointment {
  id           String    @id @default(uuid())
  userId       String    @map("user_id")
  serviceType  String    @map("service_type")
  appointmentDate DateTime  @map("appointment_date")
  appointmentTime String    @map("appointment_time")
  status       AppointmentStatus @default(PENDING)
  notes        String?
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("appointments")
}

enum AppointmentStatus {
  PENDING
  APPROVED
  CANCELLED
  COMPLETED
}
```

## 🔗 Foreign Keys & Relationships

### **Foreign Key Constraint**
- **appointments.user_id** → **users.id**
- **On Delete:** CASCADE (appointments deleted when user is deleted)
- **On Update:** CASCADE (user ID changes cascade to appointments)

### **Prisma Relations**
- **User** has many **Appointments**
- **Appointment** belongs to **User**

## 📊 Indexes Created

### **Performance Indexes**
```sql
-- User-based queries
CREATE INDEX idx_appointments_user_id ON appointments(user_id);

-- Status filtering
CREATE INDEX idx_appointments_status ON appointments(status);

-- Date-based queries
CREATE INDEX idx_appointments_date ON appointments(appointment_date);

-- Date + Time queries (for availability checking)
CREATE INDEX idx_appointments_date_time ON appointments(appointment_date, appointment_time);

-- Service type filtering
CREATE INDEX idx_appointments_service_type ON appointments(service_type);

-- Chronological ordering
CREATE INDEX idx_appointments_created_at ON appointments(created_at);
```

## 🔒 Constraints & Validation

### **Check Constraints**
```sql
-- Required fields
CHECK (user_id IS NOT NULL)
CHECK (service_type IS NOT NULL)
CHECK (appointment_date IS NOT NULL)
CHECK (appointment_time IS NOT NULL)
CHECK (status IS NOT NULL)

-- Status validation
CHECK (status IN ('pending', 'approved', 'cancelled', 'completed'))

-- Business logic
CHECK (appointment_date >= CURRENT_DATE) -- Can't book past appointments
```

## 🔧 Database Functions

### **User Appointments Function**
```sql
CREATE FUNCTION get_user_appointments(user_uuid UUID)
RETURNS TABLE (appointment details...)
```
- Gets all appointments for a specific user
- Ordered by date and time
- Includes all appointment fields

### **Availability Check Function**
```sql
CREATE FUNCTION check_appointment_availability(date, time, practitioner_id)
RETURNS BOOLEAN
```
- Checks if a time slot is available
- Prevents double-booking
- Optional practitioner filtering

### **Status Update Function**
```sql
CREATE FUNCTION update_appointment_status(appointment_uuid, new_status, notes)
RETURNS BOOLEAN
```
- Updates appointment status safely
- Includes optional notes update
- Returns success/failure status

## 📝 Sample Data

### **Test Appointments Inserted**
```sql
INSERT INTO appointments VALUES (
    uuid_generate_v4(),
    user_id,
    'Natural Health Consultation',
    '2026-02-10',
    '10:00:00',
    'pending',
    'Initial consultation for herbal remedies',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
```

## 🚀 Usage Examples

### **Get User Appointments**
```sql
SELECT * FROM get_user_appointments('user-uuid-here');
```

### **Check Available Slots**
```sql
SELECT check_appointment_availability('2026-02-10', '14:00:00');
```

### **Update Appointment Status**
```sql
SELECT update_appointment_status('appointment-uuid', 'approved', 'Status updated by admin');
```

## 📱 Application Integration

### **Next.js API Routes**
- `GET /api/appointments` - Get user appointments
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/[id]` - Update appointment
- `DELETE /api/appointments/[id]` - Cancel appointment

### **Frontend Components**
- Appointment booking form
- Calendar view with availability
- Status management interface
- User appointment history

## ✅ Implementation Complete

The appointments table is now ready with:
- ✅ Proper foreign key relationships
- ✅ Performance-optimized indexes
- ✅ Data validation constraints
- ✅ Status management
- ✅ Database functions for common operations
- ✅ Prisma ORM integration
- ✅ Sample data for testing

**Ready for appointment booking functionality!** 🎠✨
