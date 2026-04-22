import { Link as RouterLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getTracks } from './api'
import { useState } from 'react'


// Tracks component has the main functionality as it lists all the tracks and links to individual tracks for specific data
// Tracks can be queried by ID, source and target

export default function Tracks() {
  const { data, status, error } = useQuery({
    queryKey: ['tracks'],
    queryFn: () => getTracks(),
  })

    const [idFilter, setIdFilter] = useState('')
    const [sourceFilter, setSourceFilter] = useState('')
    const [targetFilter, setTargetFilter] = useState('')

    if (status === 'pending') {
        return <p>Loading...</p>
    } 
    if (status === 'error') {
        return <p>Error :(  {error?.message}</p>
    }

  
    const filteredData = 
        (data ?? []).filter((track) => 
        track.track_id?.toString().toLowerCase().includes(idFilter.toLowerCase())  &&
        track.source?.toLowerCase().includes(sourceFilter.toLowerCase())  &&
        track.target?.toLowerCase().includes(targetFilter.toLowerCase()))
    .sort((a, b) => a.source.localeCompare(b.source))


  return (
    
    
    <div>
      <h2 className="text-2xl text-center">Tracks</h2>
       <div className="flex gap-2 mb-4">
        <p className="text-1xl">Track ID</p>
      <input
        className="border rounded-lg p-2 w-full border-gray-100"
        placeholder="Search tracks by ID..."
        value={idFilter}
        onChange={(e) => setIdFilter(e.target.value)}
      />
      <p className="text-1xl">Track source</p>
       <input
        className="border rounded-lg p-2 w-full border-gray-100"
        placeholder="Search tracks by source..."
        value={sourceFilter}
        onChange={(e) => setSourceFilter(e.target.value)}
      />
      <p className="text-1xl">Track target</p>
      <input
        className="border rounded-lg p-2 w-full border-gray-100"
        placeholder="Search tracks by target..."
        value={targetFilter}
        onChange={(e) => setTargetFilter(e.target.value)}
      />
      </div>
      <div className="grid grid-cols-2 gap-4 p-2">
      {filteredData.map((track) => {
        
        const trackId = track.track_id;
        return (
          <div key={trackId} className="rounded-2xl shadow-md p-2 border border-gray-100">  
          <article key={trackId}>
            <RouterLink className="hover:underline" to={`/track/${trackId}`}>
              <h6 className="text-black-600 font-bold"> {track.track_id} </h6>
              <h6 className="text-teal-700"> {track.source} to {track.target} </h6>              
            </RouterLink>
          </article>
          </div>
        )
      })}
    </div>
    </div>
  )
}