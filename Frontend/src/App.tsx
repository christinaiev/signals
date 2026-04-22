
import './App.css'

import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './Layout'

import './styles.css'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>       
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Layout />        
      </Router>
    </QueryClientProvider>
    
  )
}

