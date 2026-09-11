window.initHomeTimeline = function () {
  "use strict";

  /*
   * Timeline state classes — keep these roles separate:
   *   is-visible / is-revealed  → card fade-in only (IntersectionObserver)
   *   is-active                 → active card scaling only (scroll progress)
   *   is-reached                → dot colour/fill only (rail fill height)
   *
   * Never use is-visible or is-active to style dots. Never set is-reached from IO.
   */

  var timeline = document.querySelector(".home-timeline");
  if (!timeline) {
    return;
  }

  var rail = timeline.querySelector(".home-timeline__rail");
  var fill = timeline.querySelector(".home-timeline__rail-fill");
  var items = Array.prototype.slice.call(
    timeline.querySelectorAll(".home-timeline__item")
  );

  if (!rail || !items.length) {
    return;
  }

  timeline.classList.add("home-timeline--enhanced");

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  var triggerRatio = 0.7;
  var lastIndex = items.length - 1;
  var pageLoadScrollY = getScrollY();

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function getScrollY() {
    return window.pageYOffset || document.documentElement.scrollTop || 0;
  }

  function isInitialLoadPosition() {
    return getScrollY() <= 1;
  }

  function getMaxScrollY() {
    return Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
  }

  function getTriggerY() {
    return window.innerHeight * triggerRatio;
  }

  function getDotCenterY(item) {
    var dot = item.querySelector(".home-timeline__node-dot");
    if (!dot) {
      var rect = item.getBoundingClientRect();
      return rect.top + rect.height * 0.35;
    }

    var dotRect = dot.getBoundingClientRect();
    return dotRect.top + dotRect.height / 2;
  }

  function measureGeometry() {
    var railRect = rail.getBoundingClientRect();
    var dotOffsets = items.map(function (item) {
      return getDotCenterY(item) - railRect.top;
    });

    return {
      railRect: railRect,
      dotOffsets: dotOffsets,
      firstDot: dotOffsets[0],
      lastDot: dotOffsets[lastIndex],
      span: dotOffsets[lastIndex] - dotOffsets[0],
    };
  }

  function getScrollAnchors() {
    var scrollY = getScrollY();
    var triggerY = getTriggerY();
    var railRect = rail.getBoundingClientRect();
    var lastDotY = getDotCenterY(items[lastIndex]);
    var maxScrollY = getMaxScrollY();

    var startScroll = scrollY + (railRect.top - triggerY);
    var idealEndScroll = scrollY + (lastDotY - triggerY);
    var endScroll = Math.min(idealEndScroll, maxScrollY);

    return {
      startScroll: startScroll,
      endScroll: endScroll,
    };
  }

  function getScrollProgress() {
    if (isInitialLoadPosition()) {
      return 0;
    }

    var scrollY = getScrollY();
    var anchors = getScrollAnchors();
    var startScroll = anchors.startScroll;
    var endScroll = anchors.endScroll;

    if (endScroll <= startScroll) {
      return scrollY > endScroll ? 1 : 0;
    }

    if (pageLoadScrollY > 5) {
      if (scrollY >= endScroll) {
        return 1;
      }
      if (scrollY <= startScroll) {
        return 0;
      }
      return clamp((scrollY - startScroll) / (endScroll - startScroll), 0, 1);
    }

    if (scrollY <= pageLoadScrollY) {
      return 0;
    }

    var travelStart = Math.max(startScroll, pageLoadScrollY);
    if (scrollY <= travelStart) {
      return 0;
    }
    if (scrollY >= endScroll) {
      return 1;
    }

    return clamp((scrollY - travelStart) / (endScroll - travelStart), 0, 1);
  }

  function getFillEndPx(geo, progress) {
    if (geo.span <= 0) {
      return geo.firstDot;
    }

    return geo.firstDot + progress * geo.span;
  }

  function isDotReached(fillEndPx, dotOffset) {
    return fillEndPx >= dotOffset - 0.5;
  }

  function applyInitialState(geo) {
    if (fill) {
      fill.style.height = Math.max(0, geo.firstDot) + "px";
    }

    items.forEach(function (item, index) {
      var isFirst = index === 0;
      item.classList.toggle("is-reached", isFirst);
      item.classList.toggle("is-active", isFirst);
    });
  }

  function applyReducedMotion() {
    var geo = measureGeometry();

    items.forEach(function (item, index) {
      item.classList.add("is-visible", "is-revealed");
      item.classList.toggle("is-reached", true);
      item.classList.toggle("is-active", index === lastIndex);
    });

    if (fill) {
      fill.style.height = geo.lastDot + "px";
    }
  }

  function updateTimeline() {
    var geo = measureGeometry();

    if (geo.railRect.height <= 0 || geo.lastDot <= geo.firstDot) {
      if (isInitialLoadPosition()) {
        applyInitialState(geo);
      }
      return;
    }

    if (isInitialLoadPosition()) {
      applyInitialState(geo);
      return;
    }

    var progress = clamp(getScrollProgress(), 0, 1);
    var fillEndPx = getFillEndPx(geo, progress);
    var activeIndex = -1;

    if (fill) {
      fill.style.height = Math.max(0, fillEndPx) + "px";
    }

    items.forEach(function (item, index) {
      var reached = isDotReached(fillEndPx, geo.dotOffsets[index]);

      if (reached) {
        activeIndex = index;
      }

      item.classList.toggle("is-reached", reached);
      item.classList.toggle("is-active", index === activeIndex);
    });
  }

  function scheduleUpdate() {
    window.requestAnimationFrame(updateTimeline);
  }

  function bindImageLoadUpdates() {
    document.querySelectorAll("img").forEach(function (img) {
      if (img.complete) {
        return;
      }

      img.addEventListener("load", scheduleUpdate, { once: true });
      img.addEventListener("error", scheduleUpdate, { once: true });
    });
  }

  function bindFontLoadUpdates() {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(scheduleUpdate);
    }
  }

  function bindCardRevealObserver() {
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible", "is-revealed");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed", "is-visible");
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -5% 0px",
        threshold: 0.05,
      }
    );

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  if (prefersReducedMotion) {
    applyReducedMotion();
    bindCardRevealObserver();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    window.addEventListener("load", scheduleUpdate);
    bindImageLoadUpdates();
    bindFontLoadUpdates();
    return;
  }

  bindCardRevealObserver();
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  window.addEventListener("load", scheduleUpdate);
  bindImageLoadUpdates();
  bindFontLoadUpdates();
  updateTimeline();
};

window.initHomeTimeline();
