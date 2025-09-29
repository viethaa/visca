import Footer from '@/components/layout/Footer'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import ContactDialog from '@/components/ContactDialog'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ExternalLink, Phone, MapPin, Star, Wifi, Car, Coffee, Dumbbell, Users, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Hotels() {
  // Navigation state for slider
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const itemRefs = useRef({})
  const [slider, setSlider] = useState({ left: 0, width: 0 })

  // Carousel state for each hotel
  const [currentImageIndex, setCurrentImageIndex] = useState({})
  const [isPaused, setIsPaused] = useState({})

  // Initialize image indices for each hotel
  useEffect(() => {
    const initialIndices = {}
    const initialPaused = {}
    featuredHotels.forEach((hotel, index) => {
      initialIndices[index] = 0
      initialPaused[index] = false
    })
    setCurrentImageIndex(initialIndices)
    setIsPaused(initialPaused)
  }, [])

  // Auto-play carousel
  useEffect(() => {
    const intervals = featuredHotels.map((hotel, index) => {
      return setInterval(() => {
        if (!isPaused[index]) {
          nextImage(index)
        }
      }, 4000) // Change image every 4 seconds
    })

    return () => {
      intervals.forEach(interval => clearInterval(interval))
    }
  }, [isPaused])

  // Carousel navigation functions
  const nextImage = (hotelIndex) => {
    const hotel = featuredHotels[hotelIndex]
    setCurrentImageIndex(prev => ({
      ...prev,
      [hotelIndex]: (prev[hotelIndex] + 1) % hotel.images.length
    }))
  }

  const prevImage = (hotelIndex) => {
    const hotel = featuredHotels[hotelIndex]
    setCurrentImageIndex(prev => ({
      ...prev,
      [hotelIndex]: prev[hotelIndex] === 0 ? hotel.images.length - 1 : prev[hotelIndex] - 1
    }))
  }

  // Touch support for carousel
  const handleTouchStart = useRef({})
  const handleTouchEnd = (hotelIndex) => (e) => {
    if (!handleTouchStart.current[hotelIndex]) return

    const touchEnd = e.changedTouches[0].clientX
    const touchStart = handleTouchStart.current[hotelIndex]
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        nextImage(hotelIndex) // Swipe left - next image
      } else {
        prevImage(hotelIndex) // Swipe right - previous image
      }
    }

    delete handleTouchStart.current[hotelIndex]
  }

  const handleTouchStartCapture = (hotelIndex) => (e) => {
    handleTouchStart.current[hotelIndex] = e.touches[0].clientX
  }

  const pathname = usePathname()

  const navLinks = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/#information", label: "School" },
      { href: "/#locations", label: "VISCA Map" },
      { href: "/hotels", label: "Hotels" },
      { href: "/#events", label: "University Visits" },
    ],
    []
  )

  const activeHref = "/hotels" // Current page

  const recalcSlider = useCallback(() => {
    const el = itemRefs.current[activeHref]
    const wrap = containerRef.current
    if (!el || !wrap) return
    const elRect = el.getBoundingClientRect()
    const wrapRect = wrap.getBoundingClientRect()
    setSlider({ left: elRect.left - wrapRect.left, width: elRect.width })
  }, [activeHref])

  useEffect(() => {
    recalcSlider()
    const t = setTimeout(recalcSlider, 0)
    return () => clearTimeout(t)
  }, [activeHref, recalcSlider])

  useEffect(() => {
    const onResize = () => recalcSlider()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [recalcSlider])

  const featuredHotels = [
    {
      name: "JW Marriott Hotel Hanoi",
      address: "8 Đỗ Đức Dục, Mễ Trì, Nam Từ Liêm, Hà Nội",
      phone: "+84 024 3833 5588",
      website: "https://www.marriott.com/en-us/hotels/hanjw-jw-marriott-hotel-hanoi/overview/",
      images: [
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/505916043.jpg?k=ca8aa03c11264fef230bcc326df5d87cca81813944e3ef876c22c2596a51862b&o=&hp=1",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/540603338.jpg?k=e8fc2761d5b7646b8905e400193659ff4170759e26da539b22591e51b3096992&o=&hp=1",
        "https://cache.marriott.com/is/image/marriotts7prod/hanjw-pool-4974:Wide-Hor?wid=1318&fit=constrain",
        "https://cache.marriott.com/is/image/marriotts7prod/jw-hanjw-french-grill-27972-26761:Wide-Hor?wid=1336&fit=constrain"
      ],
      rating: 5,
      priceRange: "$250 - $350",
      description: "Luxury 5-star hotel featuring elegant rooms, world-class dining, and exceptional service in the heart of Hanoi's business district.",
      amenities: ["Luxury", "Business Center", "Lakefront View", "Pool", "Restaurant"],
      category: "Business"
    },
    {
      name: "Sheraton Hanoi Hotel",
      address: "K5 Nghi Tàm, 11 Xuân Diệu, Tây Hồ, Hà Nội",
      phone: "+84 024 3719 9000",
      website: "https://www.marriott.com/en-us/hotels/hanhs-sheraton-hanoi-hotel/overview/",
      images: [
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/c4/7a/3e/sheraton-hanoi-hotel.jpg?w=900&h=500&s=1",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/643132236.jpg?k=d9989ac3755ff1df9a8cf769ffc83766c70748cc8b0937f9853051069dce86b3&o=&hp=1",
        "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/468395624_10163969685035410_6219667692255228122_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=3DqpWG_LEm0Q7kNvwG_INBN&_nc_oc=AdkGv-kAmkymtmvFQRiHzT916gxNGHVVx8d_d9OnXX8nHwMmI6eW7hcXif7Gy5V52nI&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=Dqwe1P63_ZiO9oh2gzVRCw&oh=00_AfZFV0EzVys7Z8mkw6WxeCD6FGoFEjgj16Y8uvw0bF7Tmg&oe=68DF3411",
        "https://cache.marriott.com/is/image/marriotts7prod/si-hanhs-oven-dor---setting-40351:Wide-Hor?wid=1336&fit=constrain"
      ],
      rating: 5,
      priceRange: "$140 - $200",
      description: "Lakeside luxury hotel offering stunning views of West Lake with premium accommodations and authentic Vietnamese hospitality.",
      amenities: ["Resort", "Lake-side", "Garden View", "Peaceful", "Award-Winning Spa"],
      category: "Lakeside"
    },
    {
      name: "InterContinental Hanoi Westlake",
      address: "5 Từ Hoa, Quảng An, Tây Hồ, Hà Nội",
      phone: "+84 024 6270 8888",
      website: "https://hanoi.intercontinental.com/",
      images: [
        "https://www.hotelscombined.com/rimg/himg/27/ed/51/leonardo-1140852-HANHB_4068417527_O-545141.jpg?width=968&height=607&crop=true",
        "https://d3rx7ba35c2ox5.cloudfront.net/-1166611616/cms/cache/v2/63f2e9a4e136e.jpg/1920x1080/fit/80/357a05bc9d87c0763359ee79cedd16ed.jpg",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/307146900.jpg?k=0a05167711c5382bbf375fe38967dcbfce8961db852e7fc347f2185c1b6f758a&o=&hp=1",
        "https://d3rx7ba35c2ox5.cloudfront.net/-1166611616/cms/cache/v2/63ec64604165d.jpg/1920x1080/fit/80/75f3f99f72146f8ecf34682785630db6.jpg"
      ],
      rating: 5,
      priceRange: "$150 - $200",
      description: "Award-winning lakefront resort offering serene luxury with traditional Vietnamese design and modern sophistication.",
      amenities: ["Premium", "Lake Access", "Pool", "Fine Dining", "Cultural Tours"],
      category: "Resort"
    },
    {
      name: "Sofitel Legend Metropole Hanoi",
      address: "15 Ngo Quyen Street, Hoan Kiem District, Hanoi Old Quarter",
      phone: "+84 24 3826 6919",
      website: "https://www.sofitel-legend-metropole-hanoi.com/",
      images: [
        "https://wnfdiary.com/wp-content/uploads/2019/03/metropole-hotel-hanoi-outside.jpg",
        "https://phgcdn.com/images/uploads/HANSL/accommodationsimages/1600x813-Sofitel-Legend-Metropole-Hanoi-Guestroom.jpg",
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/01/fb/54/c7/swimming-pool.jpg?w=700&h=-1&s=1",
        "https://d2e5ushqwiltxm.cloudfront.net/wp-content/uploads/sites/95/2016/12/21133201/MH_Le_Club-585x390.jpg"
      ],
      rating: 5,
      priceRange: "$300 - $800",
      description: "Historic luxury hotel in Hanoi’s Old Quarter, blending French colonial charm with timeless elegance since 1901. Perfect for exploring the city center.",
      amenities: ["Historic Heritage", "Central District", "Premium", "Spa", "Fine Dining"],
      category: "Historic"
    },
    {
      name: "Lotte Hotel Hanoi",
      address: "54 Liễu Giai, Cống Vị, Ba Đình, Hà Nội",
      phone: "+84 024 3333 1000",
      website: "https://www.lottehotel.com/hanoi-hotel/",
      images: [
        "https://www.hoteljob.vn/uploads/images/2022/01/04-16/avatar-41_crop_1170_400_100.jpg",
        "https://ik.imgkit.net/3vlqs5axxjf/external/ik-seo/https://www.cfmedia.vfmleonardo.com/imageRepo/7/0/139/566/651/Presidential_Suite_Bedroom2_O/Lotte-Hotel-Hanoi-Suite.jpg?tr=w-780%2Ch-437%2Cfo-auto",
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/4b/46/e9/caption.jpg?w=1200&h=-1&s=1",
        "https://img.lottehotel.com/cms/asset/2025/06/26/29244/415-9-1920-din-LTHA.webp"
      ],
      rating: 5,
      priceRange: "$350 - $500",
      description: "Modern luxury hotel in the diplomatic district offering refined accommodations with Korean hospitality and international standards.",
      amenities: ["Shopping Mall", "Rooftop Bar", "Sky-view Infinity Pool", "Multiple Restaurants"],
      category: "Modern"
    },
    {
      name: "Pan Pacific Hanoi",
      address: "1 Thanh Nien Road, Ba Dinh District, Hanoi",
      phone: "+84 24 3823 8888",
      website: "https://www.panpacific.com/en/hotels-and-resorts/pp-hanoi.html",
      images: [
        "https://image.vietgoing.com/hotel/01/12/large/vietgoing_nij2202107282.webp",
        "https://www.distantjourneys.co.uk/wp-content/uploads/2019/09/pan-pacific-hotel-deluxe-room-twin.jpg",
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/41/88/20/swimming-pool.jpg?w=700&h=-1&s=1",
        "https://www.thetraveltemple.com.au/wp-content/uploads/2018/08/PanPacificHanoi_Summit_banner_image.jpg"
      ],
      rating: 5,
      priceRange: "$125 - $150",
      description: "Contemporary luxury hotel overlooking West Lake, offering sophisticated accommodations with panoramic lake views and world-class amenities.",
      amenities: ["Lake View", "Executive Lounge", "Spa", "Business Center", "Fine Dining"],
      category: "Contemporary"
    },
    {
      name: "Hilton Hanoi Opera",
      address: "1 Le Thanh Tong Street, Hoan Kiem District, Hanoi",
      phone: "+84 24 3933 0500",
      website: "https://www.hilton.com/en/hotels/hanhihi-hilton-hanoi-opera/",
      images: [
        "https://cdnphoto.dantri.com.vn/SWRXp4ZBe7mm0B_C9JCmEkdPai0=/zoom/1200_630/2021/03/04/hilton-1614827904717.jpg",
        "https://lilystravelagency.com/wp-content/uploads/2024/09/hanoi-opera-house3.png",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/483817070.jpg?k=968c7080b2a0219783dd013fe2a2fda59d7d3b918731db90608283c7ab692e82&o=&hp=1",
        "https://monkeymiles.boardingarea.com/wp-content/uploads/2017/03/Hanoi-Hilton-Opera-75-of-83.jpg"
      ],
      rating: 5,
      priceRange: "$100 - $160",
      description: "Elegant hotel in the heart of Hanoi, steps from the Opera House and Old Quarter, offering refined luxury with exceptional service and prime location.",
      amenities: ["Opera House View", "Central Location", "Executive Floors", "Fitness Center"],
      category: "Urban"
    },
    {
      name: "Melia Hanoi",
      address: "44B Ly Thuong Kiet Street, Hoan Kiem District, Hanoi",
      phone: "+84 24 3934 3343",
      website: "https://www.melia.com/en/hotels/vietnam/hanoi/melia-hanoi",
      images: [
        "https://vdstravel.com/wp-content/uploads/2025/09/21.jpg",
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/33/59/48/caption.jpg?w=900&h=500&s=1",
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/5c/fd/04/swimming-pool.jpg?w=700&h=-1&s=1",
        "https://www.top25restaurants.com/media/news/MeliaHN_ChamRestaurant2.jpg"
      ],
      rating: 5,
      priceRange: "$100 - $150",
      description: "Sophisticated Spanish hospitality in central Hanoi, featuring contemporary design and premium amenities near key attractions and business districts.",
      amenities: ["Spanish Hospitality", "Central District", "Rooftop Pool", "Spa Services"],
      category: "International"
    },
  ]

  const getThemeColors = (theme) => {
    const themes = {
      blue: {
        accent: "from-neutral-400 to-neutral-300",
        button: "bg-white hover:bg-neutral-100 text-black",
        border: "border-neutral-600/50",
        text: "text-neutral-300",
        bg: "bg-neutral-800/30"
      },
      emerald: {
        accent: "from-neutral-400 to-neutral-300",
        button: "bg-white hover:bg-neutral-100 text-black",
        border: "border-neutral-600/50",
        text: "text-neutral-300",
        bg: "bg-neutral-800/30"
      },
      purple: {
        accent: "from-neutral-400 to-neutral-300",
        button: "bg-white hover:bg-neutral-100 text-black",
        border: "border-neutral-600/50",
        text: "text-neutral-300",
        bg: "bg-neutral-800/30"
      },
      orange: {
        accent: "from-neutral-400 to-neutral-300",
        button: "bg-white hover:bg-neutral-100 text-black",
        border: "border-neutral-600/50",
        text: "text-neutral-300",
        bg: "bg-neutral-800/30"
      }
    }
    return themes[theme] || themes.blue
  }

  return (
    <>
      <Head>
        <title>Hotels | VISCA</title>
        <meta name="description" content="Premium hotels for VISCA events and university visits in Hanoi - JW Marriott, Sheraton, InterContinental, and Lotte Hotel" />
      </Head>

      <div className="flex min-h-screen flex-col">
        {/* Custom Navbar with Slider */}
        <div className="fixed inset-x-0 top-0 z-[1000] border-b border-white/10 bg-black/20 backdrop-blur-md">
          <div className="relative flex h-16 items-center px-4 md:px-6">
            <div className="flex-none">
              <div className="rounded-md bg-neutral-900/95 px-3 py-2 border border-white/10 shadow-sm">
                <span className="text-white font-bold tracking-widest text-xs">VISCA</span>
              </div>
            </div>

            <nav
              ref={containerRef}
              className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8"
            >
              <span
                className="pointer-events-none absolute -bottom-2 h-[2px] rounded-full bg-white transition-all duration-300 ease-out"
                style={{ left: slider.left, width: slider.width }}
              />
              {navLinks.map((link) => {
                const isActive = link.href === activeHref
                return (
                  <Link key={link.href} href={link.href} className="px-2">
                    <span
                      ref={(el) => (itemRefs.current[link.href] = el)}
                      className={[
                        "text-sm font-medium tracking-wide transition-colors",
                        isActive ? "text-white font-semibold" : "text-white/80 hover:text-white",
                      ].join(" ")}
                    >
                      {link.label}
                    </span>
                  </Link>
                )
              })}
            </nav>

            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="md:hidden rounded-xl border border-white/15 bg-black/80 px-3 py-2 hover:bg-black/85 transition ml-3"
            >
              <span className="sr-only">Open menu</span>
              <div className="space-y-1.5">
                <span className="block h-0.5 w-5 bg-white" />
                <span className="block h-0.5 w-5 bg-white" />
                <span className="block h-0.5 w-5 bg-white" />
              </div>
            </button>

            <div className="flex-none ml-auto">
              <ContactDialog asChild>
                <button className="inline-flex items-center justify-center rounded-full border border-white/15 bg-black/60 px-5 py-2 text-sm font-medium text-white/90 shadow-md backdrop-blur hover:border-white/35 hover:text-white">
                  Contact
                </button>
              </ContactDialog>
            </div>
          </div>

          {open && (
            <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-md z-[1000]">
              <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
                {navLinks.map((link) => {
                  const isActive = link.href === activeHref
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={[
                        "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive ? "text-white" : "text-white/85 hover:text-white",
                      ].join(" ")}
                    >
                      {link.label}
                    </Link>
                  )
                })}
                <ContactDialog asChild>
                  <button
                    onClick={() => setOpen(false)}
                    className="mt-2 inline-flex items-center justify-center rounded-full border border-white/15 bg-black/70 px-5 py-2 text-sm font-medium text-white/90 shadow-md backdrop-blur hover:border-white/35 hover:text-white"
                  >
                    Contact
                  </button>
                </ContactDialog>
              </div>
            </div>
          )}
        </div>

        <main className="flex-grow bg-gradient-to-br from-black via-neutral-950 to-black text-white pt-16">
          {/* Clean Hero Banner */}
          <div className="relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/50 to-transparent"></div>

            <div className="relative py-20 sm:py-24 lg:py-32">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  {/* Clean Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 mb-8">
                    <Star className="w-4 h-4 text-neutral-400 fill-current" />
                    <span className="text-sm font-medium text-neutral-300">5-Star Premium Properties</span>
                  </div>

                  {/* Clean Title with Gradient */}
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-neutral-200 to-white bg-clip-text text-transparent">
                    Premium Hotels
                  </h1>

                  {/* Clean Subtitle in Box */}
                  <div className="inline-block px-4 py-2 bg-neutral-800/30 backdrop-blur-sm border border-neutral-700/20 rounded-md mx-auto mb-12">
                    <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
                      Exceptional accommodations for VISCA events and university visits in Hanoi
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto p-4 sm:p-8">
            <div className="flex flex-col gap-10">

              {/* Hotels List */}
              <div className="space-y-16">
                {featuredHotels.map((hotel, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-lg bg-neutral-900/30 border border-white/30 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className="flex flex-col lg:flex-row">
                      {/* Hotel Image Carousel */}
                      <div
                        className="relative w-full lg:w-80 h-64 lg:h-auto lg:min-h-[300px] lg:flex-shrink-0 overflow-hidden group/carousel"
                        onTouchStart={handleTouchStartCapture(index)}
                        onTouchEnd={handleTouchEnd(index)}
                        onMouseEnter={() => setIsPaused(prev => ({ ...prev, [index]: true }))}
                        onMouseLeave={() => setIsPaused(prev => ({ ...prev, [index]: false }))}
                      >
                        <Image
                          src={hotel.images[currentImageIndex[index] || 0]}
                          alt={`${hotel.name} - Image ${(currentImageIndex[index] || 0) + 1}`}
                          fill
                          className="object-cover transition-all duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/30 via-transparent to-transparent" />

                        {/* Carousel Navigation */}
                        <button
                          onClick={() => prevImage(index)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 backdrop-blur-sm"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => nextImage(index)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 backdrop-blur-sm"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>

                        {/* Image Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {hotel.images.map((_, imageIndex) => (
                            <button
                              key={imageIndex}
                              onClick={() => setCurrentImageIndex(prev => ({ ...prev, [index]: imageIndex }))}
                              className={`w-2 h-2 rounded-full transition-all duration-200 ${(currentImageIndex[index] || 0) === imageIndex
                                ? 'bg-white'
                                : 'bg-white/40 hover:bg-white/70'
                                }`}
                            />
                          ))}
                        </div>

                        {/* Rating Badge */}
                        <div className="absolute top-4 left-4 flex items-center gap-1 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{hotel.rating}.0</span>
                        </div>

                        {/* Image Counter */}
                        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
                          {(currentImageIndex[index] || 0) + 1} / {hotel.images.length}
                        </div>
                      </div>

                      {/* Hotel Information */}
                      <div className="flex-1 p-8 flex flex-col justify-between">
                        {/* Top Section - Name & Location */}
                        <div className="mb-6">
                          <h3 className="text-2xl font-bold text-white mb-4">
                            {hotel.name}
                          </h3>

                          {/* Location in school format */}
                          <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-800/40 rounded-md border border-gray-600/40">
                            <MapPin className="h-3 w-3 text-gray-400 shrink-0" />
                            <span className="text-xs text-gray-300 font-medium leading-tight">{hotel.address}</span>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                          <p className="text-neutral-300 text-base leading-relaxed">
                            {hotel.description}
                          </p>
                        </div>

                        {/* Details Grid */}
                        <div className="mb-6 space-y-4">
                          {/* Contact */}
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-neutral-800/50 rounded-lg flex items-center justify-center">
                              <Phone className="w-4 h-4 text-neutral-400" />
                            </div>
                            <span className="text-neutral-300 text-sm">{hotel.phone}</span>
                          </div>

                          {/* Amenities */}
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-neutral-800/50 rounded-lg flex items-center justify-center">
                              <Coffee className="w-4 h-4 text-neutral-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap gap-2">
                                {hotel.amenities.map((amenity, i) => (
                                  <span
                                    key={i}
                                    className="px-3 py-1 bg-neutral-800/50 rounded-full text-xs text-neutral-300 border border-neutral-700/40"
                                  >
                                    {amenity}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          {/* Price */}
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-neutral-800/50 rounded-lg flex items-center justify-center">
                              <span className="text-green-400 text-sm font-bold">$</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-800/40 rounded-md border border-neutral-700/30">
                              <span className="text-white font-medium text-sm">
                                {hotel.priceRange}
                              </span>
                              <span className="text-neutral-500 text-xs">
                                per night
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Section - Actions */}
                        <div className="mt-auto pt-4">
                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <a
                              href={hotel.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/30"
                            >
                              Book Now
                            </a>
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.address)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-6 py-2.5 bg-neutral-900/60 hover:bg-neutral-800/80 text-neutral-300 hover:text-white text-sm font-medium rounded-lg transition-all duration-200 backdrop-blur-sm border border-neutral-700/50 hover:border-neutral-600/70"
                            >
                              View Map
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Information - Simplified */}
              <div className="mt-16 pt-8 border-t border-white/10">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Why Choose These Hotels?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Star className="w-5 h-5 text-white/80" />
                      </div>
                      <h4 className="font-medium text-white/90 mb-2 text-sm">Premium Quality</h4>
                      <p className="text-white/60 text-xs">5-star properties with exceptional service</p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <MapPin className="w-5 h-5 text-white/80" />
                      </div>
                      <h4 className="font-medium text-white/90 mb-2 text-sm">Strategic Locations</h4>
                      <p className="text-white/60 text-xs">Convenient access to VISCA venues</p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Users className="w-5 h-5 text-white/80" />
                      </div>
                      <h4 className="font-medium text-white/90 mb-2 text-sm">Business Facilities</h4>
                      <p className="text-white/60 text-xs">Meeting rooms for university visits</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </>
  )
}
