"use client"

import React, { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"

interface NoiseMapProps {
  geoJsonUrl?: string
  center?: { lat: number, lng: number }
  zoom?: number
  onNoiseScoreCalculated?: (score: number) => void
}

const NoiseMap: React.FC<NoiseMapProps> = ({
  geoJsonUrl = "/noise_fixed_geometry.geojson",
  center = { lat: 32.7688, lng: -97.3093 },
  zoom = 12,
  onNoiseScoreCalculated
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [noiseScore, setNoiseScore] = useState<number | null>(null)
  const computeNoiseScore = (feature: google.maps.Data.Feature): number => {
    const weights = [1, 10, 100, 1000, 10000, 100000]
    const mids = [47.5, 55, 65, 75, 85, 95]
    const props = [ "noise4050p", "noise5060p", "noise6070p", "noise7080p", "noise8090p", "noise90p"]

    return props.reduce((sum, key, i) => {
      return sum + (feature.getProperty(key) as number || 0) * weights[i] * mids[i]
    }, 0)
  }

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey || !mapRef.current) return

    const loader = new Loader({ apiKey, version: "weekly",libraries: ["marker", "places"] })
    loader.load().then(() => {
      const map = new google.maps.Map(mapRef.current!, { center, zoom })

      fetch(geoJsonUrl)
        .then((res) => res.json())
        .then((geojson) => {
          map.data.addGeoJson(geojson)

          let maxScore = 0
          map.data.forEach((f) => {
            const s = computeNoiseScore(f)
            if (s > maxScore) maxScore = s
          })
          

          map.data.setStyle((f) => {
            const score = computeNoiseScore(f)
            const norm = score / maxScore
            const lightness = 85 - norm * 40
            return {
              fillColor: `hsl(323 ,100%, ${lightness}%)`,
              strokeColor: "#ffffff",
              strokeWeight: 1,
              fillOpacity: 0.8,
            }
          })

          const infoWindow = new google.maps.InfoWindow()
          map.data.addListener("click", (event:any) => {
            const name = event.feature.getProperty("NAME")
            const score = computeNoiseScore(event.feature).toFixed(2)
            const normScore = ((parseFloat(score)/maxScore)*100).toFixed(1)
            const content = `
              <div style="position: relative; font-size: 14px; color: #333; background: rgba(255, 255, 255, 0.6); padding: 10px 12px; border-radius: 8px">                
                <strong>Tract:</strong> ${name}<br />
                <strong>Relative Noise Level:</strong> ${normScore}/100
              </div>
            `
            infoWindow.setContent(content)
            infoWindow.setPosition(event.latLng)
            infoWindow.open(map)
          })
        })
    })
  }, [geoJsonUrl, center, zoom,onNoiseScoreCalculated])

  return <div ref={mapRef} className="w-full h-full" />
}

export default NoiseMap