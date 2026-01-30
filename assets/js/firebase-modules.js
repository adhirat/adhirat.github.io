import {
    db,
    storage,
    auth,
    ref,
    uploadBytes,
    getDownloadURL,
    collection,
    addDoc,
    serverTimestamp,
    doc,
    setDoc,
    getDoc,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    onAuthStateChanged,
    GoogleAuthProvider,
    OAuthProvider,
    signInWithPopup
} from './firebase-config.js';
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

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

/**
 * Login User
 * Used in portal/login.html
 */
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store last login time
        await setDoc(doc(db, "users", user.uid), {
            lastLogin: serverTimestamp()
        }, { merge: true });

        return { success: true, user: user };
    } catch (error) {
        let errorMessage = error.message;
        // Make error messages more user-friendly
        if (error.code === 'auth/invalid-credential') {
            errorMessage = 'Invalid email or password. Please try again.';
        } else if (error.code === 'auth/user-not-found') {
            errorMessage = 'No account found with this email.';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Incorrect password.';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Too many failed attempts. Please try again later.';
        }
        return { success: false, error: errorMessage };
    }
}

/**
 * Register User
 * Used in portal/signup.html
 */
export async function registerUser(email, password, fullName) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user profile in Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: email,
            fullName: fullName,
            role: 'employee', // Default role
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
        });

        return { success: true, user: user };
    } catch (error) {
        let errorMessage = error.message;
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'An account with this email already exists.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password should be at least 6 characters.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Please enter a valid email address.';
        }
        return { success: false, error: errorMessage };
    }
}

/**
 * Logout User
 * Used in portal for logout button
 */
export async function logoutUser() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Reset Password
 * Used in portal/forgot_password.html
 */
export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
    } catch (error) {
        let errorMessage = error.message;
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'No account found with this email.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Please enter a valid email address.';
        }
        return { success: false, error: errorMessage };
    }
}

/**
 * Sign in with Google
 * Used in portal/login.html for Google OAuth
 */
export async function signInWithGoogle() {
    try {
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');

        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Create or update user profile in Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            // New user - create profile
            await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                fullName: user.displayName || user.email?.split('@')[0],
                photoURL: user.photoURL,
                provider: 'google',
                role: 'employee',
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp()
            });
        } else {
            // Existing user - update last login
            await setDoc(userDocRef, {
                lastLogin: serverTimestamp(),
                photoURL: user.photoURL
            }, { merge: true });
        }

        return { success: true, user: user };
    } catch (error) {
        let errorMessage = error.message;
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = 'Sign-in cancelled. Please try again.';
        } else if (error.code === 'auth/popup-blocked') {
            errorMessage = 'Pop-up blocked. Please allow pop-ups and try again.';
        } else if (error.code === 'auth/account-exists-with-different-credential') {
            errorMessage = 'An account already exists with this email using a different sign-in method.';
        }
        return { success: false, error: errorMessage };
    }
}

/**
 * Sign in with Apple
 * Used in portal/login.html for Apple OAuth
 */
export async function signInWithApple() {
    try {
        const provider = new OAuthProvider('apple.com');
        provider.addScope('email');
        provider.addScope('name');

        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Create or update user profile in Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            // New user - create profile
            await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                fullName: user.displayName || user.email?.split('@')[0] || 'Apple User',
                photoURL: user.photoURL,
                provider: 'apple',
                role: 'employee',
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp()
            });
        } else {
            // Existing user - update last login
            await setDoc(userDocRef, {
                lastLogin: serverTimestamp()
            }, { merge: true });
        }

        return { success: true, user: user };
    } catch (error) {
        let errorMessage = error.message;
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = 'Sign-in cancelled. Please try again.';
        } else if (error.code === 'auth/popup-blocked') {
            errorMessage = 'Pop-up blocked. Please allow pop-ups and try again.';
        } else if (error.code === 'auth/account-exists-with-different-credential') {
            errorMessage = 'An account already exists with this email using a different sign-in method.';
        }
        return { success: false, error: errorMessage };
    }
}

/**
 * Get User Profile
 * Returns user profile data from Firestore
 */
export async function getUserProfile(uid) {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    } catch (error) {
        console.error("Error getting user profile:", error);
        return null;
    }
}

/**
 * Initialize Auth Observer
 * Monitors auth state and handles redirects
 * @param {boolean} isProtected - If true, redirects unauthenticated users to login
 */
export function initAuthObserver(isProtected = false) {
    onAuthStateChanged(auth, async (user) => {
        const currentPath = window.location.pathname;
        const isLoginPage = currentPath.includes('login.html');
        const isSignupPage = currentPath.includes('signup.html');
        const isForgotPasswordPage = currentPath.includes('forgot_password.html');
        const isAuthPage = isLoginPage || isSignupPage || isForgotPasswordPage;

        if (user) {
            // User is signed in
            const profile = await getUserProfile(user.uid);

            // Update user display in UI
            updateUserDisplay(user, profile);

            // Redirect away from auth pages if already logged in
            if (isAuthPage) {
                window.location.href = 'dashboard.html';
            }
        } else {
            // User is signed out
            if (isProtected && !isAuthPage) {
                // Redirect to login if trying to access protected page
                window.location.href = 'login.html';
            }
        }
    });
}

/**
 * Update User Display
 * Updates user name and avatar in the UI
 */
function updateUserDisplay(user, profile) {
    // Update user name displays
    const nameDisplays = document.querySelectorAll('.user-name-display');
    nameDisplays.forEach(el => {
        el.textContent = profile?.fullName || user.email?.split('@')[0] || 'User';
    });

    // Update avatar displays (initials)
    const avatarDisplays = document.querySelectorAll('.user-avatar-display');
    avatarDisplays.forEach(el => {
        const name = profile?.fullName || user.email?.split('@')[0] || 'U';
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        el.textContent = initials;
    });
}

/**
 * Handle Logout
 * Global function to handle logout from any page
 */
window.handleLogout = async function () {
    const result = await logoutUser();
    if (result.success) {
        window.location.href = 'login.html';
    } else {
        alert('Logout failed: ' + result.error);
    }
};
