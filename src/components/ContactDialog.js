import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import ContactForm from './ContactForm'

export default function ContactDialog() {
  return (
    <Dialog>
      <DialogTrigger className='class="rounded-lg px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10 transition"'>
        Contact
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact Us</DialogTitle>
          <DialogDescription>
            Please fill out the form below to inquire about our website.
          </DialogDescription>
        </DialogHeader>
        <ContactForm />
      </DialogContent>
    </Dialog>
  )
}
