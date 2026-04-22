import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getTrack } from './api'

export default function Track() {
  const { trackId } = useParams()

 
  const { data, status, error } = useQuery({
    queryKey: ['track', trackId],
    queryFn: () => getTrack(trackId),
  })

   if (!trackId) {
    return <p>Invalid track ID</p>
  }


  if (status === 'pending') return <p>Loading...</p>

  if (status === 'error') return <p>Error :( {error?.message}</p>
    
  return (
    <div className="rounded-2xl shadow-md p-2 border border border-gray-100">
        <div>
            <div><h2 className="text-3xl text-teal-700">{data.track_id}</h2></div>
            <div><h3 className="text-2xl">{data.source} to {data.target}</h3></div>
        </div>
      <br />
      <h4 className="text-1xl">Signals</h4>
      <div className="rounded-xl overflow-hidden border border-gray-200 shadow-md">
        <table className="w-full text-left">
        <thead className="bg-gray-100 text-gray-600 bg-teal-50 uppercase text-sm">
           <tr>
          <th className="px-4 py-3">ID</th>
          <th className="px-4 py-3">Signal name</th>
          <th className="px-4 py-3">ELR</th>
          <th className="px-4 py-3">Mileage</th>
        </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
      { data.signal_ids.map((signal) => (
        <tr key={signal.signal_id}>
              <td className="px-4 py-3">{signal.signal_id}</td>
              <td className="px-4 py-3">{signal.signal_name} </td>
              <td className="px-4 py-3">{signal.elr} </td>
              <td className="px-4 py-3">{signal.mileage.toFixed(2)}</td>
          </tr>
        
      ))}
        </tbody>
         </table>
      </div>
    </div>
  )
}

