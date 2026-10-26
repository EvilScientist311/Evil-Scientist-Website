/*
 * Greedy Navigation
 *
 * http://codepen.io/lukejacksonn/pen/PwmwWV
 *
 */

var $nav = $("#site-nav");
var $btn = $("#site-nav .greedy-nav__toggle");
var $vlinks = $("#site-nav .visible-links");
var $vlinks_persist_tail = $vlinks.children("*.persist.tail");
var $hlinks = $("#site-nav .hidden-links");

var breaks = [];
var MOBILE_BREAKPOINT = 924;

function isMobileNav() {
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

function updateMastheadPadding() {
  var mastheadHeight = $(".masthead").outerHeight();

  if ($(".author__urls-wrapper button").is(":visible")) {
    $(".sidebar").css("padding-top", "");
  } else {
    $(".sidebar").css("padding-top", mastheadHeight + "px");
  }
}

function closeHiddenLinks() {
  $hlinks.addClass("hidden").removeClass("is-open");
  $btn.removeClass("close");
  $btn.attr("aria-expanded", "false");
  $("body").removeClass("mobile-nav-open");
}

function openHiddenLinks() {
  $hlinks.removeClass("hidden").addClass("is-open");
  $btn.addClass("close");
  $btn.attr("aria-expanded", "true");

  if (isMobileNav()) {
    $("body").addClass("mobile-nav-open");
  }
}

function restoreAllLinksToVisible() {
  var $cluster = $hlinks.children("li.masthead__nav-cluster");
  if ($cluster.length) {
    $cluster.appendTo($vlinks);
  }

  while ($hlinks.children().length > 0) {
    $hlinks.children().first().appendTo($vlinks);
  }

  breaks = [];
  closeHiddenLinks();
}

function collapseAllLinksForMobile() {
  var $cluster = $vlinks.children("li.masthead__nav-cluster");
  if ($cluster.length && !$cluster.parent().is($hlinks)) {
    $cluster.prependTo($hlinks);
  }

  breaks = [];
  $btn.removeClass("hidden");
}

function updateNav() {
  updateMastheadPadding();

  if (isMobileNav()) {
    collapseAllLinksForMobile();
    return;
  }

  restoreAllLinksToVisible();
  $btn.addClass("hidden");
  closeHiddenLinks();
  breaks = [];
  $btn.attr("count", 0);
}

$btn.attr({
  type: "button",
  "aria-label": "Menu",
  "aria-expanded": "false",
  "aria-controls": "site-nav-menu",
});

$hlinks.attr("id", "site-nav-menu");

$btn.on("click", function (event) {
  event.stopPropagation();

  if ($hlinks.hasClass("hidden") || !$hlinks.hasClass("is-open")) {
    openHiddenLinks();
  } else {
    closeHiddenLinks();
  }
});

$(document).on("click.mobileNav", function (event) {
  if (
    isMobileNav() &&
    $hlinks.hasClass("is-open") &&
    !$(event.target).closest("#site-nav").length
  ) {
    closeHiddenLinks();
  }
});

$(document).on("keydown.mobileNav", function (event) {
  if (event.key === "Escape") {
    closeHiddenLinks();
  }
});

$hlinks.on("click", "a", function () {
  if (isMobileNav()) {
    closeHiddenLinks();
  }
});

$(window).on("resize", function () {
  if (!isMobileNav()) {
    $("body").removeClass("mobile-nav-open");
  }
  updateNav();
});

if (screen.orientation) {
  screen.orientation.addEventListener("change", function () {
    updateNav();
  });
}

updateNav();
