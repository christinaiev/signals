import { Link as RouterLink } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <h2 className="text-4xl">Tracks and Signals</h2>
      <p>
        ( Built by {'Cristina '} )
      </p>
      <h5 className="text-2xl pt-4">Using Signals API</h5>
      <p>
        List tracks with associated signals and positions (mileage) of signals on a track
      </p>
      
      <h5 className="text-2xl pt-4">Use links below</h5>
      <p>
        Check out the{' '}
        <RouterLink className="text-teal-700 hover:underline" to="/tracks">
          Tracks
        </RouterLink>{' '}
        and{' '}
        <RouterLink className="text-teal-700 hover:underline" to="/signals">
          Signals
        </RouterLink>        
      </p>
    </div>
  )
}