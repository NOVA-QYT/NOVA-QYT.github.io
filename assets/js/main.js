// Theme: cycles system -> light -> dark. Stored per browser.
(function () {
  var KEY = "theme";
  var root = document.documentElement;

  function read() {
    try { return localStorage.getItem(KEY) || "system"; } catch (e) { return "system"; }
  }
  function write(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }
  function apply(v) {
    if (v === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", v);
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.setAttribute("title", "Theme: " + v);
      btn.querySelectorAll("[data-icon]").forEach(function (el) {
        el.style.display = el.getAttribute("data-icon") === v ? "" : "none";
      });
    }
  }

  apply(read());

  document.addEventListener("DOMContentLoaded", function () {
    apply(read());

    var btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        var order = ["system", "light", "dark"];
        var next = order[(order.indexOf(read()) + 1) % order.length];
        write(next);
        apply(next);
      });
    }

    // Mobile nav
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var open = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    // Publication abstract / bibtex toggles
    document.querySelectorAll("[data-toggle]").forEach(function (b) {
      b.setAttribute("aria-expanded", "false");
      b.addEventListener("click", function () {
        var pub = b.closest(".pub");
        var target = pub.querySelector("." + b.getAttribute("data-toggle"));
        var willOpen = !target.classList.contains("open");
        pub.querySelectorAll(".pub-extra").forEach(function (x) { x.classList.remove("open"); });
        pub.querySelectorAll("[data-toggle]").forEach(function (x) { x.setAttribute("aria-expanded", "false"); });
        if (willOpen) {
          target.classList.add("open");
          b.setAttribute("aria-expanded", "true");
        }
      });
    });

    // Footer year
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

    // GitHub repos (projects page)
    var repoBox = document.getElementById("repos");
    if (repoBox) loadRepos(repoBox);
  });

  function loadRepos(box) {
    var user = box.getAttribute("data-user");
    fetch("https://api.github.com/users/" + user + "/repos?per_page=100&sort=pushed")
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (repos) {
        var own = repos.filter(function (r) { return !r.fork && r.name.toLowerCase() !== (user + ".github.io").toLowerCase(); });
        if (!own.length) throw new Error("empty");
        box.innerHTML = "";
        own.forEach(function (r) {
          var a = document.createElement("a");
          a.className = "repo";
          a.href = r.html_url;
          a.target = "_blank";
          a.rel = "noopener";
          var h = document.createElement("h3");
          h.textContent = r.name;
          var p = document.createElement("p");
          p.textContent = r.description || "No description.";
          var m = document.createElement("div");
          m.className = "meta";
          if (r.language) m.appendChild(span(r.language));
          m.appendChild(span("★ " + r.stargazers_count));
          m.appendChild(span("Updated " + r.pushed_at.slice(0, 10)));
          a.append(h, p, m);
          box.appendChild(a);
        });
      })
      .catch(function () {
        box.innerHTML = '<p class="muted">Could not load repositories. See them on <a href="https://github.com/' +
          user + '?tab=repositories">GitHub</a>.</p>';
      });
  }

  function span(t) { var s = document.createElement("span"); s.textContent = t; return s; }
})();
