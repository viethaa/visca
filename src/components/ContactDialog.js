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
      <DialogTrigger className="group relative rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-zinc-100 transition-all hover:bg-white/10 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 active:scale-[0.99]">
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
