// Year in footer
document.querySelectorAll("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });

// Hero fade-in once loaded
const hero = document.querySelector(".hero");
if (hero) requestAnimationFrame(() => hero.classList.add("ready"));

// Confetti pieces in the colors of the profile photo
const confettiColors = ["--orange", "--yellow", "--green", "--blue", "--red", "--pink"];
document.querySelectorAll(".confetti").forEach(box => {
  const count = window.innerWidth < 720 ? 14 : 26;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("i");
    const w = 10 + Math.random() * 16;
    piece.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${w}px;
      height: ${w * (0.4 + Math.random() * 0.3)}px;
      background: var(${confettiColors[i % confettiColors.length]});
      --r: ${Math.round(Math.random() * 180)}deg;
      animation-delay: -${(Math.random() * 7).toFixed(2)}s;
      animation-duration: ${(5 + Math.random() * 5).toFixed(2)}s;
    `;
    box.appendChild(piece);
  }
});

// Count-up for stats
function countUp(el) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const start = performance.now();
  const dur = 1200;
  const tick = now => {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * eased).toLocaleString() + suffix;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    e.target.querySelectorAll("[data-count]").forEach(countUp);
    if (e.target.dataset.count) countUp(e.target);
    io.unobserve(e.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// Microsoft Clarity: record WhatsApp booking clicks as named events per package
const packageNames = ["Clarity call", "Career kickstart", "Career shift program"];
document.addEventListener("click", e => {
  const link = e.target.closest('a[href*="wa.me/"]');
  if (!link || typeof window.clarity !== "function") return;
  const tier = link.closest(".tier");
  const pkg = tier ? packageNames[[...tier.parentElement.children].indexOf(tier)] || "Other" : "Other";
  const lang = document.documentElement.lang === "he" ? "HE" : "EN";
  window.clarity("event", `WhatsApp - ${pkg}`);
  window.clarity("set", "whatsapp_package", pkg);
  window.clarity("set", "whatsapp_language", lang);
  window.clarity("upgrade", "WhatsApp booking click");
});
