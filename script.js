document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("holiday-grid");
  const popup = document.getElementById("popup");
  const popupContent = document.getElementById("popup-content");
  const closeBtn = document.getElementById("close-popup");
  const title = document.getElementById("holiday-title");
  const dateEl = document.getElementById("holiday-date");
  const countdownEl = document.getElementById("holiday-countdown");
  const canvas = document.getElementById("background-effect");
  const ctx = canvas.getContext("2d");
  const searchInput = document.getElementById("search");

  const holidays = [
    { name: "New Year’s Day", date: "January 1", color: "#2563eb" },
    { name: "Valentine’s Day", date: "February 14", color: "#e11d48" },
    { name: "Easter", date: "April 20", color: "#10b981" },
    { name: "Memorial Day", date: "May 26", color: "#6b7280" },
    { name: "Independence Day", date: "July 4", color: "#ef4444" },
    { name: "Labor Day", date: "September 1", color: "#64748b" },
    { name: "Halloween", date: "October 31", color: "#f97316" },
    { name: "Thanksgiving", date: "November 28", color: "#f59e0b" },
    { name: "Christmas", date: "December 25", color: "#22c55e" }
  ];

  const nextDate = (monthDay) => {
    const year = new Date().getFullYear();
    const d = new Date(`${monthDay}, ${year}`);
    return d < new Date() ? new Date(`${monthDay}, ${year + 1}`) : d;
  };

  const render = (filter = "") => {
    grid.innerHTML = "";
    const today = new Date();
    holidays
      .map((h) => ({ ...h, next: nextDate(h.date) }))
      .sort((a, b) => a.next - b.next)
      .filter((h) => h.name.toLowerCase().includes(filter.toLowerCase()))
      .forEach((h) => {
        const diff = Math.ceil((h.next - today) / (1000 * 60 * 60 * 24));
        const card = document.createElement("div");
        card.className = "card";
        card.style.background = h.color;
        card.innerHTML = `<h3>${h.name}</h3><p>${h.next.toDateString()}</p><p>${diff} days left</p>`;
        card.addEventListener("click", () => openPopup(h));
        grid.appendChild(card);
      });
  };

  let timer;
  const openPopup = (holiday) => {
    popup.classList.remove("hidden");
    popupContent.style.background = holiday.color;
    title.textContent = holiday.name;
    dateEl.textContent = holiday.next.toDateString();
    startCountdown(holiday.next);
    startParticles(holiday.color);
  };

  const startCountdown = (date) => {
    clearInterval(timer);
    timer = setInterval(() => {
      const diff = date - new Date();
      if (diff <= 0) {
        countdownEl.textContent = "Today!";
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      countdownEl.textContent = `${d}d ${h}h ${m}m ${s}s`;
    }, 1000);
  };

  const startParticles = (color) => {
    const particles = [];
    canvas.width = popupContent.clientWidth;
    canvas.height = popupContent.clientHeight;

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 1,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
        color,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + "80";
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      requestAnimationFrame(animate);
    }
    animate();
  };

  closeBtn.addEventListener("click", () => {
    popup.classList.add("hidden");
    clearInterval(timer);
  });

  searchInput.addEventListener("input", (e) => render(e.target.value));
  render();
});
