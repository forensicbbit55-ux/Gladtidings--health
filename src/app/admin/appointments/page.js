import { Suspense } from 'react';
import AdminAppointmentsClient from './AdminAppointmentsClient';

export const dynamic = 'force-dynamic'

export default function AdminAppointmentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminAppointmentsClient />
    </Suspense>
  )
}
