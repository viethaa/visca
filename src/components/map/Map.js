import React, { useState, useEffect, useRef } from 'react'
import { default as OLMap } from 'ol/Map.js'
import TileLayer from 'ol/layer/Tile.js'
import View from 'ol/View.js'
import { useGeographic } from 'ol/proj.js'
import VectorLayer from 'ol/layer/Vector.js'
import VectorSource from 'ol/source/Vector.js'
import { icon, logo } from '../mapFeatures'
import StadiaMaps from 'ol/source/StadiaMaps'

export default function Map({ markers, schools, setOpen, setSchool, places }) {
  useGeographic()
  const ref = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    const vectorLayer = new VectorLayer()
    const view = new View({
      center: [105.7948, 21.1454],
      zoom: 11,
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
      console.log(school)
      return [
        icon(school.location, school.name, school.pin, 'school'),
        logo(school.location, school.name, school.logo, 1, 'school'),
      ]
    })

    const placesPins = places.map((place) => {
      return [
        icon(
          [place.longitude, place.latitude],
          place.name,
          '/gray-pin.png',
          'place'
        ),
        logo(
          [place.longitude, place.latitude],
          place.name,
          place.icon,
          0.5,
          'place'
        ),
      ]
    })

    map
      .getLayers()
      .getArray()
      .filter((layer) => layer instanceof VectorLayer === true)
      .forEach((layer) => map.removeLayer(layer))

    const vectorSource = new VectorSource({
      features: [...pins.flat(), ...placesPins.flat()],
    })

    map.addLayer(
      new VectorLayer({
        source: vectorSource,
        name: 'markers',
        zIndex: 2,
      })
    )

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
      setOpen(false)
      if (!feature) {
        return
      }

      console.log(feature?.values_.type)

      if (feature?.values_.type === 'place') {
        return
      }

      setSchool(schools.find((school) => school.name === feature?.values_.name))
      setOpen(true)
    })

    map.on('pointermove', function (e) {
      const pixel = map.getEventPixel(e.originalEvent)
      const hit = map.hasFeatureAtPixel(pixel)
      map.getTarget().style.cursor = hit ? 'pointer' : ''
    })
  }, [ref, mapRef, schools])

  return (
    <div
      ref={ref}
      id='map'
      className='h-[600px] max-w-6xl mx-auto overflow-hidden rounded-lg lg:flex-grow border border-gray-200'
    ></div>
  )
}
