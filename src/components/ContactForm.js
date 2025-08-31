import React from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

export default function ContactForm() {
  return (
    <form id='contact-form' name='contact-form' className='space-y-6 mt-6' netlify>
      <input type='hidden' name='form-name' value='contact-form' />

      <div className='space-y-2'>
        <Label
          htmlFor='nameOrOrganization'
          className="text-gray-300 font-medium text-sm"
        >
          Name/Organization
        </Label>
        <Input
          type='text'
          id='nameOrOrganization'
          name='nameOrOrganization'
          placeholder='Enter your name or organization'
          required
          className="bg-gray-800/70 backdrop-blur-sm border-gray-700 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-all"
        />
      </div>

      <div className='space-y-2'>
        <Label
          htmlFor='email'
          className="text-gray-300 font-medium text-sm"
        >
          Email
        </Label>
        <Input
          type='email'
          id='email'
          name='email'
          placeholder='Enter your email'
          required
          className="bg-gray-800/70 backdrop-blur-sm border-gray-700 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-all"
        />
      </div>

      <div className='space-y-2'>
        <Label
          htmlFor='message'
          className="text-gray-300 font-medium text-sm"
        >
          Message
        </Label>
        <Textarea
          id='message'
          name='message'
          rows={4}
          placeholder='Enter your message'
          required
          className="bg-gray-800/70 backdrop-blur-sm border-gray-700 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-all resize-none"
        />
      </div>

      <button
        type='submit'
        className='w-full bg-gray-900/80 backdrop-blur-sm hover:bg-gray-900 text-white font-medium px-6 py-3 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600'
      >
        Send Message
      </button>
    </form>
  )
}
