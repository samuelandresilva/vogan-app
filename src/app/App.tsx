import { BrowserRouter } from 'react-router-dom'
import { BookingProvider } from '../contexts'
import { AppRoutes } from '../routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <BookingProvider>
        <AppRoutes />
      </BookingProvider>
    </BrowserRouter>
  )
}

export default App
