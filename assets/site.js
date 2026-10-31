/* Kaido website behaviour. Everything here is an enhancement: every page reads fine without it. */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Menu sheet (phones) ---------- */
  var menuBtn = document.querySelector(".menu-btn");
  var sheet = document.getElementById("sheet");
  if (menuBtn && sheet) {
    var setMenu = function (open) {
      menuBtn.setAttribute("aria-expanded", String(open));
      sheet.classList.toggle("open", open);
      sheet.toggleAttribute("inert", !open);
      document.body.style.overflow = open ? "hidden" : "";
    };
    setMenu(false);
    menuBtn.addEventListener("click", function () { setMenu(menuBtn.getAttribute("aria-expanded") !== "true"); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && sheet.classList.contains("open")) { setMenu(false); menuBtn.focus(); } });
    window.matchMedia("(min-width: 861px)").addEventListener("change", function (m) { if (m.matches) setMenu(false); });
  }

  /* ---------- Entrances: each part rises once, staggered ---------- */
  var risers = [].slice.call(document.querySelectorAll("[data-rise]"));
  if ("IntersectionObserver" in window && risers.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    risers.forEach(function (el) { io.observe(el); });
  } else {
    risers.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Toast + copy email ---------- */
  var toast;
  function say(text) {
    if (!toast) { toast = document.createElement("div"); toast.className = "toast"; toast.setAttribute("role", "status"); document.body.appendChild(toast); }
    toast.textContent = text;
    toast.classList.add("show");
    clearTimeout(say.t);
    say.t = setTimeout(function () { toast.classList.remove("show"); }, 2200);
  }
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-copy");
      if (navigator.clipboard) navigator.clipboard.writeText(v).then(function () { say("Email copied"); }, function () { say(v); });
      else say(v);
    });
  });

  /* ---------- Home hero: the phone advances through four screens as you scroll ---------- */
  var track = document.querySelector(".hero-track");
  if (track) {
    var shots = [].slice.call(track.querySelectorAll(".reel img"));
    var caps = JSON.parse(track.getAttribute("data-caps") || "[]");
    var capEl = track.querySelector(".cap");
    var stepEl = track.querySelector(".step");
    var dots = [].slice.call(track.querySelectorAll(".dots span"));
    var current = -1;
    var show = function (i) {
      if (i === current) return;
      current = i;
      shots.forEach(function (im, k) { im.classList.toggle("on", k === i); });
      dots.forEach(function (d, k) { d.classList.toggle("on", k === i); });
      if (capEl && caps[i]) capEl.textContent = caps[i];
      if (stepEl) stepEl.textContent = (i + 1) + " of " + shots.length;
    };
    var wide = window.matchMedia("(min-width: 861px)");
    var phoneBox = track.querySelector(".hero-phone");
    var spacer = track.querySelector(".hero-spacer");
    var tick = function () {
      var p;
      if (wide.matches) {
        var r = track.getBoundingClientRect();
        var span = track.offsetHeight - window.innerHeight;
        p = -r.top / Math.max(1, span);
      } else if (phoneBox && spacer) {
        // phones: the phone sticks while the spacer scrolls under it
        p = (phoneBox.getBoundingClientRect().bottom - spacer.getBoundingClientRect().top) / Math.max(1, spacer.offsetHeight);
      } else { p = 0; }
      p = Math.min(1, Math.max(0, p));
      show(Math.min(shots.length - 1, Math.floor(p * shots.length * 0.999)));
    };
    var raf = 0;
    window.addEventListener("scroll", function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; tick(); }); }, { passive: true });
    window.addEventListener("resize", tick);
    tick();
  }

  /* ---------- Sentences with switches ---------- */
  document.querySelectorAll(".band").forEach(function (band) {
    var sw = band.querySelector(".switch");
    var why = band.querySelector(".why");
    if (!sw) return;
    var apply = function (on) {
      sw.setAttribute("aria-checked", String(on));
      band.classList.toggle("on", on);
      if (why) why.textContent = on ? why.getAttribute("data-on") : why.getAttribute("data-off");
    };
    apply(sw.getAttribute("aria-checked") === "true");
    sw.addEventListener("click", function () { apply(sw.getAttribute("aria-checked") !== "true"); });
  });

  /* ---------- Demo garage: the real routes of the app's demo, drawn as the ink map ---------- */
  var card = document.querySelector(".map-card");
  if (card) initDemo(card);

  function initDemo(card) {
    var base = card.getAttribute("data-base") || "assets/data/";
    var colors = { "GT3": "#c4501a", "Type R": "#1f4f8f", "Miata": "#2f7a42", "Scooter": "#1a1918", "Z": "#1f4f8f", "A110": "#2f7a42" };
    var MI = 0.621371; // the sample is stored in km; the site speaks miles
    var views = {
      la: { label: "Los Angeles", region: "california", box: [-118.95, 33.62, -117.55, 34.45] },
      california: { label: "California", region: "california", box: null },
      france: { label: "France", region: "france", box: null },
      japan: { label: "Japan", region: "japan", box: null }
    };
    var svg = card.querySelector("svg");
    var gLand = svg.querySelector(".g-land");
    var gRoutes = svg.querySelector(".g-routes");
    var odo = document.querySelector(".odo b");
    var odoSub = document.querySelector(".odo-sub");
    var input = document.getElementById("find");
    var result = document.querySelector(".result");
    var legend = document.querySelector(".legend");
    var regionBtns = [].slice.call(document.querySelectorAll(".regions button"));
    var routes = [], land = {}, view = "la", paths = [], hot = null, odoAnim = 0;

    Promise.all([
      fetch(base + "routes.json").then(function (r) { return r.json(); }),
      fetch(base + "land.json").then(function (r) { return r.json(); })
    ]).then(function (d) {
      routes = d[0]; land = d[1];
      card.classList.add("ready");
      var dl = document.getElementById("drive-names");
      if (dl) routes.forEach(function (r) { var o = document.createElement("option"); o.value = r.n; dl.appendChild(o); });
      draw(view, true);
    }).catch(function () { /* the screenshot stays as the picture */ });

    regionBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        var v = b.getAttribute("data-view");
        if (v === view) return;
        if (input) input.value = "";
        clearHot();
        draw(v, true);
      });
    });

    var lastTyped = 0;
    if (input) {
      input.addEventListener("input", function () { lastTyped = Date.now(); find(input.value, false); });
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); find(input.value, true); } });
    }
    document.querySelectorAll(".suggest button").forEach(function (b) {
      b.addEventListener("click", function () { input.value = b.textContent; find(b.textContent, true); });
    });

    function project(v) {
      var reg = views[v].region, box = views[v].box;
      var rs = routes.filter(function (r) { return r.r === reg; });
      if (!box) {
        var x0 = 999, y0 = 999, x1 = -999, y1 = -999;
        rs.forEach(function (r) { r.p.forEach(function (p) { if (p[1] < x0) x0 = p[1]; if (p[1] > x1) x1 = p[1]; if (p[0] < y0) y0 = p[0]; if (p[0] > y1) y1 = p[0]; }); });
        box = [x0, y0, x1, y1];
      }
      var midLat = (box[1] + box[3]) / 2, k = Math.cos(midLat * Math.PI / 180);
      var W = 1000, H = 800, pad = 70, padTop = 150;
      var bw = (box[2] - box[0]) * k, bh = box[3] - box[1];
      var s = Math.min((W - pad * 2) / bw, (H - pad - padTop) / bh);
      var ox = (W - bw * s) / 2, oy = padTop + (H - pad - padTop - bh * s) / 2;
      return { rs: rs, f: function (lat, lon) { return [ox + (lon - box[0]) * k * s, oy + (box[3] - lat) * s]; } };
    }

    function pathD(pts, f) {
      var d = "";
      for (var i = 0; i < pts.length; i++) { var q = f(pts[i][0], pts[i][1]); d += (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1); }
      return d;
    }

    function draw(v, animate) {
      view = v;
      regionBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-view") === v)); });
      var P = project(v);
      var reg = views[v].region;
      var lr = (land[reg] && land[reg].rings) || [];
      gLand.innerHTML = lr.map(function (ring) { return '<path class="land" d="' + pathD(ring, P.f) + 'Z"/>'; }).join("");
      gRoutes.innerHTML = "";
      paths = [];
      var inView = P.rs;
      if (views[v].box) {
        var b = views[v].box;
        inView = P.rs.filter(function (r) { return r.p.some(function (p) { return p[1] > b[0] && p[1] < b[2] && p[0] > b[1] && p[0] < b[3]; }); });
      }
      // longest drives first so short hops sit on top
      inView.forEach(function (r, i) {
        var el = document.createElementNS("http://www.w3.org/2000/svg", "path");
        el.setAttribute("class", "route");
        el.setAttribute("d", pathD(r.p, P.f));
        el.setAttribute("stroke", colors[r.c] || "#1a1918");
        el.__r = r;
        gRoutes.appendChild(el);
        paths.push(el);
      });
      // legend for the cars in this view
      var cars = {};
      inView.forEach(function (r) { cars[r.c] = (cars[r.c] || 0) + r.km; });
      if (legend) legend.innerHTML = Object.keys(cars).map(function (c) {
        return '<span><i class="pill-dot" style="background:' + colors[c] + '"></i>' + c + "</span>";
      }).join("");
      var total = inView.reduce(function (a, r) { return a + r.km; }, 0);
      if (odoSub) odoSub.textContent = inView.length + " drives in " + views[v].label;
      card.classList.remove("focus");
      hot = null;
      if (animate && !reduce) inkIn(paths);
      countTo(total * MI, animate && !reduce ? 1500 : 0);
      if (input && input.value) find(input.value, false, true);
    }

    function inkIn(list) {
      list.forEach(function (el, i) {
        var L = el.getTotalLength();
        el.style.strokeDasharray = L + " " + L;
        el.style.strokeDashoffset = L;
        el.getBoundingClientRect();
        var d = 700 + Math.min(900, L * 0.6);
        el.style.transition = "stroke-dashoffset " + d + "ms cubic-bezier(0.23, 1, 0.32, 1) " + Math.min(i * 22, 700) + "ms, opacity .4s ease";
        el.style.strokeDashoffset = 0;
      });
    }

    // the odometer: quick, then the last digits settle one by one, like the app's count-up
    function countTo(target, ms) {
      cancelAnimationFrame(odoAnim);
      if (!odo) return;
      var fmt = function (n) { return Math.round(n).toLocaleString("en-US"); };
      if (!ms) { odo.textContent = fmt(target); return; }
      var start = performance.now();
      var step = function (t) {
        var p = Math.min(1, (t - start) / ms);
        var e = 1 - Math.pow(1 - p, 4);
        odo.textContent = fmt(target * e);
        if (p < 1) odoAnim = requestAnimationFrame(step);
      };
      odoAnim = requestAnimationFrame(step);
    }

    function norm(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim(); }

    function find(q, jump, quiet) {
      var nq = norm(q || "");
      if (!nq) { clearHot(); return; }
      var words = nq.split(" ");
      var best = null, bestScore = 0;
      routes.forEach(function (r) {
        var n = norm(r.n), sc = 0;
        if (n === nq) sc = 100; else if (n.indexOf(nq) === 0) sc = 60; else if (n.indexOf(nq) > -1) sc = 40;
        else { var all = words.every(function (w) { return n.indexOf(w) > -1; }); if (all) sc = 20; }
        if (sc > bestScore || (sc === bestScore && sc && r.km > best.km)) { best = r; bestScore = sc; }
      });
      if (!best) { clearHot(); showResult(null, q); return; }
      var v = Object.keys(views).filter(function (k) { return views[k].region === best.r; })[0];
      if (best.r === "california") {
        var b = views.la.box;
        var inLA = best.p.every(function (p) { return p[1] > b[0] && p[1] < b[2] && p[0] > b[1] && p[0] < b[3]; });
        v = inLA ? "la" : "california";
      }
      if (v !== view && !quiet) { draw(v, false); }
      var el = paths.filter(function (p) { return p.__r === best; })[0];
      if (!el) { showResult(best); return; }
      if (hot && hot !== el) hot.classList.remove("hot");
      hot = el;
      el.classList.add("hot");
      card.classList.add("focus");
      gRoutes.appendChild(el);
      if (!reduce && (jump || !quiet)) {
        var L = el.getTotalLength();
        el.style.transition = "none";
        el.style.strokeDasharray = L + " " + L;
        el.style.strokeDashoffset = L;
        el.getBoundingClientRect();
        el.style.transition = "stroke-dashoffset 1100ms cubic-bezier(0.23, 1, 0.32, 1), opacity .3s ease";
        el.style.strokeDashoffset = 0;
      }
      showResult(best);
    }

    function clearHot() {
      if (hot) hot.classList.remove("hot");
      hot = null;
      card.classList.remove("focus");
      if (result) result.innerHTML = '<p class="muted">Type a road, a town or a place: Big Sur, Hakone, Versailles, Mulholland.</p>';
    }

    function showResult(r, q) {
      if (!result) return;
      if (!r) { result.innerHTML = '<p class="muted">No drive called "' + escapeHTML(q) + '" in the sample logbook. Try Big Sur, Hakone or Versailles.</p>'; return; }
      var place = { california: "California", france: "France", japan: "Japan" }[r.r];
      result.innerHTML =
        '<p class="r-name">' + escapeHTML(r.n) + "</p>" +
        '<p class="r-km">' + (r.km * MI).toLocaleString("en-US", { maximumFractionDigits: 1 }) + "<small>mi</small></p>" +
        '<p class="r-meta"><i class="pill-dot" style="background:' + colors[r.c] + '"></i>' + r.c + " · " + place + "</p>";
    }

    function escapeHTML(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

    clearHot();
  }

  /* ---------- Support: search and topics ---------- */
  var helpInput = document.getElementById("help-q");
  var items = [].slice.call(document.querySelectorAll(".help-item"));
  if (items.length) {
    var topic = "all";
    var none = document.querySelector(".none");
    var count = document.getElementById("help-count");
    var filter = function () {
      var q = helpInput ? helpInput.value.toLowerCase().trim() : "";
      var shown = 0;
      items.forEach(function (it) {
        var okTopic = topic === "all" || it.getAttribute("data-topic") === topic;
        var okText = !q || it.textContent.toLowerCase().indexOf(q) > -1;
        it.hidden = !(okTopic && okText);
        if (!it.hidden) shown++;
      });
      if (none) none.hidden = shown > 0;
      if (count) count.textContent = shown === items.length ? "" : shown + (shown === 1 ? " answer" : " answers");
    };
    if (helpInput) helpInput.addEventListener("input", filter);
    document.querySelectorAll(".topics button").forEach(function (b) {
      b.addEventListener("click", function () {
        topic = b.getAttribute("data-topic");
        document.querySelectorAll(".topics button").forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
        filter();
      });
    });
    if (location.hash && document.querySelector(location.hash)) { /* deep links keep working */ }
  }

  /* ---------- Contact: write the email for them ---------- */
  var form = document.getElementById("mail-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var topicV = fd.get("topic") || "Question";
      var name = (fd.get("name") || "").toString().trim();
      var msg = (fd.get("message") || "").toString().trim();
      var device = (fd.get("device") || "").toString().trim();
      var body = msg + "\n\n" + (device ? "iPhone and iOS: " + device + "\n" : "") + (name ? "From: " + name + "\n" : "");
      var href = "mailto:taikishik@gmail.com?subject=" + encodeURIComponent("Kaido: " + topicV) + "&body=" + encodeURIComponent(body);
      window.location.href = href;
      say("Opening your mail app");
    });
  }

  /* ---------- Long pages: highlight where you are ---------- */
  var idx = [].slice.call(document.querySelectorAll(".doc-index a"));
  if (idx.length && "IntersectionObserver" in window) {
    var map = {};
    idx.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var obs = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) { idx.forEach(function (a) { a.classList.remove("on"); }); var a = map[e.target.id]; if (a) a.classList.add("on"); }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) obs.observe(s); });
  }

  /* ---------- About: the O assembles from its three pieces ---------- */
  var segs = [].slice.call(document.querySelectorAll(".logo-stage .seg"));
  if (segs.length && !reduce && "IntersectionObserver" in window) {
    var dirs = [[14, -18], [0, 22], [-14, -18]];
    segs.forEach(function (s, i) { s.style.transform = "translate(" + dirs[i][0] + "px," + dirs[i][1] + "px) rotate(-40deg)"; s.style.opacity = "0"; });
    new IntersectionObserver(function (en, o) {
      if (!en[0].isIntersecting) return;
      o.disconnect();
      segs.forEach(function (s, i) {
        s.style.transition = "transform 900ms cubic-bezier(0.23, 1, 0.32, 1) " + (i * 90) + "ms, opacity 500ms ease " + (i * 90) + "ms";
        s.style.transform = "none"; s.style.opacity = "1";
      });
    }, { threshold: 0.4 }).observe(segs[0].closest(".logo-stage"));
  }

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

/* Contact: preselect the topic from ?topic= */
(function () {
  var t = new URLSearchParams(location.search).get("topic");
  if (!t) return;
  var r = document.querySelector('.choices input[data-key="' + t + '"]');
  if (r) r.checked = true;
})();
