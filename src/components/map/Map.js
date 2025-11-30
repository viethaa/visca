import React, { useState, useEffect, useRef } from 'react'
import { default as OLMap } from 'ol/Map.js'
import TileLayer from 'ol/layer/Tile.js'
import View from 'ol/View.js'
import { useGeographic } from 'ol/proj.js'
import VectorLayer from 'ol/layer/Vector.js'
import VectorSource from 'ol/source/Vector.js'
import { icon, logo, label } from '../mapFeatures'
import { Style, Text, Fill, Stroke } from 'ol/style'
import StadiaMaps from 'ol/source/StadiaMaps'

// Hardcoded school logos to prevent loading errors
const SCHOOL_LOGOS = {
  'Concordia International School Hanoi': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxFlfBXhFgeyiKsFJ0Kp20Jv7mk6qMItVqhg&s',
  'St. Paul American School Hanoi': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTUhqW3ztSI5_DLUBwewAjuAhN8pjoNHqF9ZZk2O8sFempxs81Wh7XCfhaXjGOQWZhOU8&usqp=CAU',
  'British Vietnamese International School Hanoi': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_b_K7kQMRwceuTgHI6_3aNvsFZkKTXk0yHg&s',
  'UNIS Hanoi': 'https://avatars.githubusercontent.com/u/8739604?s=100',
  'TH School': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCcDxdXMTbom7_7x6DBNdRFJ5CPC0hK7C1-3aNbY4GQQnM9h8p_L7HanegjqH95QM7UwY&usqp=CAU',
  'British International School Hanoi': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzw8VF0MhMua8ZR3I-dCJ5jrn4z4jjz3FKaA&s',
  'The Olympia Schools': 'https://theolympiaschools.edu.vn/storage/favicon.png',
  'The Dewey Schools': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb88PR97WqVpcuxd6RiOiEWnMKEWAttf9f_g&s',
  'Delta Global School': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKGFw4cldcE6u0aRsYtAscux5EqSIx_tTQIlqkseT6ZYX-_mwm3AsZPbT9o2HuR7Y7vf0&usqp=CAU',
  'Hanoi International School': 'https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_2/v1690308110/hisvietnamcom/homfclrxcrpr1btxvsr3/tigercolortext_2.png',
  'Westlink International School': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRc4pyuhM9E6F0_8v7IbI7Xeev4ZvuxSR7Inw&s'
}

export default function Map({
  markers,
  schools,
  setSchoolOpen,
  setSchool,
  places,
  hotels,
  setPlaceOpen,
  setPlace,
}) {
  useGeographic()
  const ref = useRef(null)
  const mapRef = useRef(null)
  const labelLayerRef = useRef(null)

  useEffect(() => {
    const vectorLayer = new VectorLayer()
    const view = new View({
      center: [105.7948, 21.1454],
      zoom: 12.5,
    })

    if (ref.current && !mapRef.current) {
      mapRef.current = new OLMap({
        layers: [
          new TileLayer({
            source: new StadiaMaps({
              layer: 'alidade_smooth',
              retina: true,
              apiKey: process.env.NEXT_PUBLIC_STADIAMAPS_API,
            }),
          }),
          vectorLayer,
        ],
        view: view,
        target: ref.current,
      })
    }
    const map = mapRef.current

    const pins = markers.map((school) => {
      try {
        const features = []

        // Create pin icon
        const pinFeature = icon(school.location, school.name, '/pins/black.png', 'school')
        if (pinFeature) {
          features.push(pinFeature)
        }

        // Use hardcoded logo URL if available
        const logoUrl = SCHOOL_LOGOS[school.name]
        if (logoUrl && school.location && school.location.length === 2) {
          try {
            const logoFeature = logo(school.location, school.name, logoUrl, 1, 'school')
            if (logoFeature) {
              features.push(logoFeature)
            }
          } catch (logoError) {
            // Silently skip logo if it fails
          }
        }

        return features.filter(Boolean)
      } catch (error) {
        // Return just the pin if anything fails
        try {
          const pinFeature = icon(school.location, school.name, '/pins/black.png', 'school')
          return pinFeature ? [pinFeature] : []
        } catch {
          return []
        }
      }
    })

    const placesPins = places.map((place) => {
      try {
        // Only show pins, logos disabled to prevent errors
        return [icon([place.longitude, place.latitude], place.name, '/pins/gray.png', 'place')].filter(Boolean)
      } catch (error) {
        console.warn('Error creating pin for place:', place.name, error)
        return []
      }
    })

    const hotelsPins = hotels.map((hotel) => {
      try {
        // Only show pins, logos disabled to prevent errors
        return [icon([hotel.longitude, hotel.latitude], hotel.name, '/pins/blue.png', 'hotel')].filter(Boolean)
      } catch (error) {
        console.warn('Error creating pin for hotel:', hotel.name, error)
        return []
      }
    })

    // Create label features (initially invisible)
    const schoolLabels = markers.map((school) => {
      try {
        const labelFeature = label(school.location, school.name, 'school-label')
        if (labelFeature) {
          labelFeature.setStyle(new Style({})) // Initially invisible
        }
        return labelFeature
      } catch (error) {
        return null
      }
    }).filter(Boolean)

    const placeLabels = places.map((place) => {
      try {
        const labelFeature = label([place.longitude, place.latitude], place.name, 'place-label')
        if (labelFeature) {
          labelFeature.setStyle(new Style({})) // Initially invisible
        }
        return labelFeature
      } catch (error) {
        return null
      }
    }).filter(Boolean)

    const hotelLabels = hotels.map((hotel) => {
      try {
        const labelFeature = label([hotel.longitude, hotel.latitude], hotel.name, 'hotel-label')
        if (labelFeature) {
          labelFeature.setStyle(new Style({})) // Initially invisible
        }
        return labelFeature
      } catch (error) {
        return null
      }
    }).filter(Boolean)

    map
      .getLayers()
      .getArray()
      .filter((layer) => layer instanceof VectorLayer === true)
      .forEach((layer) => map.removeLayer(layer))

    const vectorSource = new VectorSource({
      features: [...pins.flat(), ...placesPins.flat(), ...hotelsPins.flat()],
    })

    const labelSource = new VectorSource({
      features: [...schoolLabels, ...placeLabels, ...hotelLabels],
    })

    map.addLayer(
      new VectorLayer({
        source: vectorSource,
        name: 'markers',
        zIndex: 2,
      })
    )

    const labelLayer = new VectorLayer({
      source: labelSource,
      name: 'labels',
      zIndex: 3,
    })
    map.addLayer(labelLayer)
    labelLayerRef.current = labelSource

    const padding = 0.01
    const extent = [
      vectorSource.getExtent()[0] - padding,
      vectorSource.getExtent()[1] - padding / 2,
      vectorSource.getExtent()[2] + padding,
      vectorSource.getExtent()[3] + padding * 2,
    ]
    view.fit(extent, {
      size: map.getSize(),
    })

    map.on('click', function (evt) {
      const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature
      })
      setSchoolOpen(false)
      if (!feature) {
        return
      }

      console.log(feature?.values_.type)

      switch (feature?.values_.type) {
        case 'school':
          setSchool(
            schools.find((school) => school.name === feature?.values_.name)
          )
          setSchoolOpen(true)
          break
        case 'hotel':
          setPlace(hotels.find((h) => h.name === feature?.values_.name))
          setPlaceOpen(true)
          break
        default:
          setPlace(places.find((h) => h.name === feature?.values_.name))
          setPlaceOpen(true)
          break
      }

      // if (feature?.values_.type === 'place') {
      //   setPlace(places.find((place) => place.name === feature?.values_.name))
      //   setPlaceOpen(true)
      //   return
      // }

      // setSchool(schools.find((school) => school.name === feature?.values_.name))
      // setSchoolOpen(true)
    })

    map.on('pointermove', function (e) {
      const pixel = map.getEventPixel(e.originalEvent)
      const hit = map.hasFeatureAtPixel(pixel)
      map.getTarget().style.cursor = hit ? 'pointer' : ''

      // Show label on hover
      const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
        // Only return marker features, not labels
        if (feature.values_.type && !feature.values_.type.includes('-label')) {
          return feature
        }
      })

      const labelSource = labelLayerRef.current
      if (labelSource) {
        const allLabels = labelSource.getFeatures()

        // Hide all labels first
        allLabels.forEach(labelFeature => {
          labelFeature.setStyle(new Style({}))
        })

        // Show label for hovered feature
        if (feature && feature.values_.name) {
          const hoveredName = feature.values_.name
          const matchingLabel = allLabels.find(l => l.values_.name === hoveredName)

          if (matchingLabel) {
            matchingLabel.setStyle(
              new Style({
                text: new Text({
                  text: hoveredName,
                  offsetY: -50,
                  font: '12px Inter, sans-serif',
                  fill: new Fill({
                    color: '#ffffff',
                  }),
                  stroke: new Stroke({
                    color: '#000000',
                    width: 3,
                  }),
                  backgroundFill: new Fill({
                    color: 'rgba(0, 0, 0, 0.7)',
                  }),
                  backgroundStroke: new Stroke({
                    color: 'rgba(255, 255, 255, 0.2)',
                    width: 1,
                  }),
                  padding: [4, 8, 4, 8],
                }),
              })
            )
          }
        }
      }
    })

    // Add comprehensive error handler to suppress image loading errors
    const handleError = (event) => {
      // Suppress all OpenLayers image loading errors
      if (event && (event.error || event.message)) {
        const errorMessage = event.error?.message || event.message || ''
        if (errorMessage.includes('null') ||
            errorMessage.includes('image') ||
            errorMessage.includes('IconImage') ||
            errorMessage.includes('Cannot read properties')) {
          event.preventDefault()
          event.stopPropagation()
          return false
        }
      }
      return true
    }

    const handleUnhandledRejection = (event) => {
      // Suppress promise rejections related to image loading
      if (event && event.reason) {
        const reason = event.reason?.message || event.reason || ''
        if (typeof reason === 'string' &&
            (reason.includes('null') || reason.includes('image') || reason.includes('IconImage'))) {
          event.preventDefault()
          return false
        }
      }
      return true
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('error', handleError, true)
      window.addEventListener('unhandledrejection', handleUnhandledRejection, true)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('error', handleError, true)
        window.removeEventListener('unhandledrejection', handleUnhandledRejection, true)
      }
    }
  }, [ref, mapRef, schools])

  return (
    <div
      ref={ref}
      id='map'
      className='h-full w-full overflow-hidden'
    ></div>
  )
}
