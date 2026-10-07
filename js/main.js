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

  /* Zoom dentro del visor */
  const lbFigure = document.getElementById("lb-figure");
  const lbZoomIn = document.getElementById("lb-zoom-in");
  const lbZoomOut = document.getElementById("lb-zoom-out");
  const lbZoomReset = document.getElementById("lb-zoom-reset");
  const lbZoomVal = document.getElementById("lb-zoom-val");
  let lbScale = 1, lbTx = 0, lbTy = 0;

  function applyLbZoom() {
    lbImg.style.transform = "translate(" + lbTx + "px," + lbTy + "px) scale(" + lbScale + ")";
    if (lbZoomVal) lbZoomVal.textContent = Math.round(lbScale * 100) + "%";
    lbImg.style.cursor = lbScale > 1.01 ? "grab" : "zoom-in";
  }
  function resetLbZoom() { lbScale = 1; lbTx = 0; lbTy = 0; applyLbZoom(); }
  function setLbZoom(s) { lbScale = Math.max(1, Math.min(6, s)); applyLbZoom(); }

  function openLightbox(list, i) {
    if (!list || !list.length) return;
    lbList = list;
    lbIndex = i;
    lbImg.src = lbList[lbIndex].src;
    lbImg.alt = lbList[lbIndex].alt;
    resetLbZoom();
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
    resetLbZoom();
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

  /* Zoom: botones, rueda del mouse, doble clic y arrastre para moverse */
  if (lbZoomIn) lbZoomIn.addEventListener("click", function () { setLbZoom(lbScale * 1.5); });
  if (lbZoomOut) lbZoomOut.addEventListener("click", function () { setLbZoom(lbScale / 1.5); });
  if (lbZoomReset) lbZoomReset.addEventListener("click", resetLbZoom);
  if (lightbox) {
    lightbox.addEventListener("wheel", function (e) {
      if (!lightbox.classList.contains("open")) return;
      e.preventDefault();
      setLbZoom(lbScale * (e.deltaY < 0 ? 1.15 : 1 / 1.15));
    }, { passive: false });
  }
  if (lbFigure) {
    lbFigure.addEventListener("dblclick", function () {
      setLbZoom(lbScale > 1.01 ? 1 : 2.5);
    });
  }
  let panning = false, panSX = 0, panSY = 0, panTX = 0, panTY = 0;
  if (lightbox) {
    lightbox.addEventListener("mousedown", function (e) {
      if (lbScale <= 1.01) return;
      if (e.target.closest("button")) return;
      panning = true; panSX = e.clientX; panSY = e.clientY; panTX = lbTx; panTY = lbTy;
      lbImg.style.cursor = "grabbing";
      e.preventDefault();
    });
    window.addEventListener("mousemove", function (e) {
      if (!panning) return;
      lbTx = panTX + (e.clientX - panSX);
      lbTy = panTY + (e.clientY - panSY);
      applyLbZoom();
    });
    window.addEventListener("mouseup", function () {
      if (!panning) return;
      panning = false;
      lbImg.style.cursor = lbScale > 1.01 ? "grab" : "zoom-in";
    });
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
    { f: "momento-11.jpg", cap: "Con nuestros visitantes", alt: "Visitantes posando en Tradiciones Arequipeñas" },
    { f: "momento-12.jpg", cap: "Altar de la Virgen", alt: "Altar con la imagen de la Virgen, flores y velas en Tradiciones Arequipeñas" }
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
    const flipEl = document.getElementById("carta-flip");
    const stage = document.getElementById("carta-stage");
    const pages = Array.prototype.slice.call(flipEl.querySelectorAll(".carta-page"));
    const label = document.getElementById("carta-page");
    const prevBtn = document.getElementById("carta-prev");
    const nextBtn = document.getElementById("carta-next");
    const zoomBtn = document.getElementById("carta-zoom");
    const fsBtn = document.getElementById("carta-fullscreen");
    const N = pages.length;

    /* ---- Sonido de pasar página (real CC0) con respaldo sintetizado ---- */
    let soundOn = true;
    try { soundOn = localStorage.getItem("carta-sound") !== "off"; } catch (e) {}
    let audioCtx = null;
    function ensureAudio() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!audioCtx) audioCtx = new AC();
      if (audioCtx.state === "suspended") audioCtx.resume();
      return audioCtx;
    }
    const sndNext = new Audio("audio/pagina.mp3");
    const sndPrev = new Audio("audio/pagina-rev.mp3");
    let soundFileOk = true;
    [sndNext, sndPrev].forEach(function (s) {
      s.preload = "auto";
      s.volume = 0.55;
      s.addEventListener("error", function () { soundFileOk = false; });
    });
    function playSynth(reverse) {
      const ctx = ensureAudio();
      if (!ctx) return;
      const dur = 0.42, sr = ctx.sampleRate;
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
      filter.type = "bandpass"; filter.Q.value = 0.9;
      const now = ctx.currentTime;
      filter.frequency.setValueAtTime(reverse ? 2400 : 800, now);
      filter.frequency.exponentialRampToValueAtTime(reverse ? 700 : 2600, now + dur);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.22, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      src.start(now); src.stop(now + dur + 0.02);
    }
    function playPageSound(reverse) {
      if (!soundOn) return;
      if (soundFileOk) {
        const snd = reverse ? sndPrev : sndNext;
        try {
          snd.currentTime = 0;
          const pr = snd.play();
          if (pr && pr.catch) pr.catch(function () { playSynth(reverse); });
          return;
        } catch (e) {}
      }
      playSynth(reverse);
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

    const cartaList = pages.map(function (pg) {
      const img = pg.querySelector("img");
      return { src: img.src, alt: img.alt };
    });

    /* ---- Librería StPageFlip: volteo de hoja realista ---- */
    const hasLib = !!(window.St && window.St.PageFlip);
    let pageFlip = null;
    if (hasLib) {
      pageFlip = new St.PageFlip(flipEl, {
        width: 1000, height: 1350,
        size: "stretch",
        minWidth: 260, maxWidth: 1400,
        minHeight: 340, maxHeight: 1900,
        maxShadowOpacity: 0.45,
        showCover: false,
        swipeDistance: 60,
        mobileScrollSupport: true,
        usePortrait: true,
        drawShadow: true,
        flippingTime: 1000,
        useMouseEvents: false,
        startPage: 0,
        autoSize: true
      });
      pageFlip.loadFromHTML(pages);
    }

    let lastIndex = 0;
    const thumbButtons = [];
    function currentIndex() { return pageFlip ? pageFlip.getCurrentPageIndex() : 0; }
    function updateUI() {
      const i = currentIndex();
      const landscape = !!(pageFlip && pageFlip.getOrientation() === "landscape");
      if (landscape) {
        const right = Math.min(i + 1, N - 1);
        label.textContent = (i + 1) + "-" + (right + 1) + " / " + N;
        prevBtn.disabled = i <= 0;
        nextBtn.disabled = i >= N - 2;
      } else {
        label.textContent = (i + 1) + " / " + N;
        prevBtn.disabled = i <= 0;
        nextBtn.disabled = i >= N - 1;
      }
      thumbButtons.forEach(function (b, k) { b.classList.toggle("is-current", k === i); });
    }
    function nextPage() { noteAction(); if (pageFlip) { pageFlip.flipNext(); playPageSound(false); } }
    function prevPage() { noteAction(); if (pageFlip) { pageFlip.flipPrev(); playPageSound(true); } }

    if (pageFlip) {
      pageFlip.on("flip", function (e) { lastIndex = e.data; updateUI(); });
      pageFlip.on("changeState", updateUI);
    }

    prevBtn.addEventListener("click", prevPage);
    nextBtn.addEventListener("click", nextPage);
    zoomBtn.addEventListener("click", function () { openLightbox(cartaList, currentIndex()); });

    /* ---- Miniaturas ---- */
    const thumbsWrap = document.getElementById("carta-thumbs");
    const thumbsInner = document.getElementById("carta-thumbs-inner");
    const thumbsBtn = document.getElementById("carta-thumbs-btn");
    if (thumbsInner) {
      cartaList.forEach(function (item, i) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "carta-thumb";
        b.setAttribute("aria-label", "Ir a la hoja " + (i + 1));
        const im = document.createElement("img");
        im.src = item.src;
        im.alt = "";
        b.appendChild(im);
        b.addEventListener("click", function () {
          noteAction();
          if (pageFlip) pageFlip.turnToPage(i);
          updateUI();
        });
        thumbsInner.appendChild(b);
        thumbButtons.push(b);
      });
    }
    if (thumbsBtn && thumbsWrap) {
      thumbsBtn.addEventListener("click", function () {
        const willOpen = thumbsWrap.hidden;
        thumbsWrap.hidden = !willOpen;
        thumbsBtn.setAttribute("aria-pressed", willOpen ? "true" : "false");
      });
    }

    /* ---- Reproducción automática ---- */
    const autoBtn = document.getElementById("carta-auto");
    const icoPlay = autoBtn ? autoBtn.querySelector(".ico-play") : null;
    const icoPause = autoBtn ? autoBtn.querySelector(".ico-pause") : null;
    let autoTimer = null;
    function stopAuto() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
      if (autoBtn) autoBtn.setAttribute("aria-pressed", "false");
      if (icoPlay) icoPlay.hidden = false;
      if (icoPause) icoPause.hidden = true;
    }
    function startAuto() {
      if (autoTimer || !pageFlip) return;
      if (autoBtn) autoBtn.setAttribute("aria-pressed", "true");
      if (icoPlay) icoPlay.hidden = true;
      if (icoPause) icoPause.hidden = false;
      autoTimer = setInterval(function () {
        if (!pageFlip) return;
        const ls = pageFlip.getOrientation() === "landscape";
        const atEnd = ls ? (pageFlip.getCurrentPageIndex() >= N - 2) : (pageFlip.getCurrentPageIndex() >= N - 1);
        if (atEnd) { pageFlip.turnToPage(0); playPageSound(false); }
        else { pageFlip.flipNext(); playPageSound(false); }
      }, 4200);
    }
    if (autoBtn) autoBtn.addEventListener("click", function () { if (autoTimer) stopAuto(); else startAuto(); });

    updateUI();

    /* Si el zoom (pinch) o la rotación redimensionan el libro, mantén la hoja actual */
    let resizeTimer = null;
    function restoreCurrentPage() {
      if (!pageFlip) return;
      try {
        if (pageFlip.getCurrentPageIndex() !== lastIndex) pageFlip.turnToPage(lastIndex);
      } catch (e) {}
    }
    let lastActionAt = 0;
    function noteAction() { lastActionAt = Date.now(); }
    function scheduleRestore() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (Date.now() - lastActionAt < 1200) return;
        restoreCurrentPage();
        setTimeout(restoreCurrentPage, 400);
      }, 160);
    }
    window.addEventListener("resize", scheduleRestore);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", scheduleRestore);
    }
    window.addEventListener("orientationchange", scheduleRestore);

    /* Pantalla completa */
    fsBtn.addEventListener("click", function () {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (book.requestFullscreen) book.requestFullscreen();
    });

    /* Gestos: clic/toque limpio amplía la hoja; deslizar/arrastrar pasa de hoja */
    let swipeX = null, swipeY = null, swipeT = 0;
    stage.addEventListener("touchstart", function (e) {
      if (e.touches.length !== 1) return;
      swipeX = e.touches[0].clientX; swipeY = e.touches[0].clientY; swipeT = Date.now();
    }, { passive: true });
    stage.addEventListener("touchend", function (e) {
      if (swipeX === null) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - swipeX, dy = t.clientY - swipeY;
      const dt = Date.now() - swipeT;
      swipeX = null;
      if (dt > 900) return;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 12) {
        if (e.target.closest(".carta-page")) openLightbox(cartaList, currentIndex());
      } else if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0) nextPage(); else prevPage();
      }
    }, { passive: true });
    let mdX = null, mdY = null;
    stage.addEventListener("mousedown", function (e) { mdX = e.clientX; mdY = e.clientY; });
    window.addEventListener("mouseup", function (e) {
      if (mdX === null) return;
      const dx = e.clientX - mdX, dy = e.clientY - mdY;
      mdX = null; mdY = null;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 8) {
        if (e.target.closest(".carta-page")) openLightbox(cartaList, currentIndex());
      } else if (Math.abs(dx) > 60) {
        if (dx < 0) nextPage(); else prevPage();
      }
    });
    /* Teclado ← → con la carta enfocada o en pantalla completa */
    document.addEventListener("keydown", function (e) {
      if (lightbox.classList.contains("open")) return;
      const inFull = document.fullscreenElement === book;
      if (!inFull && !book.contains(document.activeElement)) return;
      if (e.key === "ArrowLeft") prevPage();
      if (e.key === "ArrowRight") nextPage();
    });

    /* Si la librería no cargó, muestra las hojas apiladas (degradado elegante) */
    if (!hasLib) {
      flipEl.classList.add("carta-flip-fallback");
      label.textContent = "Carta (" + N + " hojas)";
      prevBtn.disabled = true;
      nextBtn.disabled = true;
    }
  }

  /* ============================================================
     COOKIES: aviso, preferencias y carga condicionada del mapa
     ============================================================ */
  const COOKIE_KEY = "aqp-cookies";
  const cookieBanner = document.getElementById("cookie-banner");
  const cookieModal = document.getElementById("cookie-modal");
  const cbAnalytics = document.getElementById("cookie-analytics");
  const cbThird = document.getElementById("cookie-third");
  const mapaIframe = document.getElementById("mapa-iframe");
  const mapaPlaceholder = document.getElementById("mapa-placeholder");

  function loadMap() {
    if (mapaIframe && !mapaIframe.getAttribute("src") && mapaIframe.dataset.src) {
      mapaIframe.setAttribute("src", mapaIframe.dataset.src);
      if (mapaPlaceholder) mapaPlaceholder.hidden = true;
    }
  }
  function readConsent() {
    try { return JSON.parse(localStorage.getItem(COOKIE_KEY) || "null"); } catch (e) { return null; }
  }
  function saveConsent(c) {
    try { localStorage.setItem(COOKIE_KEY, JSON.stringify(c)); } catch (e) {}
  }
  function applyConsent(c) { if (c && c.third) loadMap(); }
  function openCookieModal() {
    const c = readConsent() || { analytics: false, third: false };
    if (cbAnalytics) cbAnalytics.checked = !!c.analytics;
    if (cbThird) cbThird.checked = !!c.third;
    if (cookieModal) cookieModal.hidden = false;
  }
  function closeCookieModal() { if (cookieModal) cookieModal.hidden = true; }
  function hideBanner() {
    if (cookieBanner) cookieBanner.hidden = true;
    document.body.classList.remove("cookie-banner-open");
  }
  function showBanner() {
    if (cookieBanner) cookieBanner.hidden = false;
    document.body.classList.add("cookie-banner-open");
  }
  function commitConsent(c) {
    saveConsent(c); applyConsent(c);
    hideBanner();
    closeCookieModal();
  }

  const savedConsent = readConsent();
  if (savedConsent) applyConsent(savedConsent);
  else showBanner();

  const elAccept = document.getElementById("cookie-accept");
  const elReject = document.getElementById("cookie-reject");
  const elConfig = document.getElementById("cookie-config");
  const elMReject = document.getElementById("cookie-modal-reject");
  const elMSave = document.getElementById("cookie-modal-save");
  const elOpen = document.getElementById("cookie-open");
  const elMapBtn = document.getElementById("mapa-cargar");

  if (elAccept) elAccept.addEventListener("click", function () { commitConsent({ analytics: true, third: true }); });
  if (elReject) elReject.addEventListener("click", function () { commitConsent({ analytics: false, third: false }); });
  if (elConfig) elConfig.addEventListener("click", function () { hideBanner(); openCookieModal(); });
  if (elMReject) elMReject.addEventListener("click", function () { commitConsent({ analytics: false, third: false }); });
  if (elMSave) elMSave.addEventListener("click", function () {
    commitConsent({ analytics: !!(cbAnalytics && cbAnalytics.checked), third: !!(cbThird && cbThird.checked) });
  });
  if (elOpen) elOpen.addEventListener("click", openCookieModal);
  if (elMapBtn) elMapBtn.addEventListener("click", function () {
    const c = readConsent() || { analytics: false, third: false };
    c.third = true; saveConsent(c); loadMap();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && cookieModal && !cookieModal.hidden) closeCookieModal();
  });
  if (document.getElementById("carta-book")) initCartaBook();
})();
