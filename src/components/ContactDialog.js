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

// Wrap any button to make it open the contact form.
export default function ContactDialog({ children }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className='max-w-md gap-0 rounded-2xl border-line bg-surface p-7 text-ink shadow-sm sm:rounded-2xl'>
        <DialogHeader className='space-y-2 pb-6 text-left'>
          <DialogTitle className='text-xl'>Contact VISCA</DialogTitle>
          <DialogDescription className='text-sm leading-relaxed text-muted'>
            Ask about school visits, the university fair or joining the association.
          </DialogDescription>
        </DialogHeader>

        <ContactForm />
      </DialogContent>
    </Dialog>
  )
}
