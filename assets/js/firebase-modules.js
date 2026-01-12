import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, updateProfile, doc, setDoc, getDoc, serverTimestamp, collection, addDoc } from './firebase-config.js';

// --- Auth Handling ---

/**
 * Handle User Signup
 */
export async function registerUser(name, email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update Auth Profile
        await updateProfile(user, { displayName: name });

        // Create User Document in Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            role: "user", // default role
            createdAt: serverTimestamp(),
            settings: {
                theme: "system",
                notifications: true
            }
        });

        return { success: true, user: user };
    } catch (error) {
        console.error("Signup Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Handle User Login
 */
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error("Login Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Handle Logout
 */
export async function logoutUser() {
    try {
        await signOut(auth);
        window.location.href = '../portal/login.html';
        return { success: true };
    } catch (error) {
        console.error("Logout Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Send Password Reset Email
 */
export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
    } catch (error) {
        console.error("Reset Password Error:", error);
        return { success: false, error: error.message };
    }
}

// --- Auth State Observer ---

export function initAuthObserver(protectedRoute = false) {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log("User is signed in:", user.uid);

            // If on login/signup pages, redirect to dashboard
            const path = window.location.pathname;
            if (path.includes('login.html') || path.includes('signup.html')) {
                window.location.href = 'dashboard.html';
            }

            // Update UI with user info if available elements exist
            updateUserUI(user);

        } else {
            console.log("User is signed out");

            // If on a protected route, redirect to login
            if (protectedRoute) {
                // Check if we are in the portal directory but not on login/signup/reset
                const path = window.location.pathname;
                const isAuthPage = path.includes('login.html') || path.includes('signup.html') || path.includes('forgot_password.html') || path.includes('registration.html');

                if (!isAuthPage) {
                    // Adjust path based on where we are
                    window.location.href = 'login.html';
                }
            }
        }
    });
}

function updateUserUI(user) {
    // Update Profile Name in Sidebar/Header
    const profileNames = document.querySelectorAll('.user-name-display');
    profileNames.forEach(el => el.textContent = user.displayName || user.email.split('@')[0]);

    // Update Profile Avatar/Initials
    const profileAvatars = document.querySelectorAll('.user-avatar-display');
    profileAvatars.forEach(el => {
        const initials = (user.displayName || user.email).slice(0, 2).toUpperCase();
        el.textContent = initials;
    });
}


// --- Generic Data Functions ---

/**
 * Submit Contact Form
 */
export async function submitContactForm(data) {
    try {
        await addDoc(collection(db, "messages"), {
            ...data,
            createdAt: serverTimestamp(),
            status: "new"
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Expose Logout Globally for Sidebar
window.handleLogout = async () => {
    await logoutUser();
};
