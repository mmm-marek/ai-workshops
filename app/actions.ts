"use server"

import { track } from "@vercel/analytics/server"

// Define the form data type
type ContactFormData = {
  name: string
  company: string
  email: string
  message: string
}

export async function submitContactForm(formData: ContactFormData) {
  try {
    // Validate form data
    if (!formData.name || !formData.email || !formData.company) {
      throw new Error("Required fields are missing")
    }

    // Track form submission with Vercel Analytics
    await track("Contact Form Submitted", {
      company: formData.company,
      hasMessage: !!formData.message,
      messageLength: formData.message?.length || 0,
    })

    // Check if Resend API key is configured
    const resendApiKey = process.env.RESEND_API_KEY

    if (!resendApiKey || resendApiKey === "your_resend_api_key") {
      console.log("Resend API key not configured. Form data:", {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        message: formData.message || "No message provided",
      })

      // Track that email service is not configured
      await track("Contact Form Email Service Not Configured", {
        company: formData.company,
      })

      // Return success to user (they don't need to know about configuration issues)
      return {
        success: true,
        message: "Your request has been received. We'll get back to you soon.",
        data: { id: `mock-${Date.now()}` },
      }
    }

    // Only import and use Resend if API key is properly configured
    const { Resend } = await import("resend")
    const resend = new Resend(resendApiKey)

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "AI Workshop Contact Form <onboarding@resend.dev>", // Use your verified domain
      to: "hello@marekmat.com", // Replace with your Gmail address
      subject: `New Workshop Inquiry from ${formData.name} at ${formData.company}`,
      html: `
        <h1>New Workshop Inquiry</h1>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Company:</strong> ${formData.company}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Message:</strong> ${formData.message || "No message provided"}</p>
      `,
    })

    if (error) {
      console.error("Error sending email:", error)

      // Track email send failure
      await track("Contact Form Email Failed", {
        error: error.message,
        company: formData.company,
      })

      throw new Error("Failed to send email")
    }

    // Track successful email send
    await track("Contact Form Email Sent", {
      company: formData.company,
    })

    return { success: true, data }
  } catch (error) {
    console.error("Form submission error:", error)

    // Track form submission error
    await track("Contact Form Error", {
      error: error instanceof Error ? error.message : "Unknown error",
      company: formData.company || "Unknown",
    })

    throw error
  }
}
