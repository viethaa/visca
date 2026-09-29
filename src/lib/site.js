import data from '@/data.json'

export const FAIR = {
  name: 'World University Fair 2026',
  hosts: 'Hosted by Concordia International School Hanoi and Saigon South International School',
  poster: 'https://hearts2hands.s3.ap-southeast-2.amazonaws.com/assets/images/University+Fair+Poster+2026.jpg',
  dates: [
    { city: 'Hanoi', date: '2026-04-08' },
    { city: 'Ho Chi Minh City', date: '2026-04-13' },
  ],
}

// The fair section and nav link only show until the last fair date has passed
export const fairIsUpcoming = () =>
  new Date(`${FAIR.dates[FAIR.dates.length - 1].date}T23:59:59+07:00`) >= new Date()

export const NAV_LINKS = [
  { href: '/#schools', label: 'Schools' },
  { href: '/map', label: 'Map' },
  { href: '/hotels', label: 'Hotels' },
  ...(fairIsUpcoming() ? [{ href: '/#fair', label: 'University fair' }] : []),
]

// Airport and downtown, shown on the map
export const PLACES = (data.places || []).map((p) => ({
  ...p,
  id: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
}))
