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
const to = (params.get("to") || "").trim().slice(0, 60);
if (to) {
  const city = (params.get("city") || "").trim().slice(0, 40);
  const sub = (params.get("sub") || "W/F").trim().slice(0, 40);
  const guest = document.getElementById("guest");
  guest.querySelector(".guest-name").textContent = city ? `${to}, ${city}` : to;
  guest.querySelector(".guest-sub").textContent = sub;
  guest.hidden = false;
  document.title = `${to} · Chiranjeev weds Ravneet`;
}

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
