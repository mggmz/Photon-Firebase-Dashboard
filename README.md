# Photon‑Firebase‑React‑Dashboard

*Multi‑tenant IoT starter kit that turns a single Particle Photon + DHT11 sensor into a real‑time web dashboard with per‑user access control, built entirely on Firebase and React.*


---

## ✨ Features
- **Real‑time telemetry** – Temperature & humidity readings published every 10 s  
- **Secure multi‑user access** – Firestore rules tied to `ownerUid`; custom claims for an **admin** role  
- **Remote control** – One‑click **ON/OFF** buttons trigger the Photon relay through the Particle Cloud API  
- **Live charts** – Responsive Chart.js line graphs rendered with React  
- **Serverless backend** – Firebase Auth, Cloud Functions, Firestore and Hosting  
- **Minimal blue UI** – Tailwind CSS palette (`primary‑50 … 900`) for a clean, lightweight look  

---

## 🗂 Folder Structure
    photon-firebase-dashboard/
    ├─ firmware/
    │   └─ dht11_firebase.ino
    ├─ functions/
    │   ├─ index.js
    │   ├─ package.json
    │   └─ setClaims.js
    ├─ frontend/
    │   ├─ src/
    │   │   ├─ App.jsx
    │   │   ├─ main.jsx
    │   │   ├─ firebase.js
    │   │   └─ components/
    │   │       ├─ Login.jsx
    │   │       ├─ Dashboard.jsx
    │   │       └─ DeviceCard.jsx
    │   ├─ index.html
    │   ├─ package.json
    │   ├─ tailwind.config.cjs
    │   └─ vite.config.js
    ├─ firestore.rules
    ├─ .env.example
    └─ README.md   ← this file

---

## 🔧 Prerequisites
| Tool / Service | Recommended version |
|----------------|---------------------|
| Node.js        | 18 LTS |
| npm            | 9 or newer |
| `firebase-tools` CLI | 13 or newer |
| Particle Photon | Device OS ≥ 3.1 |
| Firebase project | Firestore, Auth, Functions & Hosting enabled |

---

## 🚀 Quick Start

1. **Clone & Install**

        git clone https://github.com/your-org/photon-firebase-dashboard.git
        cd photon-firebase-dashboard
        npm install -g firebase-tools

2. **Initialize Firebase**

        firebase login
        firebase init       # select Firestore, Functions, Hosting

3. **Flash the Photon**

   - Open `firmware/dht11_firebase.ino` in Particle Web IDE  
   - Add libraries **Adafruit_DHT** and **Adafruit_Sensor**  
   - Flash the code to your device  

4. **Create the Webhook** (Particle Console → Integrations)

   | Field  | Value |
   |--------|-------|
   | **Event** | `envReading` |
   | **URL** | `https://<region>-<project>.cloudfunctions.net/addReading` |
   | **Type** | POST / JSON |
   | **Header** | `particle-device-id: {{PARTICLE_DEVICE_ID}}` |

5. **Set Environment Variables**

        cp frontend/.env.example frontend/.env
        # then fill in:
        # VITE_FB_API_KEY, VITE_FB_AUTH_DOMAIN, … (Firebase web config)
        # VITE_PARTICLE_TOKEN               (Particle access token)

6. **Deploy Cloud Functions & Hosting**

        cd functions && npm install && cd ..
        firebase deploy --only functions,hosting

7. **(Optional) Promote an Admin User**

        cd functions
        node setClaims.js <FIREBASE_UID>

Open the Hosting URL → sign up two test users and watch device ownership transfer in real time 🔥

---

## 📄 Documentation Highlights

| Component | Purpose |
|-----------|---------|
| **`firmware/dht11_firebase.ino`** | Reads the DHT11 sensor, publishes JSON `{t,h}` to `envReading`, and exposes a `relay` function (`on` / `off`). |
| **`functions/index.js`** | HTTP endpoint `/addReading` ingests data, stores it under `/devices/{deviceId}/readings`, and timestamps with `serverTimestamp()`. |
| **`firestore.rules`** | Core policy: owners or admins can read/update; only admins can create/delete. |
| **React Front‑end** | Vite + Tailwind UI, live updates via `onSnapshot`, charts via Chart.js, relay commands sent with the Particle REST API. |

---

## 🧪 Testing Checklist
- Serial output shows `{"t":..,"h":..}` every 10 s  
- Cloud Logs list **addReading** invocations  
- Firestore `/readings` sub‑collection grows in real time  
- Admin sees all devices; regular user sees only their own  
- Relay toggles when **ON / OFF** buttons are pressed  
- Updating `ownerUid` instantly changes device visibility in the UI  

---

## 🗄 Environment Template (`.env.example`)
    # Firebase
    VITE_FB_API_KEY=
    VITE_FB_AUTH_DOMAIN=
    VITE_FB_PROJECT_ID=
    VITE_FB_STORAGE_BUCKET=
    VITE_FB_MSG_SENDER_ID=
    VITE_FB_APP_ID=

    # Particle
    VITE_PARTICLE_TOKEN=

---

## 📚 References
- Particle – *Device OS API & Docs*  
- Firebase – *Cloud Firestore Rules* & *Auth Custom Claims*  
- Adafruit – *DHT11 Sensor Guide*  
- Chart.js – *Documentation*  


---

## 🖋 License
Released under the **MIT License** – feel free to use, modify and share.  

Happy Semana Santa! ✝️
