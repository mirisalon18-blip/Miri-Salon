/**
 * “Miri” Salón — Script Principal
 * Estado de horario en tiempo real y animaciones de interfaz
 */

document.addEventListener("DOMContentLoaded", () => {
  // Inicializar iconos Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Actualizar año del footer
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ==========================================================================
  // 1. Menú móvil y barra de navegación pegajosa
  // ==========================================================================
  const navbar = document.getElementById("navbar");
  const mobileBtn = document.getElementById("mobile-menu-btn");
  const navLinks = document.getElementById("nav-links");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
      });
    });
  }

  // ==========================================================================
  // 1b. Cambio de tema (Blanco / Oscuro)
  // ==========================================================================
  const root = document.documentElement;

  const syncThemeUI = () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    const themeToggle = document.getElementById("theme-toggle");
    const themeText = document.getElementById("theme-toggle-text");

    if (themeText) {
      themeText.textContent = isDark ? "Claro" : "Oscuro";
    }
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Cambiar a tema blanco" : "Cambiar a tema oscuro"
      );
      themeToggle.setAttribute(
        "title",
        isDark ? "Cambiar a tema blanco" : "Cambiar a tema oscuro"
      );
    }
  };

  window.toggleMiriTheme = () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    if (isDark) {
      root.removeAttribute("data-theme");
      document.body.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", "dark");
      document.body.setAttribute("data-theme", "dark");
    }
    try {
      localStorage.setItem("miri-theme", isDark ? "light" : "dark");
    } catch (e) {}
    syncThemeUI();
  };

  syncThemeUI();

  // ==========================================================================
  // 2. Estado de Horario en Vivo (Lun–Sáb 9:00 a.m. – 5:00 p.m., Dom Cerrado)
  // ==========================================================================
  const updateOpenStatus = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    const hour = now.getHours() + now.getMinutes() / 60;

    const statusText = document.getElementById("open-status-text");
    const statusDot = document.querySelector(".status-dot");

    // Resaltar el día actual en la tabla de horarios
    const scheduleItems = document.querySelectorAll("#schedule-list li");
    scheduleItems.forEach((li) => {
      if (parseInt(li.getAttribute("data-day"), 10) === day) {
        li.classList.add("today-active");
      }
    });

    const isOpenDay = day >= 1 && day <= 6;
    const isOpenHour = hour >= 9 && hour < 17;

    if (statusText && statusDot) {
      if (isOpenDay && isOpenHour) {
        statusDot.classList.remove("closed");
        statusText.textContent = "Abierto ahora · Cierra a las 5:00 p.m.";
      } else if (day === 0) {
        statusDot.classList.add("closed");
        statusText.textContent = "Cerrado hoy domingo · Abrimos lunes 9:00 a.m.";
      } else if (hour < 9) {
        statusDot.classList.add("closed");
        statusText.textContent = "Abierto hoy de 9:00 a.m. a 5:00 p.m.";
      } else {
        statusDot.classList.add("closed");
        statusText.textContent =
          day === 6
            ? "Cerrado ahora · Abrimos el lunes a las 9:00 a.m."
            : "Cerrado ahora · Abrimos mañana a las 9:00 a.m.";
      }
    }
  };

  updateOpenStatus();

  // ==========================================================================
  // 3. Animación suave al hacer scroll (IntersectionObserver)
  // ==========================================================================
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("visible"));
  }
});
