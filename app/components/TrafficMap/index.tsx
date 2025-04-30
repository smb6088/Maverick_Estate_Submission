"use client"

import React, { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"

interface TrafficDataPoint {
  TRFC_STATN_ID: string
  AADT_RPT_QTY: number
  LATITUDE: number
  LONGITUDE: number
  ON_ROAD: string
}

interface TrafficHeatmapProps {
  center?: { lat: number, lng: number }
  zoom?: number
  trafficData: TrafficDataPoint[]
  onTrafficScoreCalculated?: (score: number) => void
}

const TrafficHeatmap: React.FC<TrafficHeatmapProps> = ({
  center = { lat: 32.7688, lng: -97.3093 },
  zoom = 12,
  trafficData,
  onTrafficScoreCalculated
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const [trafficScore, setTrafficScore] = useState<number | null>(null)
  const calculateTrafficScore = (aadt: number): number => {
    if (aadt > 150000) return 10
    if (aadt > 120000) return 9
    if (aadt > 100000) return 8
    if (aadt > 80000) return 7
    if (aadt > 60000) return 6
    if (aadt > 40000) return 5
    if (aadt > 20000) return 4
    if (aadt > 10000) return 3
    if (aadt > 5000) return 2
    return 1
  }

  const centerMapOnProperty = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo({ lat: center.lat, lng: center.lng })
    }
  }


  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey || !mapRef.current) return
  
    const loader = new Loader({ apiKey, version: "weekly", libraries: ["marker", "places"]})
  
    loader.load().then(async () => {
      const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary
      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary
      
      const map = new Map(mapRef.current!, {
        center,
        zoom,
        mapId: 'YOUR_MAP_ID'
          
    })
    
        const propertyPin = new PinElement({
          background: "#000000",
          borderColor: "#FFFFFF",
          glyphColor: "#FFFFFF",
          scale: 1.5,
          glyph: "P"
        })
        const propertyMarker = new AdvancedMarkerElement({
          map,
          position: { lat: center.lat, lng: center.lng },
          content: propertyPin.element,
          zIndex: 1000
        })
  
      trafficData.forEach(point => {
        const score = calculateTrafficScore(point.AADT_RPT_QTY)
        const markerColor = getColorForScore(score)
        const pin = new PinElement({
          background: markerColor,
          borderColor: "#FFFFFF",
          glyphColor: "#FFFFFF",
          scale: 1.2
        })

        const marker = new AdvancedMarkerElement({
          map,
          position: { lat: point.LATITUDE, lng: point.LONGITUDE },
          content: pin.element,
          title: point.TRFC_STATN_ID
        })

        marker.addListener("click", () => {
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="position: relative font-size: 14px color: #333 padding: 10px 12px border-radius: 8px">
                <strong>Station ID:</strong> ${point.TRFC_STATN_ID}<br />
                <strong>Road:</strong> ${point.ON_ROAD}<br />
                <strong>AADT:</strong> ${point.AADT_RPT_QTY.toLocaleString()}<br />
                <strong>Traffic Score:</strong> ${score}/10
              </div>
            `
          })
          infoWindow.open(map, marker)
        })
      })

      if (trafficData.length > 0) {
        const avgAADT = trafficData.reduce((sum, point) => sum + point.AADT_RPT_QTY, 0) / trafficData.length
        const overallScore = calculateTrafficScore(avgAADT)
        setTrafficScore(overallScore)
        console.log(overallScore)
        
        if (onTrafficScoreCalculated) {
          onTrafficScoreCalculated(overallScore)
        }
      }

      const trafficLayer = new google.maps.TrafficLayer()
      trafficLayer.setMap(map)
    }).catch(error => {
      console.error("Error loading Google Maps:", error)
    })
  }, [center, zoom, trafficData, onTrafficScoreCalculated])
  
  const getColorForScore = (score: number): string => {
    switch(score) {
      case 10: return "#800026"
      case 9: return "#BD0026"
      case 8: return "#E31A1C"
      case 7: return "#FC4E2A"
      case 6: return "#FD8D3C"
      case 5: return "#FEB24C"
      case 4: return "#FED976"
      case 3: return "#FFEDA0"
      case 2: return "#FFFFCC"
      default: return "#FFFFCC"
    }
  }

  return <div ref={mapRef} className="w-full h-full"/>
}

export default TrafficHeatmap
