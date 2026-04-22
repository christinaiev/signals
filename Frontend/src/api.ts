import { z } from 'zod'

const SignalSchema = z.object({
    signal_id: z.number(),
    signal_name: z.string(),
    elr: z.string(),
    mileage: z.number()
  })

const ParsedSignalSchema = z.object({
    signal_id: z.number(),
    signal_name: z.string(),
    elr: z.string(),
    mileage: z.array(z.number())
  })  

const SignalsSchema = z.array(ParsedSignalSchema)

  const TrackSchema = z.object({
    track_id: z.number(),
    source: z.string(),
    target: z.string(),
    signal_ids: z.array(SignalSchema) 
  })

const TracksSchema = z.array(TrackSchema)
  
const baseUrl = "http://localhost:8080"

export const getTracks = async () => {
  const res = await fetch(baseUrl + '/tracks/')
  if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`)
    }
   const data = await res.json()
   return TracksSchema.parse(data)
}

export const getSignals = async () => {
  const res = await fetch(baseUrl + '/signals/')
  if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`)
    }
   const data = await res.json()
   return SignalsSchema.parse(data)
}

export const getTrack = async (trackId: string) => {
  const res = await fetch(baseUrl + `/track/${trackId}`)
  return await res.json()
}


export const getSignalTracks = async (signalId: string) => {
  const res = await fetch(baseUrl + `/signaltracks/${signalId}`)
  return await res.json()
}

