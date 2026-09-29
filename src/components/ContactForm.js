import React from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

const field =
  'h-11 rounded-2xl border-line bg-surface px-3 text-[15px] text-ink placeholder:text-muted/70 transition-colors focus-visible:border-ink focus-visible:ring-0 focus-visible:ring-offset-0'

export default function ContactForm() {
  return (
    <form id='contact-form' name='contact-form' className='space-y-4' netlify>
      <input type='hidden' name='form-name' value='contact-form' />

      <div className='space-y-1.5'>
        <Label htmlFor='nameOrOrganization' className='text-sm'>
          Name or organization
        </Label>
        <Input type='text' id='nameOrOrganization' name='nameOrOrganization' autoComplete='organization' required className={field} />
      </div>

      <div className='space-y-1.5'>
        <Label htmlFor='email' className='text-sm'>
          Email
        </Label>
        <Input type='email' id='email' name='email' autoComplete='email' required className={field} />
      </div>

      <div className='space-y-1.5'>
        <Label htmlFor='message' className='text-sm'>
          Message
        </Label>
        <Textarea id='message' name='message' rows={4} required className={`${field} h-auto resize-none py-3`} />
      </div>

      <button type='submit' className='btn-primary w-full'>
        Send message
      </button>
    </form>
  )
}
