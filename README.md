# My Doctor — interactive healthcare MVP

## Live demo

Open **https://my-doctor-pt.vercel.app/** on a phone or desktop. The demo OTP is **1234**. The Vercel project deploys from this repository's `main` branch.

## Run

Double-click **index.html** in this folder. Use a current Chrome, Edge, Firefox, or Safari browser. No build, installation, internet connection, or backend is required. Keep `index.html`, `styles.css`, `app.js`, and the `assets` folder together.

This folder is inside your Desktop workspace: `Desktop\veer\My-Doctor`.

## Demo access

- **Patient:** choose Patient app, use `9000000001`, then OTP **1234**. Select “Create a new patient profile” to demonstrate onboarding.
- **Doctor:** choose Doctor workspace, use `9000000010`, then OTP **1234** for Dr. Ananya Sharma. Other seeded doctor numbers run from `9000000011` to `9000000017`.
- **New doctor:** select “Register as a new doctor”, complete the form, and supply three fictional documents. Switch to Admin → KYC Verification to approve or reject the application. Sign back in using the registered mobile number to see the resulting state.
- **Admin:** choose Admin panel. This is a demonstration session with no password.
- Use the **switch arrows** in the header to move between experiences. The launcher has **Reset demo**.

## Connected demonstrations

1. Patient → Find Doctor → View profile → Book Appointment. Choose a patient, date, available slot, and visit type. Review and simulate a successful or failed payment. A successful transaction creates an appointment, token, and notifications.
2. Switch to the matching Doctor account. Choose the booked date in the calendar. View patient details, medical history, save consultation notes, create a prescription with multiple medicine rows, or complete the appointment.
3. Switch back to Patient. The prescription appears under Prescriptions and Medical Records. Select the correct family member when viewing their records.
4. Token / Queue → Simulate Queue advances the same doctor/date queue used by Doctor → Queue.
5. Admin → Payments → Refund → Process refund updates the payment and cancels the appointment. Download a demo invoice from the same row.
6. Admin commission settings update payment calculations. KYC decisions, account blocking, support status, notifications, role configuration, and audit events persist locally.
7. Doctor → Schedule updates the available patient booking days and slots. Existing booked slots are excluded.
8. Medical Records accepts local PDF, image, or text files up to 2 MB each. Small files are saved as data URLs in localStorage and can be downloaded again.
9. Admin → Doctors → Add doctor / Edit doctor manages qualifications, experience, registration, contact information, clinic, city, languages, availability, account status and consultation charge. The current fee appears in patient search, profiles and new bookings. Historical appointment payments retain their original amount. Upload a JPG/PNG/WebP profile photo up to 1 MB.

## Files

- `index.html`: application entry point
- `styles.css`: responsive mobile, tablet, and desktop styling
- `app.js`: local mock data, rendering, interactions, and persistence
- `patient-ui.js` / `patient-ui.css`: interactive care banner, photographic profiles and patient typography
- `admin-doctors.js` / `admin-doctors.css`: doctor management and pricing controls
- `assets/`: bundled stock doctor portraits, generated banner photo, icons and source credits
- `README.md`: instructions and demo guide
- `qa.html`: browser workflow and layout checks; restores saved browser data after the run

## Mobile UI

Patient screens prioritize phones from 320–430px. The six-service grid, appointment cards and fixed bottom navigation use consistent SVG icons. Patient content uses a readable text scale with 16px form fields. Doctor listings include bundled photographic portraits. The care banner has three working slides for appointments, family profiles and records, with buttons, pagination, keyboard controls and touch swipe; it stays still while being read. Booking and record dialogs use scrollable bottom sheets. Navigation targets are at least 44px, with safe-area padding and reduced-motion support.

To share the project files, include the whole folder, including `assets`. To share a browser link, serve the repository root with a static hosting provider; this repository alone is source code, not a deployed website.

## Verification

Headless Chrome checks cover sign-in, doctor search, booking/payment, prescriptions, queue advancement, refunds, commission, KYC, localStorage, banner controls, photo loading and admin doctor edits. Pricing checks verify that admin changes reach patient checkout while old receipts keep their original fee. A matrix checks 31 views (including all 12 Admin sections) at 320, 360, 375, 390, 414, 430, 768 and 1280 pixels, plus doctor management and other dialog flows. Phones use a short 568px height. Checks cover overflow, touch targets, patient text sizes, mobile inputs, navigation bounds and runtime errors. Physical Android/iPhone testing remains separate. Original app storage is restored after completion.

## Prototype boundaries

All people, documents, payments, and records are fictional. OTP, payments, and queue movement are simulated. No real medical services, messaging, calling, production authentication, or server storage are provided. Online is an appointment type only; there is no audio/video consultation.

The Admin panel excludes Hospital and Pharmacy Management. Role permissions are saved UI configuration; they do not provide security enforcement. KYC uploads retain document filenames for review rather than medical identity file contents. Seeded medical documents show metadata; uploaded medical records retain file data. Consent controls the doctor’s medical-history view.

State is shared between workspaces in the same browser using localStorage. Browser storage limits apply; resetting demo data or clearing browser storage removes changes. Direct-file storage behavior and cross-tab events can vary by browser; use the same browser and tab for role switching. For a server-based local preview, serve this folder with any static file server.

The doctor names are fictional; bundled stock portraits do not identify real doctors by those names. Actual doctor photos can be supplied through Admin. Source/license links are in `assets/PHOTO-CREDITS.md`. The banner photo was generated using the built-in image generation tool; its prompt is in `assets/BANNER-PROMPT.md`. All runtime image and icon assets are bundled locally.
