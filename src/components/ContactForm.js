import React from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

export default function ContactForm() {
  return (
    <form id='contact-form' name='contact-form' className='space-y-5' netlify>
      <input type='hidden' name='form-name' value='contact-form' />

      <div className='space-y-2'>
        <Label
          htmlFor='nameOrOrganization'
          className="text-neutral-300 font-medium text-sm"
        >
          Name/Organization
        </Label>
        <Input
          type='text'
          id='nameOrOrganization'
          name='nameOrOrganization'
          placeholder='Your name or organization'
          required
          className="bg-neutral-800/50 backdrop-blur-sm border-neutral-700/50 text-white placeholder-neutral-500 rounded-lg px-4 py-3 focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600/50 transition-all hover:border-neutral-600/70"
        />
      </div>

      <div className='space-y-2'>
        <Label
          htmlFor='email'
          className="text-neutral-300 font-medium text-sm"
        >
          Email
        </Label>
        <Input
          type='email'
          id='email'
          name='email'
          placeholder='your.email@example.com'
          required
          className="bg-neutral-800/50 backdrop-blur-sm border-neutral-700/50 text-white placeholder-neutral-500 rounded-lg px-4 py-3 focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600/50 transition-all hover:border-neutral-600/70"
        />
      </div>

      <div className='space-y-2'>
        <Label
          htmlFor='message'
          className="text-neutral-300 font-medium text-sm"
        >
          Message
        </Label>
        <Textarea
          id='message'
          name='message'
          rows={4}
          placeholder='Tell us about your inquiry...'
          required
          className="bg-neutral-800/50 backdrop-blur-sm border-neutral-700/50 text-white placeholder-neutral-500 rounded-lg px-4 py-3 focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600/50 transition-all resize-none hover:border-neutral-600/70"
        />
      </div>

      <button
        type='submit'
        className='w-full bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-lg border border-white/20 hover:border-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 backdrop-blur-sm'
      >
        Send Message
      </button>
    </form>
  )
}
