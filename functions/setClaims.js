
const admin = require("firebase-admin");
admin.initializeApp();

const uid = process.argv[2];
if (!uid) {
  console.error("Proporciona UID:");
  process.exit(1);
}

admin.auth().setCustomUserClaims(uid, { role: "admin" })
  .then(() => console.log(`UID ${uid} asignado como admin`))
  .catch(console.error);
