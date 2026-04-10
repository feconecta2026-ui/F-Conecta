function getTodayKey() {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
}

function getDailyPrayer(prayers) {
  const todayKey = getTodayKey();
  const saved = JSON.parse(localStorage.getItem("dailyPrayer"));

  if (saved && saved.date === todayKey) {
    return saved.prayer;
  }

  const random = prayers[Math.floor(Math.random() * prayers.length)];

  localStorage.setItem("dailyPrayer", JSON.stringify({
    date: todayKey,
    prayer: random
  }));

  return random;
}

function openPrayer(id) {
  localStorage.setItem("openPrayerId", id);
  window.location.href = "../oracao/oracao.html";
}