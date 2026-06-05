import { Route, Routes } from 'react-router-dom'
import { ProfessionalPage } from '../pages/BarberPage'
import { CustomerPage } from '../pages/CustomerPage'
import { DatePage } from '../pages/DatePage'
import { HomePage } from '../pages/HomePage'
import { ReviewPage } from '../pages/ReviewPage'
import { ServicePage } from '../pages/ServicePage'
import { TimePage } from '../pages/TimePage'
import { WhatsAppRedirectPage } from '../pages/WhatsAppRedirectPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/servicos" element={<ServicePage />} />
      <Route path="/profissionais" element={<ProfessionalPage />} />
      <Route path="/data" element={<DatePage />} />
      <Route path="/horarios" element={<TimePage />} />
      <Route path="/cliente" element={<CustomerPage />} />
      <Route path="/revisao" element={<ReviewPage />} />
      <Route path="/whatsapp" element={<WhatsAppRedirectPage />} />
    </Routes>
  )
}
