// Logos kept here so the directory, map and sheets all agree.
export const SCHOOL_LOGOS = {
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
  'Westlink International School': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRc4pyuhM9E6F0_8v7IbI7Xeev4ZvuxSR7Inw&s',
  'Brighton College': '/schools/brighton-logo.png',
  'Fairmont International School Vietnam': '/schools/fairmont-logo.png',
}

// Campus photos kept in /public/schools so they never break: the school-supplied photo
// first (where there is one), then 3–4 picked from each school's own website.
// These take priority over the sheet's picture column.
const gallery = (key, n) => Array.from({ length: n }, (_, i) => `/schools/${key}-${i + 1}.jpg`)
export const SCHOOL_PHOTOS = {
  'Concordia International School Hanoi': gallery('concordia', 4),
  'St. Paul American School Hanoi': gallery('st-paul', 4),
  'British Vietnamese International School Hanoi': gallery('bvis', 3),
  'UNIS Hanoi': gallery('unis', 4),
  'TH School': ['/schools/th-school.webp', ...gallery('th-school', 3)],
  'British International School Hanoi': gallery('bis', 4),
  'The Olympia Schools': gallery('olympia', 4),
  'The Dewey Schools': gallery('dewey', 4),
  'Delta Global School': gallery('delta', 4),
  'Hanoi International School': gallery('his', 4),
  'Westlink International School': ['/schools/westlink.webp', ...gallery('westlink', 3)],
  'Brighton College': ['/schools/brighton.webp', ...gallery('brighton', 3)],
  'Fairmont International School Vietnam': ['/schools/fairmont.webp', ...gallery('fairmont', 3)],
}

const clean = (v) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : v == null ? '' : String(v).trim())

const toNumber = (v) => {
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : null
}

export const slugify = (name = '') =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

// The picture column may hold several URLs separated by spaces, new lines, or a comma or
// semicolon before the next link. Commas inside a URL (e.g. f_auto,q_auto) are kept.
const toUrls = (v) =>
  String(v ?? '')
    .split(/\s+|[,;](?=\s*https?:\/\/)/)
    .map((u) => u.trim())
    .filter((u) => /^https?:\/\//.test(u))

// Accepts both the Google Sheet shape and the local data.json shape.
export function normalizeSchool(raw = {}) {
  const name = clean(raw.name ?? raw.school_name)
  const sheetPics = toUrls(raw.pic ?? raw.image_url)
  const local = SCHOOL_PHOTOS[name] || []
  const pics = local.length ? local : sheetPics
  // The email cell sometimes holds several addresses ("a@x.vn and b@x.vn")
  const emailCell = clean(raw.counselor_email)
  const emails = emailCell.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) || []
  return {
    id: slugify(name),
    name,
    address: clean(raw.address ?? raw.school_address),
    counselor_name: clean(raw.counselor_name),
    counselor_email: emails.length ? emails.join(', ') : emailCell,
    emails,
    counselor_phone: clean(raw.counselor_phone),
    contact_point: clean(raw.contact_point),
    notes: clean(raw.notes),
    preferred_time: clean(raw.preferred_time),
    profile: clean(raw.profile ?? raw.school_profile),
    website: clean(raw.website ?? raw.school_website),
    calendar: clean(raw.calendar),
    pic: pics[0] || '',
    pics,
    logo: SCHOOL_LOGOS[name] || clean(raw.logo ?? raw.logo_url),
    latitude: toNumber(raw.latitude),
    longitude: toNumber(raw.longitude),
  }
}

export const visitSlots = (school) =>
  (school?.preferred_time || '')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    // The sheet refers to its own layout ("link above"); point to the booking details instead
    .map((s) => (/link above/i.test(s) ? 'See booking link' : s))

// One link that addresses every counselor listed for the school
export const mailtoHref = (school, subject) =>
  `mailto:${(school?.emails?.length ? school.emails : [school?.counselor_email]).join(',')}${
    subject ? `?subject=${encodeURIComponent(subject)}` : ''
  }`

// Hanoi districts, longest first so "Nam Từ Liêm" wins over a shorter match
const DISTRICTS = [
  'Bắc Từ Liêm',
  'Nam Từ Liêm',
  'Hai Bà Trưng',
  'Thanh Xuân',
  'Hoàn Kiếm',
  'Hoàng Mai',
  'Long Biên',
  'Hoài Đức',
  'Cầu Giấy',
  'Ba Đình',
  'Đống Đa',
  'Đông Anh',
  'Gia Lâm',
  'Hà Đông',
  'Tây Hồ',
]
// A few addresses name a landmark instead of the district
const LANDMARKS = { 'Royal City': 'Thanh Xuân' }

// "G9, Khu đô thị Ciputra, Tây Hồ, Hà Nội, Vietnam" -> "Tây Hồ, Hà Nội"
export const districtOf = (address = '') => {
  const district =
    DISTRICTS.find((d) => address.includes(d)) || Object.entries(LANDMARKS).find(([k]) => address.includes(k))?.[1]
  return district ? `${district}, Hà Nội` : 'Hà Nội'
}
