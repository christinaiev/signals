import { Route, Link as RouterLink, Routes } from 'react-router-dom'
import Tracks from './Tracks'
import Track from './Track'
import Signals from './Signals'
//import Signal from './Signal'
import Home from './Home'


export default function Layout() {
    return (
        <div>
            <nav className="bg-teal-50 w-full flex flex-row gap-6 justify-center items-center h-12">
                <RouterLink to="/">
                    <span className="uppercase hover:underline">Home</span>
                </RouterLink>
                <RouterLink to="/tracks">
                    <span className="uppercase hover:underline">Tracks</span>
                </RouterLink>
                <RouterLink to="/signals">
                    <span className="uppercase hover:underline">Signals</span>
                </RouterLink>
            </nav>
            <div className="p-2">
                <Routes>
                    <Route exact path="/tracks/" element={<Tracks />} />
                    <Route exact path="/track/:trackId" element={<Track />} />
                    <Route exact path="/signals/" element={<Signals />} />                    
                    <Route path="/" element={<Home />} />
                </Routes>                
            </div>
        </div>
    )
}