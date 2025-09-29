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

      <DialogContent className="max-w-md bg-neutral-900/95 backdrop-blur-xl border border-white/10 text-white rounded-xl shadow-2xl">
        <DialogHeader className="space-y-4 pb-6">
          <DialogTitle className="text-xl font-semibold text-white">
            Get in Touch
          </DialogTitle>
          <DialogDescription className="text-neutral-400 text-sm leading-relaxed">
            Have questions about VISCA or want to connect? We&apos;d love to hear from you.
          </DialogDescription>
        </DialogHeader>

        <ContactForm />
      </DialogContent>
    </Dialog>
  )
}
