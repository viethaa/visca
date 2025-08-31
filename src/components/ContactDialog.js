import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import ContactForm from './ContactForm'

export default function ContactDialog() {
  return (
    <Dialog>
      <DialogTrigger className="group relative rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-zinc-100 transition-all hover:bg-white/10 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 active:scale-[0.99]">
        Contact
      </DialogTrigger>

      <DialogContent className="max-w-lg bg-gray-950/80 backdrop-blur-2xl border-[4px] border-gray-900 text-white rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.9)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white mb-2">
            Get in Touch
          </DialogTitle>
          <DialogDescription className="text-gray-300 leading-relaxed">
            Have a question or want to work together? We'd love to hear from you.
          </DialogDescription>
        </DialogHeader>

        <ContactForm />
      </DialogContent>
    </Dialog>
  )
}
