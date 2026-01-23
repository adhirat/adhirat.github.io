import { db, storage, ref, uploadBytes, getDownloadURL, collection, addDoc, serverTimestamp } from './firebase-config.js';
import { sendContactNotification, sendNewsletterNotification } from './email-notifications.js';

/**
 * Submit Contact Form
 * Used in contact.html for the contact form submission
 * Stores in Firebase and sends email notification to admin
 */
export async function submitContactForm(data, file = null) {
    try {
        let attachmentUrl = null;

        if (file) {
            const storageRef = ref(storage, `contact-attachments/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            attachmentUrl = await getDownloadURL(snapshot.ref);
        }

        // Store in Firebase
        await addDoc(collection(db, "messages"), {
            ...data,
            attachmentUrl: attachmentUrl,
            createdAt: serverTimestamp(),
            status: "new"
        });

        // Send email notification to admin (non-blocking)
        sendContactNotification({
            ...data,
            attachmentUrl: attachmentUrl
        }).catch(err => console.warn('Email notification failed:', err));

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Subscribe to Newsletter
 * Used in app.js for the footer newsletter subscription
 * Stores in Firebase and sends email notification to admin
 */
export async function subscribeNewsletter(email) {
    try {
        // Store in Firebase
        await addDoc(collection(db, "newsletter"), {
            email: email,
            subscribedAt: serverTimestamp(),
            status: "active"
        });

        // Send email notification to admin (non-blocking)
        sendNewsletterNotification(email).catch(err => console.warn('Email notification failed:', err));

        return { success: true };
    } catch (error) {
        console.error("Newsletter Subscription Error:", error);
        return { success: false, error: error.message };
    }
}
