const functions = require("firebase-functions");
const admin     = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

exports.addReading = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== "POST") return res.status(405).send("Método no permitido");

    const { t, h } = req.body;
    const deviceId = req.get("particle-device-id") || "unknown-device";

    const devRef = db.doc(`devices/${deviceId}`);
    await devRef.set(
      { lastSeen: admin.firestore.FieldValue.serverTimestamp() },
      { merge: true }
    );

    await devRef.collection("readings").add({
      temperature: Number(t),
      humidity: Number(h),
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(200).send("ok");
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.toString());
  }
});
