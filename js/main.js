/* ============================================================
   Picantería Turística Tradiciones Arequipeñas
   Configuración central + interacciones
   ============================================================ */

/* ---------- CONFIGURACIÓN (edita aquí los datos del negocio) ---------- */
const CONFIG = {
  WHATSAPP_NUMBER: "51923750726",          // sin "+", sin espacios
  WHATSAPP_MESSAGE: "Hola, me gustaría hacer una consulta a Tradiciones Arequipeñas.",
  PHONE_DISPLAY: "(01) 537 3350",
  PHONE_TEL: "+5115373350",
  ADDRESS: "Av. Trapiche N°208, Comas",
  MAPS_URL: "https://maps.app.goo.gl/2Z57RCyN2YgWudFt8",
  HORARIO: null,                            // ej. "Lun a Dom · 10:00 a 22:00" (null = muestra "Consúltanos por WhatsApp")
  PDF_URL: "carta.pdf"
};

(function () {
  "use strict";

  /* ---- WhatsApp links ---- */
  const waHref = "https://wa.me/" + CONFIG.WHATSAPP_NUMBER + "?text=" + encodeURIComponent(CONFIG.WHATSAPP_MESSAGE);
  ["whatsapp-header", "whatsapp-float", "whatsapp-ubicacion", "whatsapp-contacto"].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.href = waHref;
  });

  /* ---- Horario ---- */
  const horarioEl = document.getElementById("horario-text");
  if (horarioEl && CONFIG.HORARIO) horarioEl.textContent = CONFIG.HORARIO;

  /* ---- Año dinámico ---- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     HEADER: sticky + estado al hacer scroll + menú móvil
     ============================================================ */
  const header = document.getElementById("site-header");
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  function onScroll() {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      const open = mainNav.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* Cierra el menú móvil al pulsar un enlace */
  mainNav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      mainNav.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ============================================================
     SCROLL SUAVE con offset del header
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      const id = link.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 78;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* ============================================================
     REVEAL al entrar en viewport
     ============================================================ */
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ============================================================
     GALERÍA + LIGHTBOX
     ============================================================ */
  const GALLERY_IMAGES = [
    "1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg","8.jpg","9.jpg","10.jpg",
    "11.jpg","12.jpg","13.jpg","14.jpg","15.jpg","16.jpg","17.jpg","18.jpg","19.jpg","20.jpg","21.jpg",
    "DSC_7250.jpg","2-queso.png","3plat.png","pl55.png","plat4.png","plat7.png","plat8.png","plat9.png",
    "plat10.png","plat11.png","plat12.png","plat13.png","plat15.png","plat17.png","plat18.png","plat19.png",
    "platt6.png","plt3.png","FB_IMG_1689587975335.jpg","FB_IMG_1689587987842.jpg",
    "Imagen de WhatsApp 2024-09-11 a las 13.24.06_aab569cf.jpg"
  ];

  const gallery = document.getElementById("gallery");
  if (gallery) {
    GALLERY_IMAGES.forEach(function (name, i) {
      const fig = document.createElement("figure");
      const img = document.createElement("img");
      img.src = "images/" + encodeURI(name);
      img.alt = "Fotografía de la picantería Tradiciones Arequipeñas";
      img.loading = "lazy";
      img.dataset.index = i;
      fig.appendChild(img);
      gallery.appendChild(fig);
    });
  }

  /* ---- Lightbox ---- */
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbClose = document.getElementById("lb-close");
  const lbPrev = document.getElementById("lb-prev");
  const lbNext = document.getElementById("lb-next");
  let lbIndex = 0;

  function openLightbox(i) {
    lbIndex = i;
    lbImg.src = gallery.children[i].querySelector("img").src;
    lbImg.alt = gallery.children[i].querySelector("img").alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function lbStep(dir) {
    const n = gallery.children.length;
    lbIndex = (lbIndex + dir + n) % n;
    const img = gallery.children[lbIndex].querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
  }

  if (gallery) {
    gallery.addEventListener("click", function (e) {
      const img = e.target.closest("img");
      if (!img) return;
      openLightbox(parseInt(img.dataset.index, 10));
    });
  }
  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lbPrev) lbPrev.addEventListener("click", function () { lbStep(-1); });
  if (lbNext) lbNext.addEventListener("click", function () { lbStep(1); });
  if (lightbox) {
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });
  }
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") lbStep(-1);
    if (e.key === "ArrowRight") lbStep(1);
  });
  /* swipe móvil */
  let touchX = null;
  if (lightbox) {
    lightbox.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener("touchend", function (e) {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 48) lbStep(dx < 0 ? 1 : -1);
      touchX = null;
    }, { passive: true });
  }

  /* ============================================================
     VISOR DE CARTA (PDF.js)
     ============================================================ */
  function initCartaViewer() {
    if (typeof pdfjsLib === "undefined") {
      const loading = document.getElementById("carta-loading");
      if (loading) loading.textContent = "No se pudo cargar el visor de la carta.";
      return;
    }
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

    const canvas = document.getElementById("carta-canvas");
    const ctx = canvas.getContext("2d");
    const stage = document.getElementById("carta-stage");
    const pageLabel = document.getElementById("carta-page");
    const zoomLabel = document.getElementById("carta-zoom");
    const loading = document.getElementById("carta-loading");

    let pdf = null;
    let currentPage = 1;
    let scale = 1;
    let baseScale = 1;

    function fitScale(pageWidth) {
      const avail = Math.max(stage.clientWidth - 48, 260);
      return Math.max(0.5, avail / pageWidth);
    }

    function render() {
      pdf.getPage(currentPage).then(function (page) {
        const viewport = page.getViewport({ scale: scale });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height = Math.floor(viewport.height) + "px";
        page.render({ canvasContext: ctx, viewport: viewport, transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null }).promise
          .then(function () { if (loading) loading.style.display = "none"; });
        pageLabel.textContent = "Página " + currentPage + " de " + pdf.numPages;
        zoomLabel.textContent = Math.round(scale / baseScale * 100) + "%";
      });
    }

    pdfjsLib.getDocument(CONFIG.PDF_URL).promise.then(function (doc) {
      pdf = doc;
      doc.getPage(1).then(function (p) {
        baseScale = fitScale(p.getViewport({ scale: 1 }).width);
        scale = baseScale;
        render();
      });
    }).catch(function () {
      if (loading) loading.textContent = "No se pudo abrir la carta.";
    });

    document.getElementById("carta-prev").addEventListener("click", function () {
      if (!pdf) return; currentPage = Math.max(1, currentPage - 1); render();
    });
    document.getElementById("carta-next").addEventListener("click", function () {
      if (!pdf) return; currentPage = Math.min(pdf.numPages, currentPage + 1); render();
    });
    document.getElementById("carta-zoom-in").addEventListener("click", function () {
      scale = Math.min(scale * 1.25, baseScale * 4); render();
    });
    document.getElementById("carta-zoom-out").addEventListener("click", function () {
      scale = Math.max(scale / 1.25, baseScale * 0.5); render();
    });
    document.getElementById("carta-fullscreen").addEventListener("click", function () {
      const viewer = document.getElementById("carta-viewer");
      if (document.fullscreenElement) document.exitFullscreen();
      else if (viewer.requestFullscreen) viewer.requestFullscreen();
    });
    document.getElementById("carta-download").addEventListener("click", function () {
      const a = document.createElement("a");
      a.href = CONFIG.PDF_URL;
      a.download = CONFIG.PDF_URL.split("/").pop();
      document.body.appendChild(a);
      a.click();
      a.remove();
    });

    /* teclado: ← → dentro del visor */
    document.addEventListener("keydown", function (e) {
      const viewer = document.getElementById("carta-viewer");
      const active = document.activeElement;
      const inViewer = viewer.contains(active) || document.fullscreenElement === viewer;
      if (!inViewer) return;
      if (e.key === "ArrowLeft") { currentPage = Math.max(1, currentPage - 1); render(); }
      if (e.key === "ArrowRight") { currentPage = Math.min(pdf.numPages, currentPage + 1); render(); }
    });

    window.addEventListener("resize", function () {
      if (!pdf) return;
      pdf.getPage(currentPage).then(function (p) {
        baseScale = fitScale(p.getViewport({ scale: 1 }).width);
        scale = baseScale;
        render();
      });
    });
  }

  if (document.getElementById("carta-viewer")) initCartaViewer();
})();
