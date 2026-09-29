import React, { useEffect, useRef } from 'react'
import OLMap from 'ol/Map.js'
import View from 'ol/View.js'
import Overlay from 'ol/Overlay.js'
import Feature from 'ol/Feature.js'
import Point from 'ol/geom/Point.js'
import TileLayer from 'ol/layer/Tile.js'
import VectorLayer from 'ol/layer/Vector.js'
import VectorSource from 'ol/source/Vector.js'
import StadiaMaps from 'ol/source/StadiaMaps.js'
// Not a React hook: switches OpenLayers to plain longitude/latitude
import { useGeographic as enableGeographic, fromLonLat, toLonLat } from 'ol/proj.js'
import { boundingExtent } from 'ol/extent.js'
import { Style, Icon } from 'ol/style.js'
import { defaults as defaultInteractions } from 'ol/interaction/defaults.js'

enableGeographic()

export const TYPE_COLORS = {
  school: '#C9A46F',
  hotel: '#8FA6BF',
  place: '#B8897F',
}

// Remote logos go through Next's image endpoint so they're same-origin and safe to draw on canvas
const proxied = (src) =>
  !src ? null : src.startsWith('/') ? src : `/_next/image?url=${encodeURIComponent(src)}&w=96&q=80`

const images = {} // src -> HTMLImageElement | null (failed) | undefined (loading)
function loadImage(src, onReady) {
  if (!src || src in images) return
  images[src] = undefined
  const img = new Image()
  img.onload = () => {
    images[src] = img
    onReady()
  }
  img.onerror = () => {
    images[src] = null
    onReady()
  }
  img.src = src
}

const initialsOf = (name = '') =>
  name
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')

const DPR = 2
function drawMarker({ img, type, name, selected, hovered }) {
  const r = selected ? 24 : hovered ? 21 : 18
  const pad = 6
  const size = (r + pad) * 2
  const c = document.createElement('canvas')
  c.width = c.height = size * DPR
  const ctx = c.getContext('2d')
  ctx.scale(DPR, DPR)
  const cx = size / 2

  // Soft shadow and halo
  ctx.beginPath()
  ctx.arc(cx, cx + 1, r + (selected ? 5 : 2), 0, Math.PI * 2)
  ctx.fillStyle = selected ? 'rgba(236,233,228,0.28)' : 'rgba(0,0,0,0.25)'
  ctx.fill()

  ctx.beginPath()
  ctx.arc(cx, cx, r, 0, Math.PI * 2)
  ctx.fillStyle = '#fff'
  ctx.fill()

  const inner = r - 4
  if (img) {
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cx, inner, 0, Math.PI * 2)
    ctx.clip()
    const k = Math.min((inner * 1.6) / img.naturalWidth, (inner * 1.6) / img.naturalHeight)
    const w = img.naturalWidth * k
    const h = img.naturalHeight * k
    ctx.drawImage(img, cx - w / 2, cx - h / 2, w, h)
    ctx.restore()
  } else {
    ctx.fillStyle = TYPE_COLORS[type]
    ctx.font = `600 ${Math.round(r * 0.62)}px system-ui, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(initialsOf(name) || '•', cx, cx + 1)
  }

  ctx.beginPath()
  ctx.arc(cx, cx, r, 0, Math.PI * 2)
  ctx.lineWidth = selected || hovered ? 3 : 2.5
  ctx.strokeStyle = selected ? '#ECE9E4' : TYPE_COLORS[type]
  ctx.stroke()
  return { canvas: c, size }
}

const styleCache = {}
function markerStyle(feature, { selected, hovered }, onReady) {
  const type = feature.get('type')
  const name = feature.get('name')
  const src = proxied(feature.get('logo'))
  loadImage(src, onReady)
  const img = src ? images[src] : null
  if (src && img === undefined) return null // wait for the logo so markers don't flash
  const key = `${type}|${name}|${src}|${!!img}|${selected}|${hovered}`
  if (!styleCache[key]) {
    const { canvas, size } = drawMarker({ img, type, name, selected, hovered })
    styleCache[key] = new Style({
      zIndex: selected ? 3 : hovered ? 2 : 1,
      image: new Icon({ img: canvas, size: [size * DPR, size * DPR], scale: 1 / DPR }),
    })
  }
  return styleCache[key]
}

/**
 * OpenLayers map. Pure view: the parent owns which items show and which is selected.
 * items: [{ type, id, name, longitude, latitude, logo }]
 * embedded: for maps inside a page, the scroll wheel scrolls the page instead of zooming.
 * fitPadding: [top, right, bottom, left] kept clear when fitting all markers (e.g. under a floating panel).
 * focusOffset: [right, up] in pixels; where the selected marker lands relative to the map's center.
 */
export default function MapView({ items, visibleTypes, selected, onSelect, embedded = false, fitPadding = null, focusOffset = null }) {
  const el = useRef(null)
  const mapRef = useRef(null)
  const sourceRef = useRef(null)
  const stateRef = useRef({ selected: null, hovered: null })
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  // Set during render so every effect below sees the current selection
  const selectedKey = selected ? `${selected.type}:${selected.id}` : null
  stateRef.current.selected = selectedKey

  // Build the map once
  useEffect(() => {
    const source = new VectorSource()
    sourceRef.current = source
    const layer = new VectorLayer({
      source,
      style: (f) => {
        const key = `${f.get('type')}:${f.get('id')}`
        return markerStyle(
          f,
          { selected: stateRef.current.selected === key, hovered: stateRef.current.hovered === key },
          () => layer.changed()
        )
      },
    })

    // Created outside React: OpenLayers moves this node into its own container
    const tipNode = document.createElement('div')
    tipNode.className =
      'pointer-events-none whitespace-nowrap rounded bg-ink px-2 py-1 text-xs text-paper'
    const tip = new Overlay({ element: tipNode, offset: [0, -34], positioning: 'bottom-center', stopEvent: false })

    // Dark tiles for the dark themes
    const tilesFor = () =>
      new StadiaMaps({
        layer: 'alidade_smooth_dark',
        retina: true,
        apiKey: process.env.NEXT_PUBLIC_STADIAMAPS_API,
      })
    const tiles = new TileLayer({ source: tilesFor() })
    const onTheme = () => tiles.setSource(tilesFor())
    window.addEventListener('visca-theme', onTheme)

    const map = new OLMap({
      target: el.current,
      layers: [tiles, layer],
      overlays: [tip],
      interactions: defaultInteractions({ mouseWheelZoom: !embedded }),
      view: new View({ center: [105.8, 21.04], zoom: 12, maxZoom: 18, minZoom: 9 }),
    })
    mapRef.current = map

    const hitAt = (pixel) => map.forEachFeatureAtPixel(pixel, (f) => f, { hitTolerance: 4 })

    map.on('pointermove', (e) => {
      if (e.dragging) return
      const f = hitAt(e.pixel)
      const key = f ? `${f.get('type')}:${f.get('id')}` : null
      map.getTargetElement().style.cursor = f ? 'pointer' : ''
      if (key !== stateRef.current.hovered) {
        stateRef.current.hovered = key
        layer.changed()
      }
      if (f) {
        tipNode.textContent = f.get('name')
        tip.setPosition(f.getGeometry().getCoordinates())
      } else {
        tip.setPosition(undefined)
      }
    })

    map.on('click', (e) => {
      const f = hitAt(e.pixel)
      onSelectRef.current(f ? { type: f.get('type'), id: f.get('id') } : null)
    })

    const ro = new ResizeObserver(() => map.updateSize())
    ro.observe(el.current)

    return () => {
      window.removeEventListener('visca-theme', onTheme)
      ro.disconnect()
      map.setTarget(undefined)
      mapRef.current = null
    }
    // Built once; `embedded` never changes for a given map
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync features with the visible items and fit them into view
  const itemsKey = items.map((i) => `${i.type}:${i.id}`).join('|')
  useEffect(() => {
    const source = sourceRef.current
    const map = mapRef.current
    if (!source || !map) return
    source.clear()
    source.addFeatures(
      items
        .filter((i) => i.longitude != null && i.latitude != null)
        .map((i) => {
          const f = new Feature({ geometry: new Point([i.longitude, i.latitude]) })
          f.setProperties({ type: i.type, id: i.id, name: i.name, logo: i.logo || null })
          return f
        })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsKey])

  useEffect(() => {
    const source = sourceRef.current
    const map = mapRef.current
    if (!source || !map) return
    const coords = source
      .getFeatures()
      .filter((f) => visibleTypes.includes(f.get('type')))
      .map((f) => f.getGeometry().getCoordinates())
    source.getFeatures().forEach((f) => {
      f.setStyle(visibleTypes.includes(f.get('type')) ? undefined : new Style())
    })
    if (!stateRef.current.selected && coords.length > 1) {
      const pad = embedded ? 56 : 80
      map.getView().fit(boundingExtent(coords), {
        padding: fitPadding || [pad, pad, pad, pad],
        duration: embedded ? 0 : 600,
        maxZoom: 14,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleTypes, itemsKey, embedded])

  // Fly to the selected item
  useEffect(() => {
    const map = mapRef.current
    const source = sourceRef.current
    if (!map || !source) return
    source.changed()
    if (!selectedKey) return
    const f = source.getFeatures().find((x) => `${x.get('type')}:${x.get('id')}` === selectedKey)
    if (!f) return
    const view = map.getView()
    view.cancelAnimations()
    const zoom = Math.max(view.getZoom() || 12, 14)
    let center = f.getGeometry().getCoordinates()
    if (focusOffset) {
      // Shift the center so the marker lands clear of any floating panel
      const res = view.getResolutionForZoom(zoom)
      const [x, y] = fromLonLat(center)
      center = toLonLat([x - focusOffset[0] * res, y - focusOffset[1] * res])
    }
    view.animate({ center, zoom, duration: 700 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey, itemsKey])

  return (
    <div className='relative h-full w-full'>
      <div ref={el} className='h-full w-full bg-mist' />
    </div>
  )
}
