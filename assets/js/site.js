/* CouchPilot site shell — injects the shared header + footer into every page so navigation
   lives in ONE place (maintainability). Page CONTENT is fully static HTML; only the chrome is
   injected. A <noscript> fallback nav in each page's footer keeps links reachable without JS. */
(function () {
  "use strict";

  var LOGO =
    '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">' +
    '<defs><linearGradient id="cpG" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#4C82F7"/><stop offset="1" stop-color="#9168F5"/>' +
    "</linearGradient></defs>" +
    '<rect x="2" y="2" width="44" height="44" rx="12" fill="#0B111A" stroke="#1E2A38"/>' +
    '<circle cx="24" cy="24" r="13" fill="none" stroke="url(#cpG)" stroke-width="3"/>' +
    '<circle cx="24" cy="24" r="4.6" fill="url(#cpG)"/>' +
    "</svg>";

  // Primary nav. Order = visitor intent (evaluate → verify → help → get). Roadmap lives in the
  // footer. Paths are RELATIVE (GitHub Pages project-path safe). Last entry renders as the CTA.
  var NAV = [
    ["features.html", "Features"],
    ["supported-devices.html", "Supported Devices"],
    ["faq.html", "FAQ"],
    ["support.html", "Support"],
    ["download.html", "Download", "nav-cta"],
  ];

  var FOOTER = [
    ["Product", [["features.html", "Features"], ["supported-devices.html", "Supported Devices"], ["roadmap.html", "Roadmap"], ["releases.html", "Release Notes"], ["download.html", "Download"]]],
    ["Help", [["faq.html", "FAQ"], ["support.html", "Support"], ["contact.html", "Contact"]]],
    ["Legal", [["privacy.html", "Privacy Policy"], ["terms.html", "Terms of Use"], ["trademarks.html", "Trademarks"], ["acknowledgements.html", "Acknowledgements"]]],
  ];

  var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  // Header
  var header = el(
    '<header class="site-header"><div class="wrap">' +
    '<a class="brand" href="index.html" aria-label="CouchPilot home">' + LOGO + "<span>CouchPilot</span></a>" +
    '<button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="site-nav">&#9776;</button>' +
    '<nav class="nav" id="site-nav" aria-label="Primary">' +
    NAV.map(function (n) {
      var cur = n[0].toLowerCase() === page ? ' aria-current="page"' : "";
      var cls = n[2] ? ' class="' + n[2] + '"' : "";
      return '<a href="' + n[0] + '"' + cur + cls + ">" + n[1] + "</a>";
    }).join("") +
    "</nav></div></header>"
  );

  // Footer
  var cols = FOOTER.map(function (c) {
    return "<div><h4>" + c[0] + "</h4>" +
      c[1].map(function (l) { return '<a href="' + l[0] + '">' + l[1] + "</a>"; }).join("") +
      "</div>";
  }).join("");

  var footer = el(
    '<footer class="site-footer"><div class="wrap">' +
    '<div class="foot-grid">' +
    '<div class="foot-brand"><a class="brand" href="index.html">' + LOGO + "<span>CouchPilot</span></a>" +
    '<p class="muted">A fast, private remote for your TV. Local Wi-Fi only — no account, no ads, no tracking.</p>' +
    '<p><a href="mailto:app.hugocamargo@gmail.com">app.hugocamargo@gmail.com</a></p></div>' +
    cols + "</div>" +
    '<div class="foot-bottom"><span>&copy; 2026 Hugo Camargo. CouchPilot.</span>' +
    "<span>Not affiliated with LG, Samsung, Google, Roku, Amazon, or Apple.</span></div>" +
    "</div></footer>"
  );

  // Mount points: prepend header to <body>, append footer.
  var mountH = document.getElementById("site-header");
  if (mountH) mountH.replaceWith(header); else document.body.insertBefore(header, document.body.firstChild);
  var mountF = document.getElementById("site-footer");
  if (mountF) mountF.replaceWith(footer); else document.body.appendChild(footer);

  // Mobile nav toggle
  var toggle = header.querySelector(".nav-toggle");
  var nav = header.querySelector(".nav");
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
  });

  // Set current year anywhere requested
  var y = document.querySelectorAll("[data-year]");
  for (var i = 0; i < y.length; i++) y[i].textContent = "2026";
})();
