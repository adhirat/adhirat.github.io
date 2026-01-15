import { db, storage, ref, uploadBytes, getDownloadURL, collection, addDoc, serverTimestamp } from './firebase-config.js';

/**
 * Submit Contact Form
 * Used in contact.html for the contact form submission
 */
export async function submitContactForm(data, file = null) {
    try {
        let attachmentUrl = null;

        if (file) {
            const storageRef = ref(storage, `contact-attachments/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            attachmentUrl = await getDownloadURL(snapshot.ref);
        }

        await addDoc(collection(db, "messages"), {
            ...data,
            attachmentUrl: attachmentUrl,
            createdAt: serverTimestamp(),
            status: "new"
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Subscribe to Newsletter
 * Used in app.js for the footer newsletter subscription
 */
export async function subscribeNewsletter(email) {
    try {
        await addDoc(collection(db, "newsletter"), {
            email: email,
            subscribedAt: serverTimestamp(),
            status: "active"
        });
        return { success: true };
    } catch (error) {
        console.error("Newsletter Subscription Error:", error);
        return { success: false, error: error.message };
    }
}
