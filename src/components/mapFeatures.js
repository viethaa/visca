import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Style, Icon } from 'ol/style'

export const icon = (coords, name, src, type) => {
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
      }),
    })
  )

  return iconFeature
}

export const logo = (coords, name, src, opacity, type) => {
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
      }),
    })
  )

  return logoFeature
}
