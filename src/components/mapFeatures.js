import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Style, Icon, Text, Fill, Stroke } from 'ol/style'

export const icon = (coords, name, src, type) => {
  // Return null if no valid src is provided or invalid coords
  if (!src || typeof src !== 'string' || src.trim() === '' || !coords || coords.length !== 2 || coords.some(c => c == null)) {
    return null
  }

  try {
    const iconFeature = new Feature({
      geometry: new Point(coords),
      name: name,
      type: type,
    })

    iconFeature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 100],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: src,
          scale: 0.5,
          crossOrigin: 'anonymous',
        }),
      })
    )

    return iconFeature
  } catch (error) {
    console.warn('Failed to create icon feature for:', name, error)
    return null
  }
}

export const logo = (coords, name, src, opacity, type) => {
  // Return null if no valid src is provided or invalid coords
  if (!src || typeof src !== 'string' || src.trim() === '' || !coords || coords.length !== 2 || coords.some(c => c == null)) {
    return null
  }

  // Additional check: ensure src is a valid URL or path
  try {
    const logoFeature = new Feature({
      geometry: new Point(coords),
      name: name,
      type: type,
    })

    logoFeature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 2.15],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: src,
          height: 20,
          width: 20,
          opacity: opacity ? opacity : 1,
          crossOrigin: 'anonymous',
        }),
      })
    )

    return logoFeature
  } catch (error) {
    console.warn('Failed to create logo feature for:', name, error)
    return null
  }
}

export const label = (coords, name, type) => {
  // Return null if invalid coords
  if (!coords || coords.length !== 2 || coords.some(c => c == null) || !name) {
    return null
  }

  try {
    const labelFeature = new Feature({
      geometry: new Point(coords),
      name: name,
      type: type,
    })

    labelFeature.setStyle(
      new Style({
        text: new Text({
          text: name,
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

    return labelFeature
  } catch (error) {
    console.warn('Failed to create label feature for:', name, error)
    return null
  }
}
