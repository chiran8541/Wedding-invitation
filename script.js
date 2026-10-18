// All times are India Standard Time (UTC+05:30)
const EVENTS = {
  "akhand-arambh": { title: "Shri Akhand Path (Arambh)", start: "2026-11-17T10:00", mins: 120,
    where: "MRFR+88R HARNAZ TRADERS, RS Pura Rd, Satwari, Jeevan Nagar, Jammu, Jammu and Kashmir 181101" },
  "akhand-bhog": { title: "Shri Akhand Path (Bhog)", start: "2026-11-19T12:30", mins: 120,
    where: "MRFR+88R HARNAZ TRADERS, RS Pura Rd, Satwari, Jeevan Nagar, Jammu, Jammu and Kashmir 181101" },
  "dinner": { title: "Dinner - Chiranjeev & Ravneet", start: "2026-11-20T19:00", mins: 180,
    where: "The Legend Banquet, Jeevan Nagar, Babliana, Near M.B.S Eng. College, Jammu" },
  "barat": { title: "Barat - Chiranjeev Singh", start: "2026-11-22T10:30", mins: 180,
    where: "MRFR+88R HARNAZ TRADERS, RS Pura Rd, Satwari, Jeevan Nagar, Jammu, Jammu and Kashmir 181101" },
  "reception": { title: "Reception (Dinner) - Chiranjeev & Ravneet", start: "2026-11-23T19:00", mins: 180,
    where: "Zone by The Park Hotel, Rail Head Complex, Near SBI Bank, Jammu" },
};

const IST = "+05:30";
const toUTCStamp = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

// Map links
document.querySelectorAll("[data-map]").forEach((a) => {
  a.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(a.dataset.map);
});

// WhatsApp RSVP
document.querySelectorAll("[data-wa]").forEach((a) => {
  const msg = "Hello! Regarding the wedding invitation of Chiranjeev & Ravneet — ";
  a.href = `https://wa.me/${a.dataset.wa}?text=${encodeURIComponent(msg)}`;
  a.target = "_blank";
  a.rel = "noopener";
});

// Add to calendar (.ics download)
document.querySelectorAll("[data-cal]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const e = EVENTS[btn.dataset.cal];
    const start = new Date(e.start + IST);
    const end = new Date(start.getTime() + e.mins * 60000);
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding Invitation//EN",
      "BEGIN:VEVENT",
      `UID:${btn.dataset.cal}@chiranjeev-ravneet-wedding`,
      `DTSTAMP:${toUTCStamp(new Date())}`,
      `DTSTART:${toUTCStamp(start)}`,
      `DTEND:${toUTCStamp(end)}`,
      `SUMMARY:${e.title}`,
      `LOCATION:${e.where.replace(/,/g, "\\,")}`,
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = `${btn.dataset.cal}.ics`;
    a.click();
    URL.revokeObjectURL(a.href);
  });
});

// Personalised greeting from the link: ?to=Amarjeet Singh&city=Delhi&sub=W/F
// Values are written with textContent, so nothing in the URL can inject markup.
const params = new URLSearchParams(location.search);
// Capitalise the first letter of each word; the rest is left exactly as typed (so "MM Qaji" stays intact)
const cap = (t) => t.replace(/(^|\s)(\p{L})/gu, (_, sp, ch) => sp + ch.toUpperCase());
const to = cap((params.get("to") || "").trim().slice(0, 60));
const city = cap((params.get("city") || "").trim().slice(0, 40));
// Second line under the name; "W/F" (or nothing) means "With Family"
const rawSub = (params.get("sub") || "").trim().slice(0, 40);
const sub = !rawSub || rawSub.toUpperCase() === "W/F" ? "With Family" : rawSub;
if (to) document.title = `${to} · Chiranjeev weds Ravneet`;

// Countdown to the wedding day (Barat, 22 Nov, 10:30 am IST)
const target = new Date(EVENTS.barat.start + IST).getTime();
const box = document.getElementById("countdown");
function tick() {
  const diff = target - Date.now();
  if (diff <= 0) {
    box.innerHTML = '<div class="done">The celebrations have begun! 🎉</div>';
    return;
  }
  const d = Math.floor(diff / 864e5);
  const h = Math.floor((diff % 864e5) / 36e5);
  const m = Math.floor((diff % 36e5) / 6e4);
  const s = Math.floor((diff % 6e4) / 1e3);
  box.innerHTML = [["Days", d], ["Hours", h], ["Mins", m], ["Secs", s]]
    .map(([l, v]) => `<div><b>${v}</b>${l}</div>`).join("");
}
tick();
setInterval(tick, 1000);

// Opening seal: guests tap to open. Skipped on refresh within a session, or with ?intro=0
(() => {
  if (params.get("intro") === "0" || sessionStorage.getItem("opened-chiranjeev")) return;

  const el = document.createElement("button");
  el.type = "button";
  el.className = "intro";
  el.setAttribute("aria-label", "Open the invitation");

  const eyebrow = document.createElement("p");
  eyebrow.className = "intro-eyebrow";
  eyebrow.textContent = "You are invited";

  const seal = document.createElement("div");
  seal.className = "seal";
  seal.textContent = "C & R";

  el.append(eyebrow, seal);

  if (to) {
    const forLine = document.createElement("p");
    forLine.className = "intro-for";
    forLine.textContent = "To - " + (city ? `${to}, ${city}` : to);
    const subLine = document.createElement("p");
    subLine.className = "intro-sub";
    subLine.textContent = sub;
    el.append(forLine, subLine);
  }

  const tap = document.createElement("p");
  tap.className = "intro-tap";
  tap.textContent = "Tap to open";
  el.append(tap);

  document.body.classList.add("locked");
  document.body.append(el);

  el.addEventListener("click", () => {
    sessionStorage.setItem("opened-chiranjeev", "1");
    el.classList.add("open");
    document.body.classList.remove("locked");
    setTimeout(() => el.remove(), 1100);
  });
  el.focus();
})();

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
