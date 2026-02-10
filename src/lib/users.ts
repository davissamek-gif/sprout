import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase/firebase";

export async function createUserProfile(params: {
  uid: string;
  email: string | null;
}) {
  const { uid, email } = params;

  const now = Date.now();
  const THREE_DAYS = 1000 * 60 * 60 * 24 * 3;

  await setDoc(doc(db, "users", uid), {
    uid,
    email,
    createdAt: serverTimestamp(),

    // Subscription
    subscriptionStatus: "trial",
    trialEndsAt: new Date(now + THREE_DAYS),

    // Stats (ready for later)
    tripsCount: 0,
    placesVisited: 0,
  });
}
