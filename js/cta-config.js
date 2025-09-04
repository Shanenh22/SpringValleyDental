// cta-config.js — single source of truth for sticky CTA links
// Update the three constants below to change links site‑wide.
const CTA_PHONE = "tel:19728522222";
const CTA_BOOK  = "contact.html";
const CTA_MAP   = "https://www.google.com/maps/place/14228+Midway+Rd+%23100,+Dallas,+TX+75244/@32.943659,-96.838108,14z/data=!4m6!3m5!1s0x864c26d39eab13f3:0x3e1243026b4b017b!8m2!3d32.9436588!4d-96.8381082!16s%2Fg%2F11qpmyb56j?hl=en-US&entry=ttu&g_ep=EgoyMDI1MDgyNS4wIKXMDSoASAFQAw%3D%3D";

document.addEventListener('DOMContentLoaded', () => {
  const bar = document.querySelector('.sticky-cta-bar');
  if (!bar) return;
  const call = bar.querySelector('.cta-link.call');
  const book = bar.querySelector('.cta-link.book');
  const loc  = bar.querySelector('.cta-link.location');
  if (call) call.setAttribute('href', CTA_PHONE);
  if (book) book.setAttribute('href', CTA_BOOK);
  if (loc)  loc.setAttribute('href', CTA_MAP);
});
