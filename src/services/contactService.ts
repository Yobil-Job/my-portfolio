
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { Timestamp } from "firebase/firestore";

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactMessage extends ContactFormData {
  timestamp: Timestamp;
}

export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; message: string }> {
  if (!db || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.warn("Firebase project ID not configured or Firestore DB not initialized. Simulating form submission.");
    // Fallback to simulation if Firebase is not configured
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate success/failure
    if (data.email.includes("error@example.com")) { // specific email for simulated error
      return { success: false, message: "Simulated server error (Firebase not configured or email is error@example.com)." };
    }
    return { success: true, message: "Message sent successfully! (Simulated - Firebase not fully configured)" };
  }

  try {
    await addDoc(collection(db, "contactMessages"), {
      ...data,
      timestamp: serverTimestamp(),
    });
    return { success: true, message: "Your message has been sent successfully! I'll get back to you soon." };
  } catch (error) {
    console.error("Error submitting contact form to Firebase:", error);
    let errorMessage = "There was an error sending your message. Please try again later.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, message: errorMessage };
  }
}
