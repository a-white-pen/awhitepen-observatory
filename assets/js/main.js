document.addEventListener("DOMContentLoaded", function () {
  var root = document.documentElement;
  var themeConfig = window.awhitepenTheme || {};
  var themeStorageKey = themeConfig.themeStorageKey || "awhitepen-theme";
  var labels = {
    expandMenu: themeConfig.expandLabel || "Open menu",
    collapseMenu: themeConfig.collapseLabel || "Close menu",
    codeMore: themeConfig.codeMoreLabel || "Continue",
    codeLess: themeConfig.codeLessLabel || "Less"
  };
  var themeToggle = document.querySelector("[data-theme-toggle]");
  var prefersDarkQuery = window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

  function getStoredTheme() {
    try {
      var value = window.localStorage.getItem(themeStorageKey);

      if (value === "light" || value === "dark") {
        return value;
      }
    } catch (error) {
      return null;
    }

    return null;
  }

  function hasStoredTheme() {
    return getStoredTheme() !== null;
  }

  function getSystemTheme() {
    return prefersDarkQuery && prefersDarkQuery.matches ? "dark" : "light";
  }

  function setStoredTheme(theme) {
    try {
      window.localStorage.setItem(themeStorageKey, theme);
    } catch (error) {
      // Ignore storage failures (private mode, blocked storage, etc).
    }
  }

  function setTheme(theme, persist) {
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme === "dark" ? "dark" : "light";
    updateThemeToggle(theme);

    if (persist) {
      setStoredTheme(theme);
    }
  }

  function updateThemeToggle(theme) {
    if (!themeToggle) {
      return;
    }

    var isDark = theme === "dark";
    var label = isDark
      ? themeConfig.lightModeLabel || "Enable light mode"
      : themeConfig.darkModeLabel || "Enable dark mode";
    var screenLabel = themeToggle.querySelector(".theme-toggle__screen-label");

    var moon = themeToggle.querySelector('[data-theme-icon="moon"]');
    var sun = themeToggle.querySelector('[data-theme-icon="sun"]');

    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", label);
    themeToggle.setAttribute("data-theme", theme);

    // SVG elements have no `hidden` IDL property, so set the attribute directly.
    if (moon && sun) {
      moon.toggleAttribute("hidden", isDark);
      sun.toggleAttribute("hidden", !isDark);
    }

    if (screenLabel) {
      screenLabel.textContent = label;
    }
  }

  setTheme(getStoredTheme() || root.getAttribute("data-theme") || getSystemTheme(), false);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      var nextTheme = current === "dark" ? "light" : "dark";

      setTheme(nextTheme, true);
    });
  }

  if (prefersDarkQuery) {
    var onSystemThemeChange = function () {
      if (!hasStoredTheme()) {
        setTheme(getSystemTheme(), false);
      }
    };

    if (prefersDarkQuery.addEventListener) {
      prefersDarkQuery.addEventListener("change", onSystemThemeChange);
    } else if (prefersDarkQuery.addListener) {
      prefersDarkQuery.addListener(onSystemThemeChange);
    }
  }

  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  var desktopQuery = window.matchMedia("(min-width: 861px)");

  function setMenuState(isOpen) {
    if (!navToggle || !nav) {
      return;
    }

    nav.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute(
      "aria-label",
      isOpen ? labels.collapseMenu : labels.expandMenu
    );
  }

  if (navToggle && nav) {
    navToggle.setAttribute("aria-label", labels.expandMenu);

    navToggle.addEventListener("click", function () {
      setMenuState(navToggle.getAttribute("aria-expanded") !== "true");
    });
  }

  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener("change", function (event) {
      if (event.matches) {
        setMenuState(false);
      }
    });
  }

  // Wide touch screens have no hover, so the first tap on Blog opens its sections
  // instead of following the link.
  var subMenuParent = document.querySelector(".nav .has-sub");

  if (subMenuParent) {
    var subMenuLink = subMenuParent.querySelector("a");
    var subMenuList = subMenuParent.querySelector(".sub-menu");
    var isTouch = window.matchMedia && window.matchMedia("(hover:none)").matches;

    if (subMenuLink) {
      subMenuLink.addEventListener(
        "click",
        function (event) {
          if (isTouch && window.innerWidth > 860 && !subMenuParent.classList.contains("open")) {
            event.preventDefault();
            event.stopImmediatePropagation();
            subMenuParent.classList.add("open");
          }
        },
        true
      );
    }

    if (subMenuList) {
      subMenuList.addEventListener("click", function () {
        subMenuParent.classList.remove("open");
      });
    }

    document.addEventListener("click", function (event) {
      if (!subMenuParent.contains(event.target)) {
        subMenuParent.classList.remove("open");
      }
    });
  }

  // Blog stream paging. WordPress renders the whole set (see AWHITEPEN_STREAM_POST_CAP)
  // and the pager shows PER cards at a time.
  var storyList = document.querySelector(".story-list");
  var blogPager = document.querySelector(".blog-pager");

  if (storyList && blogPager) {
    var PER = 5;
    var blogPage = 0;
    var storyCards = Array.prototype.slice.call(storyList.querySelectorAll(".story-card"));

    function renderBlogPage() {
      var pages = Math.max(1, Math.ceil(storyCards.length / PER));

      if (blogPage >= pages) {
        blogPage = pages - 1;
      }

      storyCards.forEach(function (card, index) {
        card.hidden = Math.floor(index / PER) !== blogPage;
      });

      blogPager.hidden = pages < 2;
      blogPager.querySelector('[data-pg="-1"]').disabled = blogPage === 0;
      blogPager.querySelector('[data-pg="1"]').disabled = blogPage >= pages - 1;
      blogPager.querySelector(".blog-pager__n").textContent = blogPage + 1 + " / " + pages;
    }

    blogPager.querySelectorAll("button[data-pg]").forEach(function (button) {
      button.addEventListener("click", function () {
        blogPage += Number(button.getAttribute("data-pg"));
        renderBlogPage();
        window.scrollTo({
          top: storyList.getBoundingClientRect().top + window.pageYOffset - 24
        });
      });
    });

    renderBlogPage();
  }
  /** Status dashboard tab switching and deep-link hashes. */
  var statusTabs = Array.prototype.slice.call(
    document.querySelectorAll(".tabs [data-tab]")
  );

  if (statusTabs.length) {
    var statusPanels = Array.prototype.slice.call(
      document.querySelectorAll("[data-panel]")
    );
    var defaultStatusTab = statusTabs[0].getAttribute("data-tab");

    function statusSlugFromHash() {
      return window.location.hash.replace(/^#/, "").toLowerCase();
    }

    function showStatusTab(slug, updateHash) {
      var known = statusTabs.some(function (tab) {
        return tab.getAttribute("data-tab") === slug;
      });
      var current = known ? slug : defaultStatusTab;

      statusTabs.forEach(function (tab) {
        var selected = tab.getAttribute("data-tab") === current;

        tab.classList.toggle("on", selected);
        tab.setAttribute("aria-selected", String(selected));
      });

      statusPanels.forEach(function (panel) {
        panel.hidden = panel.getAttribute("data-panel") !== current;
      });

      if (updateHash && window.location.hash !== "#" + current) {
        window.history.pushState(null, "", "#" + current);
      }
    }

    statusTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        showStatusTab(tab.getAttribute("data-tab"), true);
      });
    });

    window.addEventListener("hashchange", function () {
      showStatusTab(statusSlugFromHash(), false);
    });

    window.addEventListener("popstate", function () {
      showStatusTab(statusSlugFromHash(), false);
    });

    showStatusTab(statusSlugFromHash(), false);
  }
  /**
   * Code blocks.
   *
   * Each <pre> is wrapped in .cbw > .cbi so the right edge can carry a fade,
   * which hides once the block is scrolled to its end. Blocks over 20 lines
   * fold to 14 with a Continue / Less button.
   */
  var CODE_FOLD_OVER = 20;

  document.querySelectorAll(".entry pre").forEach(function (pre) {
    var wrap = document.createElement("div");
    var inner = document.createElement("div");

    wrap.className = "cbw";
    inner.className = "cbi";
    pre.parentNode.insertBefore(wrap, pre);
    inner.appendChild(pre);
    wrap.appendChild(inner);

    function updateFade() {
      wrap.classList.toggle(
        "at-end",
        pre.scrollLeft + pre.clientWidth >= pre.scrollWidth - 2
      );
    }

    pre.addEventListener("scroll", updateFade, { passive: true });

    // A post can be hidden when this runs, so re-measure once it has a size.
    if ("ResizeObserver" in window) {
      new ResizeObserver(updateFade).observe(pre);
    }

    updateFade();

    var lineCount = pre.textContent.replace(/\n$/, "").split("\n").length;

    if (lineCount <= CODE_FOLD_OVER) {
      return;
    }

    var more = document.createElement("div");
    var button = document.createElement("button");

    wrap.classList.add("is-capped");
    more.className = "cb-more";
    button.type = "button";
    button.textContent = labels.codeMore;
    button.setAttribute("aria-expanded", "false");
    more.appendChild(button);
    wrap.appendChild(more);

    button.addEventListener("click", function () {
      var capped = wrap.classList.toggle("is-capped");

      button.textContent = capped ? labels.codeMore : labels.codeLess;
      button.setAttribute("aria-expanded", String(!capped));
    });
  });
  /**
   * Post videos.
   *
   * They autoplay muted and looped with no controls, so they read as moving
   * pictures rather than a player. Controls appear while the pointer is over
   * one, or after the first tap on a touch screen, so the reader can scrub,
   * pause or unmute. A video that ships with `controls` is left alone.
   */
  var hoverlessQuery = window.matchMedia
    ? window.matchMedia("(hover: none)")
    : null;
  var isTouchScreen = hoverlessQuery ? hoverlessQuery.matches : false;

  document.querySelectorAll(".entry video").forEach(function (video) {
    if (video.hasAttribute("controls")) {
      return;
    }

    if (isTouchScreen) {
      video.addEventListener(
        "click",
        function () {
          video.controls = true;
        },
        { once: true }
      );

      return;
    }

    video.addEventListener("mouseenter", function () {
      video.controls = true;
    });

    video.addEventListener("mouseleave", function () {
      video.controls = false;
    });
  });
});
