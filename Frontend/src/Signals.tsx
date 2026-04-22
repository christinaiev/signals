import { useQuery } from '@tanstack/react-query'
import { getSignals } from './api'

// Signals component displays all the signals data (unique signals), no filtering due to lack of time.
export default function Signals() {
  const { data, status, error } = useQuery({
    queryKey: ['tracks'],
    queryFn: () => getSignals(),
  })

  if (status === 'pending') {
    return <p>Loading...</p>
  }
  if (status === 'error') {
    return <p>Error :(  {error?.message}</p>
  }

  return (    
      <div>
      <h2 className="text-2xl text-center">Signals</h2>
      <br/>
       <div className="rounded-xl overflow-hidden border border-gray-200 shadow-md">
        <table className="w-full text-left">
        <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
           <tr>
          <th className="px-4 py-3">ID</th>
          <th className="px-4 py-3">Signal name</th>
          <th className="px-4 py-3">ELR</th>
          <th className="px-4 py-3">Mileage</th>
        </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
      {(data ?? []).map((signal, index) => {
                
        return (
        
          <tr key={index}>
              <td className="px-4 py-3">{signal.signal_id}</td>
              <td className="px-4 py-3">{signal.signal_name} </td>
              <td className="px-4 py-3">{signal.elr} </td>
              <td className="px-4 py-3">{(signal.mileage ?? []).map(m => m.toFixed(2)).join(', ')}</td>
          </tr>
          
        )
      })}
          </tbody>
         </table>
      </div>
    </div>
    
  )
}