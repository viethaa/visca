// Single source for hotels, used by the hotels page and the map.
const LIST = [
  {
    id: 'jw-marriott',
    name: 'JW Marriott Hotel Hanoi',
    area: 'Nam Từ Liêm',
    address: '8 Đỗ Đức Dục, Mễ Trì, Nam Từ Liêm, Hà Nội',
    phone: '+84 24 3833 5588',
    website: 'https://www.marriott.com/en-us/hotels/hanjw-jw-marriott-hotel-hanoi/overview/',
    latitude: 21.0025056,
    longitude: 105.7620046,
    priceRange: '$250 – $350',
    description:
      'Large business hotel beside the National Convention Center, with a lakefront pool and several restaurants. Convenient for schools on the west side of the city.',
    amenities: ['Business center', 'Pool', 'Lake view', 'Restaurants'],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Marriott_hotels_logo14.svg/2560px-Marriott_hotels_logo14.svg.png',
  },
  {
    id: 'sheraton',
    name: 'Sheraton Hanoi Hotel',
    area: 'Tây Hồ',
    address: 'K5 Nghi Tàm, 11 Xuân Diệu, Tây Hồ, Hà Nội',
    phone: '+84 24 3719 9000',
    website: 'https://www.marriott.com/en-us/hotels/hanhs-sheraton-hanoi-hotel/overview/',
    latitude: 21.0597,
    longitude: 105.8317,
    priceRange: '$140 – $200',
    description:
      'Garden hotel on the shore of West Lake, with a spa, an outdoor pool and quiet lakeside grounds.',
    amenities: ['West Lake', 'Garden', 'Spa', 'Pool'],
    logo: 'https://i.pinimg.com/1200x/b6/22/34/b6223414735309ceb097722445fb15fa.jpg',
  },
  {
    id: 'intercontinental',
    name: 'InterContinental Hanoi Westlake',
    area: 'Tây Hồ',
    address: '5 Từ Hoa, Quảng An, Tây Hồ, Hà Nội',
    phone: '+84 24 6270 8888',
    website: 'https://hanoi.intercontinental.com/',
    latitude: 21.0584,
    longitude: 105.8315,
    priceRange: '$150 – $200',
    description:
      'Rooms and pavilions built out over West Lake, with traditional Vietnamese design, a pool and fine dining.',
    amenities: ['On the lake', 'Pool', 'Fine dining', 'Cultural tours'],
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3Xkfs1V0wYSOEp4fkX1LVhFAbNYcInx_12g&s',
  },
  {
    id: 'metropole',
    name: 'Sofitel Legend Metropole Hanoi',
    area: 'Hoàn Kiếm',
    address: '15 Ngô Quyền, Tràng Tiền, Hoàn Kiếm, Hà Nội',
    phone: '+84 24 3826 6919',
    website: 'https://www.sofitel-legend-metropole-hanoi.com/',
    latitude: 21.0226,
    longitude: 105.8544,
    priceRange: '$300 – $800',
    description:
      'Hanoi’s landmark French colonial hotel, open since 1901. Walking distance to Hoàn Kiếm Lake and the Old Quarter.',
    amenities: ['Historic', 'Old Quarter', 'Spa', 'Fine dining'],
    logo: 'https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsiZGF0YSI6ODAxODYzLCJwdXIiOiJibG9iX2lkIn19--72d36f30567c78a0455b991faeee3a5dcd936e0d/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGVnIiwicmVzaXplX3RvX2xpbWl0IjpbMzAwLDMwMF19LCJwdXIiOiJ2YXJpYXRpb24ifX0=--db34d5bc70e9225d5618c44e324a0c025a152b2b/sofitel-legend-metropole-hanoi-logo.jpeg',
  },
  {
    id: 'lotte',
    name: 'Lotte Hotel Hanoi',
    area: 'Ba Đình',
    address: '54 Liễu Giai, Cống Vị, Ba Đình, Hà Nội',
    phone: '+84 24 3333 1000',
    website: 'https://www.lottehotel.com/hanoi-hotel/',
    latitude: 21.0349,
    longitude: 105.8158,
    priceRange: '$350 – $500',
    description:
      'Upper floors of the Lotte Center tower in the diplomatic district, with a rooftop bar, sky pool and a shopping mall downstairs.',
    amenities: ['Sky pool', 'Rooftop bar', 'Shopping mall', 'Restaurants'],
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeEVlcsvc2_Oc61p14bvjudZM3mF0tyXw15g&s',
  },
  {
    id: 'pan-pacific',
    name: 'Pan Pacific Hanoi',
    area: 'Ba Đình',
    address: '1 Thanh Niên, Trúc Bạch, Ba Đình, Hà Nội',
    phone: '+84 24 3823 8888',
    website: 'https://www.panpacific.com/en/hotels-and-resorts/pp-hanoi.html',
    latitude: 21.0545,
    longitude: 105.8353,
    priceRange: '$125 – $150',
    description:
      'Between West Lake and Trúc Bạch Lake, with wide lake views, an executive lounge and a spa. Good value for its location.',
    amenities: ['Lake view', 'Executive lounge', 'Spa', 'Business center'],
    logo: 'https://ucarecdn.com/cdedc68e-43d7-4a01-95bc-e2e3ed0b2232/-/crop/1996x2000/0,0/-/preview/',
  },
  {
    id: 'hilton-opera',
    name: 'Hilton Hanoi Opera',
    area: 'Hoàn Kiếm',
    address: '1 Lê Thánh Tông, Tràng Tiền, Hoàn Kiếm, Hà Nội',
    phone: '+84 24 3933 0500',
    website: 'https://www.hilton.com/en/hotels/hanhihi-hilton-hanoi-opera/',
    latitude: 21.0235,
    longitude: 105.8562,
    priceRange: '$100 – $160',
    description:
      'Next to the Opera House, a short walk from the Old Quarter. Executive floors and a fitness center.',
    amenities: ['Opera House', 'Central', 'Executive floors', 'Fitness center'],
    logo: 'https://tiff.vn/wp-content/uploads/2023/07/Hilton-Hanoi-Opera-570x570-1-1.jpg',
  },
  {
    id: 'melia',
    name: 'Melia Hanoi',
    area: 'Hoàn Kiếm',
    address: '44B Lý Thường Kiệt, Trần Hưng Đạo, Hoàn Kiếm, Hà Nội',
    phone: '+84 24 3934 3343',
    website: 'https://www.melia.com/en/hotels/vietnam/hanoi/melia-hanoi',
    latitude: 21.0208,
    longitude: 105.8505,
    priceRange: '$100 – $150',
    description:
      'Central business hotel near the lake and the embassies, with a rooftop pool and spa.',
    amenities: ['Central', 'Rooftop pool', 'Spa', 'Business center'],
    logo: 'https://static.ybox.vn/2017/10/25/7bea0dd4-b96a-11e7-b82f-2e995a9a3302.GIF',
  },
]

// Photos live in /public/hotels (exterior first). Counts per hotel come from the files saved there.
const COUNTS = {
  'jw-marriott': 4,
  sheraton: 5,
  intercontinental: 4,
  metropole: 4,
  lotte: 5,
  'pan-pacific': 5,
  'hilton-opera': 4,
  melia: 4,
}

// Credits required by the photos' licenses (Wikimedia Commons). Keyed by file path.
// Hilton and Melia (Daaé, public domain) and Pan Pacific (Amenoc, CC0) need none.
export const PHOTO_CREDITS = {
  '/hotels/lotte.jpg': 'Photo: Kallerna, CC BY-SA 4.0',
  '/hotels/sheraton-2.jpg': 'Photo: Quacam555, CC BY-SA 4.0',
  '/hotels/metropole.jpg': 'Photo: Richard Mortel, CC BY 2.0',
  '/hotels/intercontinental.jpg': 'Photo: missbossy, CC BY 2.0',
}

export const HOTELS = LIST.map((h) => {
  const images = [`/hotels/${h.id}.jpg`]
  for (let i = 2; i <= (COUNTS[h.id] || 1); i++) images.push(`/hotels/${h.id}-${i}.jpg`)
  return { ...h, images, exterior: images[0], credit: PHOTO_CREDITS[images[0]] || null }
})

export const HOTEL_AREAS = ['All areas', ...Array.from(new Set(HOTELS.map((h) => h.area)))]

export const directionsUrl = (address) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
