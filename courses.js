
const firebaseConfig = { /* giữ nguyên config của bạn */ };

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

