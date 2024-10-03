import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Style, Icon } from 'ol/style'

export const icon = (coords, name, src, anchor) => {
  const iconFeature = new Feature({
    geometry: new Point(coords),
    name: name,
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

export const logo = (coords, name, src) => {
  const logoFeature = new Feature({
    geometry: new Point(coords),
    name: name,
  })

  logoFeature.setStyle(
    new Style({
      image: new Icon({
        anchor: [0.5, 215],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: src,
        height: 20,
        width: 20,
      }),
    })
  )

  return logoFeature
}
