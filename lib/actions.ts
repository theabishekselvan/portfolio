'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { ContactFormSchema, NewsletterFormSchema } from '@/lib/schemas'
import ContactFormEmail from '@/emails/contact-form-email'

type ContactFormInputs = z.infer<typeof ContactFormSchema>
type NewsletterFormInputs = z.infer<typeof NewsletterFormSchema>
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(data: ContactFormInputs) {
  const result = ContactFormSchema.safeParse(data)

  if (result.error) {
    return { error: result.error.format() }
  }

  try {
    const { name, email, message } = result.data
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: 'onboarding@resend.dev',  // Use this for testing
      to: ['delivered@resend.dev'],
      cc: ['onboarding@resend.dev'],
      subject: 'Contact form submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      react: ContactFormEmail({ name, email, message })
    })

    if (!resendData || resendError) {
      console.error('Resend error:', resendError);
      return { error: `Failed to send email: ${resendError?.message || 'Unknown error'}` }
    }

    return { success: true }
  } catch (error) {
    console.error('Caught error:', error);
    return { error: `An error occurred: ${error instanceof Error ? error.message : String(error)}` }
  }
}

export async function subscribe(data: NewsletterFormInputs) {
  const result = NewsletterFormSchema.safeParse(data)

  if (result.error) {
    return { error: result.error.format() }
  }

  try {
    const { email } = result.data
    const { data: resendData, error: resendError } = await resend.contacts.create({
      email: email,
      audienceId: process.env.RESEND_AUDIENCE_ID as string
    })

    if (!resendData || resendError) {
      console.error('Resend error:', resendError);
      return { error: `Failed to subscribe: ${resendError?.message || 'Unknown error'}` }
    }

    // TODO: Send a welcome email

    return { success: true }
  } catch (error) {
    console.error('Caught error:', error);
    return { error: `An error occurred: ${error instanceof Error ? error.message : String(error)}` }
  }
}
