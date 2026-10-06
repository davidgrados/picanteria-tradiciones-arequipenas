/* ============================================================
   Picantería Turística Tradiciones Arequipeñas
   Configuración central + interacciones
   ============================================================ */

/* ---------- CONFIGURACIÓN (edita aquí los datos del negocio) ---------- */
const CONFIG = {
  WHATSAPP_NUMBER: "51923750726",          // sin "+", sin espacios
  WHATSAPP_MESSAGE: "Hola, me gustaría hacer una consulta a Tradiciones Arequipeñas.",
  PHONE_DISPLAY: "923 750 726",
  PHONE_TEL: "+51923750726",
  ADDRESS: "Av. Trapiche N°208, Comas",
  MAPS_URL: "https://maps.app.goo.gl/2Z57RCyN2YgWudFt8",
  HORARIO: null,                            // ej. "Lun a Dom · 10:00 a 22:00" (null = muestra "Consúltanos por WhatsApp")
  CARTA_PAGES: ["carta_1.jpeg", "carta_2.jpeg", "carta_3.jpeg", "carta_4.jpeg"]
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
      const top = target.getBoundingClientRect().top + window.scrollY - 90;
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

  const galleryList = [];
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
      galleryList.push({ src: img.src, alt: img.alt });
    });

    /* Mostrar por lotes para no saturar la galería */
    const GALLERY_STEP = 12;
    let visibleCount = GALLERY_STEP;
    const moreBtn = document.getElementById("gallery-more");
    function renderGallery() {
      const figs = gallery.children;
      for (let i = 0; i < figs.length; i++) {
        figs[i].style.display = i < visibleCount ? "" : "none";
      }
      if (moreBtn) {
        const rest = GALLERY_IMAGES.length - visibleCount;
        moreBtn.style.display = rest <= 0 ? "none" : "";
        moreBtn.textContent = "Ver más fotos (" + rest + ")";
      }
    }
    if (moreBtn) moreBtn.addEventListener("click", function () {
      visibleCount = Math.min(GALLERY_IMAGES.length, visibleCount + GALLERY_STEP);
      renderGallery();
    });
    renderGallery();
  }

  /* ---- Lightbox (admite varias colecciones: galería y carta) ---- */
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbClose = document.getElementById("lb-close");
  const lbPrev = document.getElementById("lb-prev");
  const lbNext = document.getElementById("lb-next");
  let lbList = [];
  let lbIndex = 0;

  function openLightbox(list, i) {
    if (!list || !list.length) return;
    lbList = list;
    lbIndex = i;
    lbImg.src = lbList[lbIndex].src;
    lbImg.alt = lbList[lbIndex].alt;
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
    if (!lbList.length) return;
    lbIndex = (lbIndex + dir + lbList.length) % lbList.length;
    lbImg.src = lbList[lbIndex].src;
    lbImg.alt = lbList[lbIndex].alt;
  }

  if (gallery) {
    gallery.addEventListener("click", function (e) {
      const img = e.target.closest("img");
      if (!img) return;
      openLightbox(galleryList, parseInt(img.dataset.index, 10));
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
     MOMENTOS DE TRADICIÓN (tira deslizable)
     ============================================================ */
  const MOMENTOS = [
    { f: "momento-01.jpg", cap: "Nuestra fachada", alt: "Fachada y letrero de la picantería Tradiciones Arequipeñas" },
    { f: "momento-02.jpg", cap: "Orquesta en vivo", alt: "Orquesta tocando en vivo en Tradiciones Arequipeñas" },
    { f: "momento-03.jpg", cap: "Nuestro equipo", alt: "Equipo de atención de Tradiciones Arequipeñas" },
    { f: "momento-04.jpg", cap: "La mesa compartida", alt: "Clientes compartiendo una comida en Tradiciones Arequipeñas" },
    { f: "momento-05.jpg", cap: "Trío en vivo", alt: "Trío musical tocando en vivo en la picantería" },
    { f: "momento-06.jpg", cap: "Voz de la casa", alt: "Cantante en el escenario de Tradiciones Arequipeñas" },
    { f: "momento-07.jpg", cap: "Música criolla", alt: "Grupo de música criolla en el escenario" },
    { f: "momento-08.jpg", cap: "Celebraciones en la mesa", alt: "Celebración de clientes alrededor de la mesa" },
    { f: "momento-09.jpg", cap: "Show en vivo", alt: "Show musical en vivo en la picantería" },
    { f: "momento-10.jpg", cap: "El tradicional de la casa", alt: "Escultura de la vasija tradicional arequipeña con el nombre del restaurante" },
    { f: "momento-11.jpg", cap: "Con nuestros visitantes", alt: "Visitantes posando en Tradiciones Arequipeñas" }
  ];

  const strip = document.getElementById("momentos-strip");
  const momentosList = [];
  if (strip) {
    MOMENTOS.forEach(function (m, i) {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "momento";
      card.dataset.index = i;
      const img = document.createElement("img");
      img.src = "images/momentos/" + m.f;
      img.alt = m.alt;
      img.loading = "lazy";
      const cap = document.createElement("span");
      cap.className = "momento-cap";
      cap.textContent = m.cap;
      card.appendChild(img);
      card.appendChild(cap);
      strip.appendChild(card);
      momentosList.push({ src: img.src, alt: m.alt });
    });

    strip.addEventListener("click", function (e) {
      const card = e.target.closest(".momento");
      if (card) openLightbox(momentosList, parseInt(card.dataset.index, 10));
    });

    const prevBtn = document.getElementById("momentos-prev");
    const nextBtn = document.getElementById("momentos-next");
    function scrollStrip(dir) {
      strip.scrollBy({ left: dir * Math.max(300, strip.clientWidth * 0.8), behavior: "smooth" });
    }
    function updateArrows() {
      if (!prevBtn || !nextBtn) return;
      const max = strip.scrollWidth - strip.clientWidth - 4;
      prevBtn.style.visibility = strip.scrollLeft <= 4 ? "hidden" : "visible";
      nextBtn.style.visibility = strip.scrollLeft >= max ? "hidden" : "visible";
    }
    prevBtn.addEventListener("click", function () { scrollStrip(-1); });
    nextBtn.addEventListener("click", function () { scrollStrip(1); });
    strip.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    updateArrows();

    /* Avance automático suave (pausa al interactuar o salir de pantalla) */
    const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let autoTimer = null;
    function autoAdvance() {
      const max = strip.scrollWidth - strip.clientWidth;
      if (strip.scrollLeft >= max - 4) {
        strip.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        strip.scrollBy({ left: Math.max(280, strip.clientWidth * 0.75), behavior: "smooth" });
      }
    }
    function startAuto() {
      if (reducedMotion || autoTimer) return;
      autoTimer = setInterval(autoAdvance, 3600);
    }
    function stopAuto() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }
    function restartAuto() { stopAuto(); startAuto(); }
    strip.addEventListener("mouseenter", stopAuto);
    strip.addEventListener("mouseleave", startAuto);
    strip.addEventListener("touchstart", stopAuto, { passive: true });
    strip.addEventListener("touchend", function () { window.setTimeout(startAuto, 4000); }, { passive: true });
    if (prevBtn) prevBtn.addEventListener("click", restartAuto);
    if (nextBtn) nextBtn.addEventListener("click", restartAuto);
    const visObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) startAuto(); else stopAuto(); });
    }, { threshold: 0.2 });
    visObs.observe(strip);
  }
  /* ============================================================
     CARTA: flipbook con giro de hoja tipo periódico
     ============================================================ */
  function initCartaBook() {
    const book = document.getElementById("carta-book");
    const frame = document.getElementById("carta-frame");
    const stage = document.getElementById("carta-stage");
    const sheets = Array.prototype.slice.call(frame.querySelectorAll(".carta-sheet"));
    const label = document.getElementById("carta-page");
    const prevBtn = document.getElementById("carta-prev");
    const nextBtn = document.getElementById("carta-next");
    const zoomBtn = document.getElementById("carta-zoom");
    const fsBtn = document.getElementById("carta-fullscreen");
    /* ---- Sonido de pasar hoja (sintetizado con Web Audio, sin archivos) ---- */
    let audioCtx = null;
    let soundOn = true;
    try { soundOn = localStorage.getItem("carta-sound") !== "off"; } catch (e) {}
    function ensureAudio() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!audioCtx) audioCtx = new AC();
      if (audioCtx.state === "suspended") audioCtx.resume();
      return audioCtx;
    }
    /* Sonido real de pasar página (CC0, BigSoundBank) con respaldo sintetizado */
    const sndNext = new Audio("audio/pagina.mp3");
    const sndPrev = new Audio("audio/pagina-rev.mp3");
    let soundFileOk = true;
    [sndNext, sndPrev].forEach(function (s) {
      s.preload = "auto";
      s.volume = 0.55;
      s.addEventListener("error", function () { soundFileOk = false; });
    });
    function playPageSound(reverse) {
      if (!soundOn) return;
      if (soundFileOk) {
        const snd = reverse ? sndPrev : sndNext;
        try {
          snd.currentTime = 0;
          const pr = snd.play();
          if (pr && pr.catch) pr.catch(function () { playSynth(reverse); });
          return;
        } catch (e) { /* cae al respaldo */ }
      }
      playSynth(reverse);
    }
    function playSynth(reverse) {
      if (!soundOn) return;
      const ctx = ensureAudio();
      if (!ctx) return;
      const dur = 0.42;
      const sr = ctx.sampleRate;
      const len = Math.max(1, Math.floor(sr * dur));
      const buffer = ctx.createBuffer(1, len, sr);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < len; i++) {
        const t = i / len;
        const fade = t < 0.03 ? t / 0.03 : 1;
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.2) * fade;
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.value = 0.9;
      const now = ctx.currentTime;
      const f0 = reverse ? 2400 : 800;
      const f1 = reverse ? 700 : 2600;
      filter.frequency.setValueAtTime(f0, now);
      filter.frequency.exponentialRampToValueAtTime(f1, now + dur);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.22, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      src.start(now);
      src.stop(now + dur + 0.02);
    }
    const soundBtn = document.getElementById("carta-sound");
    function paintSound() {
      if (!soundBtn) return;
      soundBtn.setAttribute("aria-pressed", soundOn ? "true" : "false");
      const on = soundBtn.querySelector(".ico-on");
      const off = soundBtn.querySelector(".ico-off");
      if (on) on.hidden = !soundOn;
      if (off) off.hidden = soundOn;
    }
    if (soundBtn) {
      soundBtn.addEventListener("click", function () {
        soundOn = !soundOn;
        try { localStorage.setItem("carta-sound", soundOn ? "on" : "off"); } catch (e) {}
        paintSound();
        if (soundOn) playPageSound(false);
      });
    }
    paintSound();
    const N = sheets.length;
    let current = 0;
    let busy = false;

    const cartaList = sheets.map(function (s) {
      const img = s.querySelector("img");
      return { src: img.src, alt: img.alt };
    });

        /* Dimensiona el marco en píxeles según la proporción de la hoja activa */
    function ratioOf(index) {
      const img = sheets[index].querySelector("img");
      if (img && img.naturalWidth && img.naturalHeight) return img.naturalWidth / img.naturalHeight;
      if (sheets[index].dataset.ratio) return parseFloat(sheets[index].dataset.ratio);
      return 1.414;
    }
    function sizeFrame() {
      const pad = 32;
      const availW = Math.max(260, stage.clientWidth - pad);
      const availH = Math.max(280, window.innerHeight * 0.72);
      const ar = ratioOf(current);
      let w = availW;
      let h = w / ar;
      if (h > availH) { h = availH; w = h * ar; }
      frame.style.width = Math.round(w) + "px";
      frame.style.height = Math.round(h) + "px";
    }

    /* Guarda la proporción real de cada hoja cuando su imagen carga */
    sheets.forEach(function (s) {
      const img = s.querySelector("img");
      function store() {
        if (img.naturalWidth && img.naturalHeight) {
          s.dataset.ratio = (img.naturalWidth / img.naturalHeight).toFixed(4);
          if (s === sheets[current]) sizeFrame();
        }
      }
      if (img.complete) store();
      else img.addEventListener("load", store);
    });

    function paint() {
      sheets.forEach(function (s, i) {
        s.classList.toggle("is-active", i === current);
        s.classList.toggle("is-past", i < current);
        s.classList.toggle("is-future", i > current);
        s.style.zIndex = i === current ? 30 : (i < current ? 10 : 5);
      });
      label.textContent = "Hoja " + (current + 1) + " de " + N;
      prevBtn.disabled = current === 0;
      nextBtn.disabled = current === N - 1;
    }

    function go(dir) {
      if (busy) return;
      const target = current + dir;
      if (target < 0 || target >= N) return;
      busy = true;

      const outgoing = sheets[current];
      const incoming = sheets[target];

      frame.classList.add("turning");
      playPageSound(dir < 0);

      if (dir > 0) {
        outgoing.style.zIndex = 40;
        outgoing.classList.remove("is-active", "is-future", "is-past");
        outgoing.classList.add("turning-next");
        incoming.style.zIndex = 20;
        incoming.classList.remove("is-future", "is-past");
        incoming.classList.add("is-active");
      } else {
        incoming.style.zIndex = 40;
        incoming.classList.remove("is-past", "is-future");
        incoming.classList.add("is-active", "turning-prev");
        outgoing.style.zIndex = 20;
        outgoing.classList.remove("is-active");
        outgoing.classList.add("is-future");
      }

      current = target;
      label.textContent = "Hoja " + (current + 1) + " de " + N;
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      sizeFrame();

      window.setTimeout(function () {
        outgoing.classList.remove("turning-next", "turning-prev");
        incoming.classList.remove("turning-next", "turning-prev");
        frame.classList.remove("turning");
        busy = false;
        paint();
      }, 930);
    }

    prevBtn.addEventListener("click", function () { go(-1); });
    nextBtn.addEventListener("click", function () { go(1); });
    zoomBtn.addEventListener("click", function () { openLightbox(cartaList, current); });

    /* Tocar la hoja la abre ampliada en el lightbox */
    stage.addEventListener("click", function (e) {
      if (e.target.closest(".carta-sheet")) openLightbox(cartaList, current);
    });

    /* Pantalla completa */
    fsBtn.addEventListener("click", function () {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (book.requestFullscreen) book.requestFullscreen();
    });

    /* Teclado ← → con la carta enfocada o en pantalla completa (no secuestra el scroll) */
    document.addEventListener("keydown", function (e) {
      if (lightbox.classList.contains("open")) return;
      const inFull = document.fullscreenElement === book;
      if (!inFull && !book.contains(document.activeElement)) return;
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    });

    /* Deslizar en móvil para pasar hoja */
    let tx = null;
    stage.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener("touchend", function (e) {
      if (tx === null) return;
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      tx = null;
    }, { passive: true });

    sizeFrame();
    paint();

    window.addEventListener("resize", sizeFrame);
    document.addEventListener("fullscreenchange", sizeFrame);
  }

  if (document.getElementById("carta-book")) initCartaBook();
})();
