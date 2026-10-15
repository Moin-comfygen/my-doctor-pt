# My Doctor — interactive healthcare MVP

## Run

Double-click **index.html** in this folder. Use a current Chrome, Edge, Firefox, or Safari browser. No build, installation, internet connection, or backend is required. Keep `index.html`, `styles.css`, and `app.js` together.

This folder is inside your Desktop workspace: `Desktop\veer\My-Doctor`.

## Demo access

- **Patient:** choose Patient app, use `9000000001`, then OTP **1234**. Select “Create a new patient profile” to demonstrate onboarding.
- **Doctor:** choose Doctor workspace, use `9000000010`, then OTP **1234** for Dr. Ananya Sharma. Other seeded doctor numbers run from `9000000011` to `9000000017`.
- **New doctor:** select “Register as a new doctor”, complete the form, and supply three fictional documents. Switch to Admin → KYC Verification to approve or reject the application. Sign back in using the registered mobile number to see the resulting state.
- **Admin:** choose Admin panel. This is a demonstration session with no password.
- Use **Switch role** in the header to move between experiences. The launcher has **Reset demo data**.

## Connected demonstrations

1. Patient → Find Doctor → View profile → Book Appointment. Choose a patient, date, available slot, and visit type. Review and simulate a successful or failed payment. A successful transaction creates an appointment, token, and notifications.
2. Switch to the matching Doctor account. Choose the booked date in the calendar. View patient details, medical history, save consultation notes, create a prescription with multiple medicine rows, or complete the appointment.
3. Switch back to Patient. The prescription appears under Prescriptions and Medical Records. Select the correct family member when viewing their records.
4. Token / Queue → Simulate Queue advances the same doctor/date queue used by Doctor → Queue.
5. Admin → Payments → Refund → Process refund updates the payment and cancels the appointment. Download a demo invoice from the same row.
6. Admin commission settings update payment calculations. KYC decisions, account blocking, support status, notifications, role configuration, and audit events persist locally.
7. Doctor → Schedule updates the available patient booking days and slots. Existing booked slots are excluded.
8. Medical Records accepts local PDF, image, or text files up to 2 MB each. Small files are saved as data URLs in localStorage and can be downloaded again.

## Files

- `index.html`: application entry point
- `styles.css`: responsive mobile, tablet, and desktop styling
- `app.js`: local mock data, rendering, interactions, and persistence
- `README.md`: instructions and demo guide
- `qa.html`: browser workflow checks (running these resets demo data)

## Verification

Headless Chrome checks passed for patient OTP sign-in, doctor search, successful booking and payment, doctor-side appointment visibility, prescription creation and patient visibility, queue advancement, refund request and processing, commission updates, KYC approval, all 14 admin sections rendering, and localStorage persistence. Patient home was checked for horizontal overflow at 320, 360, 375, 390, 414, 430, 768, and 1280 pixels. This does not replace testing on physical Android/iPhone devices. The automated checks reset the demo state on completion.

## Prototype boundaries

All people, documents, payments, and records are fictional. OTP, payments, and queue movement are simulated. No real medical services, messaging, calling, production authentication, or server storage are provided. Online is an appointment type only; there is no audio/video consultation.

Hospital and Pharmacy admin sections are management directories only, as requested. Role permissions are saved UI configuration; they do not provide security enforcement. KYC uploads retain document filenames for review rather than medical identity file contents. Seeded medical documents show metadata; uploaded medical records retain file data. Consent controls the doctor’s medical-history view.

State is shared between workspaces in the same browser using localStorage. Browser storage limits apply; resetting demo data or clearing browser storage removes changes. Direct-file storage behavior and cross-tab events can vary by browser; use the same browser and tab for role switching. For a server-based local preview, serve this folder with any static file server.

The visual design uses local CSS, text, and system emoji, with no external asset dependency. Emoji appearance varies by platform.
