import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Style, Icon } from 'ol/style'

export const icon = (coords, name, src, scale, anchor) => {
  const iconFeature = new Feature({
    geometry: new Point(coords),
    name: name,
  })

  iconFeature.setStyle(
    new Style({
      image: new Icon({
        anchor: anchor,
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: src,
        scale: scale,
      }),
    })
  )

  return iconFeature
}

export const logo = (coords, name, src, scale, anchor) => {
  const logoFeature = new Feature({
    geometry: new Point(coords),
    name: name,
  })

  logoFeature.setStyle(
    new Style({
      image: new Icon({
        anchor: anchor,
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: src,
        scale: scale,
      }),
    })
  )

  return logoFeature
}
