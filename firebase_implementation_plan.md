# Firebase Backend Implementation Plan

## Phase 1: Setup & Configuration
- [ ] Create `assets/js/firebase-config.js` with configuration placeholders.
- [ ] Add Firebase SDK scripts (App, Auth, Firestore) to `global/header.html` or a centralized loader.
- [ ] Initialize Firebase in the application.

## Phase 2: Authentication (Auth)
- [ ] **Sign Up** (`signup.html`): Implement email/password registration. Create User document in Firestore upon success.
- [ ] **Login** (`login.html`): Implement email/password sign-in.
- [ ] **Logout**: Implement logout functionality in the Sidebar/Header.
- [ ] **Auth Guard**: Protect portal pages (redirect to login if not authenticated).
- [ ] **Password Reset** (`forgot_password.html`): Implement Firebase password reset email.

## Phase 3: Public Features (Firestore)
- [ ] **Contact Form** (`contact.html`): Save submissions to `messages` collection.
- [ ] **Newsletter**: Save emails to `subscribers` collection.

## Phase 4: Portal Features (Firestore)
- [ ] **Profile** (`profile.html`): Fetch and Update user profile data from `users` collection.
- [ ] **Dashboard**: Fetch stats/data from Firestore.
- [ ] **Chat Widget**: (Optional) Real-time chat using Firestore listeners.

## Phase 5: Security Rules
- [ ] Define basic Firestore security rules (e.g., users can only edit their own profile).
