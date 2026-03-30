document.addEventListener("DOMContentLoaded", function () {
  var root = document.documentElement;
  var themeConfig = window.awhitepenTheme || {};
  var themeStorageKey = themeConfig.themeStorageKey || "awhitepen-theme";
  var labels = {
    expandMenu: themeConfig.expandLabel || "Open menu",
    collapseMenu: themeConfig.collapseLabel || "Close menu",
    openSubmenu: themeConfig.openSubmenuLabel || "Open submenu",
    closeSubmenu: themeConfig.closeSubmenuLabel || "Close submenu"
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

    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", label);
    themeToggle.setAttribute("data-theme", theme);

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

  var menuToggle = document.querySelector(".menu-toggle");
  var navigationWrap = document.querySelector(".site-navigation-wrap");
  var desktopQuery = window.matchMedia("(min-width: 861px)");

  function setMenuState(isOpen) {
    if (!menuToggle || !navigationWrap) {
      return;
    }

    navigationWrap.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? labels.collapseMenu : labels.expandMenu
    );
  }

  function resetSubmenus() {
    var menuItems = document.querySelectorAll(
      ".site-navigation .menu-item-has-children"
    );

    menuItems.forEach(function (item) {
      var button = item.querySelector(":scope > .submenu-toggle");

      item.classList.remove("is-open");

      if (button) {
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", labels.openSubmenu);

        var icon = button.querySelector("[data-icon]");
        var label = button.querySelector(".screen-reader-text");

        if (icon) {
          icon.textContent = "+";
        }

        if (label) {
          label.textContent = labels.openSubmenu;
        }
      }
    });
  }

  if (menuToggle && navigationWrap) {
    menuToggle.setAttribute("aria-label", labels.expandMenu);

    menuToggle.addEventListener("click", function () {
      var isOpen = menuToggle.getAttribute("aria-expanded") === "true";

      setMenuState(!isOpen);

      if (isOpen) {
        resetSubmenus();
      }
    });
  }

  var submenuParents = document.querySelectorAll(
    ".site-navigation .menu-item-has-children"
  );

  submenuParents.forEach(function (item, index) {
    var link = item.querySelector(":scope > a");
    var submenu = item.querySelector(":scope > .sub-menu");

    if (!link || !submenu) {
      return;
    }

    submenu.id = submenu.id || "submenu-" + index;

    var button = document.createElement("button");
    button.type = "button";
    button.className = "submenu-toggle";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", submenu.id);
    button.setAttribute("aria-label", labels.openSubmenu);
    button.innerHTML =
      '<span data-icon aria-hidden="true">+</span><span class="screen-reader-text">' +
      labels.openSubmenu +
      "</span>";

    item.insertBefore(button, submenu);

    button.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      var nextState = !isOpen;
      var icon = button.querySelector("[data-icon]");
      var label = button.querySelector(".screen-reader-text");

      item.classList.toggle("is-open", nextState);
      button.setAttribute("aria-expanded", String(nextState));
      button.setAttribute(
        "aria-label",
        nextState
          ? labels.closeSubmenu
          : labels.openSubmenu
      );

      if (icon) {
        icon.textContent = nextState ? "−" : "+";
      }

      if (label) {
        label.textContent = nextState
          ? labels.closeSubmenu
          : labels.openSubmenu;
      }
    });
  });

  function handleViewportChange(event) {
    if (!event.matches) {
      return;
    }

    setMenuState(false);
    resetSubmenus();
  }

  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener("change", handleViewportChange);
  } else if (desktopQuery.addListener) {
    desktopQuery.addListener(handleViewportChange);
  }
});
