window.initSiteAnimations = function () {
  "use strict";

  document.body.classList.remove("home-enter-active", "home-enter-done");

  if (window.siteEnterTimeout) {
    window.clearTimeout(window.siteEnterTimeout);
  }

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  var countDuration = 2800;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function initHeroEnter() {
    if (prefersReducedMotion) {
      document.body.classList.add("home-enter-active", "home-enter-done");
      return;
    }

    window.requestAnimationFrame(function () {
      document.body.classList.add("home-enter-active");
    });

    window.siteEnterTimeout = window.setTimeout(function () {
      document.body.classList.add("home-enter-done");
    }, 1200);
  }

  function initMetricsCountUp() {
    var section = document.querySelector(".home-metrics");
    if (!section) {
      return;
    }

    var values = Array.prototype.slice.call(
      section.querySelectorAll(".home-metrics__value[data-count-up]")
    );

    if (!values.length) {
      return;
    }

    values.forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count-up"), 10);
      var suffix = el.getAttribute("data-count-suffix") || "";

      el._countTarget = isNaN(target) ? 0 : target;
      el._countSuffix = suffix;

      if (!prefersReducedMotion) {
        el.textContent = "0" + suffix;
      }
    });

    if (prefersReducedMotion) {
      return;
    }

    var started = false;

    function runCountUp() {
      if (started) {
        return;
      }
      started = true;

      var startTime = null;

      function frame(now) {
        if (startTime === null) {
          startTime = now;
        }

        var progress = Math.min(1, (now - startTime) / countDuration);
        var eased = easeOutCubic(progress);

        values.forEach(function (el) {
          var value = Math.round(eased * el._countTarget);
          el.textContent = String(value) + el._countSuffix;
        });

        if (progress < 1) {
          window.requestAnimationFrame(frame);
        }
      }

      window.requestAnimationFrame(frame);
    }

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              runCountUp();
              observer.disconnect();
            }
          });
        },
        {
          root: null,
          rootMargin: "0px 0px -8% 0px",
          threshold: 0.15,
        }
      );

      observer.observe(section);
      return;
    }

    runCountUp();
  }

  initHeroEnter();
  initMetricsCountUp();
};

window.initSiteAnimations();
