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
      <DialogTrigger className='bg-gray-700 px-3 py-1.5 rounded hover:bg-gray-500 flex items-center justify-center'>
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
