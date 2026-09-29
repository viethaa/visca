import AdDialog from '../AdDialog'
import { FAIR, fairIsUpcoming } from '@/lib/site'

const fmt = (iso) =>
  new Date(`${iso}T12:00:00+07:00`).toLocaleDateString('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

export default function FairStrip() {
  // Hidden once the fair is over; update FAIR in lib/site.js for the next one
  if (!fairIsUpcoming()) return null

  return (
    <section id='fair' className='band-light band border-t border-line'>
      <div className='wrap grid gap-8 md:grid-cols-12'>
        <h2 className='t-display md:col-span-4'>University fair</h2>

        <div className='md:col-span-8'>
          <h3 className='t-heading'>{FAIR.name}</h3>
          <p className='mt-2 max-w-prose text-muted'>{FAIR.hosts}.</p>

          <dl className='mt-6 max-w-md divide-y divide-line border-y border-line text-[15px]'>
            {FAIR.dates.map((d) => (
              <div key={d.city} className='flex justify-between gap-4 py-3'>
                <dt>{d.city}</dt>
                <dd className='tabular-nums text-muted'>{fmt(d.date)}</dd>
              </div>
            ))}
          </dl>

          <AdDialog>
            <button className='text-link mt-6'>View the poster</button>
          </AdDialog>
        </div>
      </div>
    </section>
  )
}
