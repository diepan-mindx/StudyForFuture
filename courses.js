
const firebaseConfig = { apiKey: "AIzaSyASEoE6TQkvWK1EtYfcAAdfOD3Guo874Ko",
  authDomain: "jsi35-d177d.firebaseapp.com",
  databaseURL: "https://jsi35-d177d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jsi35-d177d",
  storageBucket: "jsi35-d177d.firebasestorage.app",
  messagingSenderId: "73414069100",
  appId: "1:73414069100:web:b80dbc1756a4dd46c74149",
  measurementId: "G-30EVLV5LC2"};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Load tiến độ khi vào trang
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const ref = doc(db, "students", user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data().progress;
      document.querySelector("#grammarProgress .progress-bar").style.width = data.grammar + "%";
      document.querySelector("#pronProgress .progress-bar").style.width = data.pronunciation + "%";
      document.querySelector("#vocabProgress .progress-bar").style.width = data.vocabulary + "%";
    }
  } else {
    window.location.href = "login.html"; // Chưa login thì bắt quay lại
  }
});

// Hàm update tiến độ
async function updateLesson(lessonKey, progressBarId) {
  const user = auth.currentUser;
  if (!user) return alert("Vui lòng đăng nhập!");

  const ref = doc(db, "students", user.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    let data = snap.data().progress;
    data[lessonKey] = Math.min(data[lessonKey] + 10, 100);

    await updateDoc(ref, { progress: data });

    document.querySelector(`#${progressBarId} .progress-bar`).style.width = data[lessonKey] + "%";
  }
}

// Gắn sự kiện click
document.getElementById("grammarBtn").addEventListener("click", () => updateLesson("grammar", "grammarProgress"));
document.getElementById("pronBtn").addEventListener("click", () => updateLesson("pronunciation", "pronProgress"));
document.getElementById("vocabBtn").addEventListener("click", () => updateLesson("vocabulary", "vocabProgress"));

