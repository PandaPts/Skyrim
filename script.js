document.addEventListener("DOMContentLoaded", () => {
  // --- Эффект прокрутки заголовка ---
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // --- Переключение мобильного меню ---
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active");
      nav.classList.toggle("active");
      document.body.style.overflow = nav.classList.contains("active")
        ? "hidden"
        : "";
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("active");
        nav.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
  }

  // --- Появление при прокрутке ---
  const revealElements = document.querySelectorAll(
    "section, .stat-item, .shout-card, .gallery-item",
  );
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  revealElements.forEach((el) => {
    el.classList.add("reveal");
    revealObserver.observe(el);
  });

  // --- 1. Интерактивность Криков ---
  const shoutCards = document.querySelectorAll(".shout-card");

  if (shoutCards.length > 0) {
    shoutCards.forEach((card) => {
      card.addEventListener("click", () => {
        const words = card.getAttribute("data-shout");
        const translation = card.querySelector(".shout-name-label").textContent;

        // Визуальный отклик на карточке
        card.style.transform = "scale(0.95) translateY(5px)";
        setTimeout(() => (card.style.transform = ""), 150);

        // Тряска экрана
        document.body.classList.add("shake");
        setTimeout(() => document.body.classList.remove("shake"), 500);

        // Кинематографическое наложение
        const overlay = document.createElement("div");
        overlay.className = "shout-active-overlay";
        overlay.innerHTML = `
          <div class="shout-words-large">${words}</div>
          <div class="shout-translation-large">${translation}</div>
        `;
        document.body.appendChild(overlay);

        // Запуск анимации
        requestAnimationFrame(() => {
          overlay.classList.add("active");
        });

        // Очистка
        setTimeout(() => {
          overlay.classList.remove("active");
          setTimeout(() => overlay.remove(), 1000);
        }, 2000);
      });
    });
  }

  // --- 2. Калькулятор урона ---
  const baseDmgInput = document.getElementById("base-dmg");
  const skillInput = document.getElementById("skill-level");
  const perksInput = document.getElementById("perks");
  const calcBtn = document.getElementById("calc-btn");
  const dmgDisplay = document.getElementById("dmg-value");
  const historyDisplay = document.getElementById("history-val");

  if (calcBtn) {
    const savedDmg = localStorage.getItem("last_skyrim_dmg");
    if (savedDmg && historyDisplay) historyDisplay.textContent = savedDmg;

    calcBtn.addEventListener("click", () => {
      const calcContainer = document.getElementById("calc-container");
      if (calcContainer) {
        calcContainer.classList.add("calculating");
        setTimeout(() => calcContainer.classList.remove("calculating"), 600);
      }

      const base = parseFloat(baseDmgInput.value) || 0;
      const skill = parseFloat(skillInput.value) || 0;
      const perks = parseFloat(perksInput.value) || 1;

      // Специальный эффект для Пасхалки
      if (base === 67) {
        document.body.classList.add("shake");
        setTimeout(() => document.body.classList.remove("shake"), 1000);
      }

      const totalDmg = Math.round(base * (1 + skill / 200) * perks);

      setTimeout(() => {
        if (dmgDisplay) {
          dmgDisplay.textContent = totalDmg;
          dmgDisplay.classList.add("animate-pulse-gold");
          setTimeout(
            () => dmgDisplay.classList.remove("animate-pulse-gold"),
            1000,
          );
        }
        
        // Сохраняем расширенные данные
        const calculationData = {
          result: totalDmg,
          parameters: { baseDamage: base, skillLevel: skill, perkMultiplier: perks },
          timestamp: Date.now(),
        };

        localStorage.setItem("last_calculation", JSON.stringify(calculationData));
        localStorage.setItem("last_skyrim_dmg", totalDmg);

        let history = JSON.parse(localStorage.getItem("calc_history") || "[]");
        history.unshift(calculationData);
        if (history.length > 5) history.pop();
        localStorage.setItem("calc_history", JSON.stringify(history));

        if (historyDisplay) historyDisplay.textContent = totalDmg;

        // Сразу проверяем, нужно ли показать кнопку очистки данных
        addClearDataButton();
      }, 400);
    });
  }

  // --- 3. Галерея / Лайтбокс ---
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const lightboxImg = lightbox.querySelector("img");
    const lightboxCaption = lightbox.querySelector(".lightbox-caption");
    const galleryItems = document.querySelectorAll(".gallery-item");

    const closeLightbox = () => {
      lightbox.classList.remove("active");
      setTimeout(() => {
        if (lightboxImg) lightboxImg.src = "";
      }, 300);
    };

    galleryItems.forEach((item) => {
      item.addEventListener("click", () => {
        const img = item.querySelector("img");
        const title = item.querySelector("h3").textContent;
        const desc = item.querySelector("p").textContent;

        if (lightboxImg) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
        }
        if (lightboxCaption) {
          lightboxCaption.querySelector("h3").textContent = title;
          lightboxCaption.querySelector("p").textContent = desc;
        }

        lightbox.classList.add("active");
      });
    });

    lightbox.addEventListener("click", (e) => {
      if (
        e.target === lightbox ||
        e.target.classList.contains("lightbox-close") ||
        e.target.classList.contains("lightbox-content")
      ) {
        closeLightbox();
      }
    });

    const closeBtn = lightbox.querySelector(".lightbox-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", closeLightbox);
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("active"))
        closeLightbox();
    });
  }

  // --- 4. Анимация статистики ---
  const statNumbers = document.querySelectorAll(".stat-number");
  if (statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const endValue = parseInt(target.textContent);
            if (isNaN(endValue)) return;

            let startValue = 0;
            const duration = 2500;
            const startTime = performance.now();

            function updateNumber(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const currentValue = Math.floor(progress * endValue);
              target.textContent =
                currentValue + (target.textContent.includes("+") ? "+" : "");
              if (progress < 1) requestAnimationFrame(updateNumber);
            }
            requestAnimationFrame(updateNumber);
            statsObserver.unobserve(target);
          }
        });
      },
      { threshold: 0.5 },
    );

    statNumbers.forEach((num) => statsObserver.observe(num));
  }

  // --- 5. Логика контактной формы ---
  const sealed = document.getElementById("scrollSealed");
  const opened = document.getElementById("scrollOpened");

  if (sealed && opened) {
    sealed.addEventListener("click", () => {
      sealed.classList.add("breaking");
      setTimeout(() => {
        sealed.style.display = "none";
        opened.style.display = "block";
        opened.getBoundingClientRect(); // Принудительная перерисовка
        opened.classList.add("is-open");
      }, 700);
    });
  }

  const tags = document.querySelectorAll(".subject-tag");
  const subjectInput = document.getElementById("subject");
  if (tags.length > 0 && subjectInput) {
    tags.forEach((tag) => {
      tag.addEventListener("click", () => {
        tags.forEach((t) => t.classList.remove("selected"));
        tag.classList.add("selected");
        subjectInput.value = tag.dataset.value;
      });
    });
  }

  const msgArea = document.getElementById("message");
  const counter = document.getElementById("charCounter");
  const MAX_CHARS = 500;

  if (msgArea && counter) {
    msgArea.addEventListener("input", () => {
      const len = msgArea.value.length;
      counter.textContent = `${len} / ${MAX_CHARS}`;
      counter.classList.toggle("warning", len > MAX_CHARS * 0.9);
      if (len > MAX_CHARS) msgArea.value = msgArea.value.slice(0, MAX_CHARS);
    });
  }

  const contactForm = document.getElementById("contact-form");
  const successMsg = document.getElementById("contact-success");

  if (contactForm && successMsg) {
    const validateField = (fieldId, errorId, groupId, condition) => {
      const err = document.getElementById(errorId);
      const group = document.getElementById(groupId);
      if (!err || !group) return false;

      if (!condition) {
        err.classList.add("visible");
        group.classList.add("has-error");
        return false;
      }
      err.classList.remove("visible");
      group.classList.remove("has-error");
      return true;
    };

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("name");
      const nameVal = nameInput ? nameInput.value.trim() : "";
      const msgVal = msgArea ? msgArea.value.trim() : "";

      const validName = validateField(
        "name",
        "err-name",
        "group-name",
        nameVal.length >= 2,
      );
      const validMsg = validateField(
        "message",
        "err-message",
        "group-message",
        msgVal.length >= 10,
      );

      if (!validName || !validMsg) return;

      // Отправка данных на FormSubmit
      fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      const btn = document.getElementById("submitBtn");
      if (btn) {
        const rect = btn.getBoundingClientRect();
        const emojis = ["📜", "⚔️", "🔥", "💨", "🐉", "✉️"];

        for (let i = 0; i < 10; i++) {
          const p = document.createElement("div");
          p.className = "particle";
          p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
          const angle = (Math.random() * 360 * Math.PI) / 180;
          const dist = 80 + Math.random() * 140;
          p.style.cssText = `
            left: ${rect.left + rect.width / 2}px;
            top:  ${rect.top + rect.height / 2}px;
            --tx: ${Math.cos(angle) * dist}px;
            --ty: ${Math.sin(angle) * dist - 60}px;
          `;
          document.body.appendChild(p);
          setTimeout(() => p.remove(), 1000);
        }
      }

      contactForm.style.transition = "all 0.8s cubic-bezier(0.22,1,0.36,1)";
      contactForm.style.opacity = "0";
      contactForm.style.transform = "translateY(-30px)";

      setTimeout(() => {
        contactForm.style.display = "none";
        successMsg.style.display = "block";
        successMsg.style.opacity = "0";
        successMsg.style.transform = "translateY(30px)";

        requestAnimationFrame(() => {
          successMsg.style.transition = "all 1s cubic-bezier(0.22,1,0.36,1)";
          successMsg.style.opacity = "1";
          successMsg.style.transform = "translateY(0)";
        });
      }, 800);
    });
  }

  const retryBtn = document.getElementById("retryBtn");
  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      location.reload();
    });
  }

  // --- 6. Фильтры Галереи ---
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  if (filterBtns.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Активный класс
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filterValue = btn.getAttribute("data-filter");

        galleryItems.forEach((item) => {
          const category = item.getAttribute("data-category");

          if (filterValue === "all" || filterValue === category) {
            item.style.display = "block";
            // Небольшая анимация появления
            item.style.opacity = "0";
            item.style.transform = "scale(0.9)";
            setTimeout(() => {
              item.style.opacity = "1";
              item.style.transform = "scale(1)";
            }, 50);
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  }

  // --- 7. Эффект Снега (Только на десктопе для производительности) ---
  if (window.innerWidth > 768) {
    const snowContainer = document.createElement("div");
    snowContainer.className = "snow-container";
    document.body.appendChild(snowContainer);

    const createSnowflake = () => {
      const snowflake = document.createElement("div");
      snowflake.className = "snowflake";

      // Случайный размер
      const size = Math.random() * 3 + 1 + "px";
      snowflake.style.width = size;
      snowflake.style.height = size;

      // Случайная позиция по горизонтали
      snowflake.style.left = Math.random() * 100 + "vw";

      // Случайная длительность падения
      const duration = Math.random() * 5 + 5 + "s";
      snowflake.style.animationDuration = duration;

      // Случайная прозрачность
      snowflake.style.opacity = Math.random() * 0.5 + 0.3;

      snowContainer.appendChild(snowflake);

      // Удаляем после завершения анимации
      setTimeout(() => {
        snowflake.remove();
      }, parseFloat(duration) * 1000);
    };

    // Создаем снежинку каждые 200мс
    setInterval(createSnowflake, 200);
  }
   // Вызываем функции инициализации, чтобы кнопки появились на странице
    initTheme();
    loadCalculationHistory();
    addClearDataButton();
});

// --- 6. Дополнительные функции localStorage ---

// Сохранение темы (тёмная/светлая)
const initTheme = () => {
  const savedTheme = localStorage.getItem("skyrim_theme");
  const isLight = savedTheme === "light";
  
  if (isLight) {
    document.body.classList.add("light-theme");
  }

  // Создаем кнопку переключения
  const btn = document.createElement("button");
  btn.className = "theme-toggle";
  btn.innerHTML = isLight ? "☀️ <span>Day</span>" : "🌙 <span>Night</span>";
  btn.title = "Toggle Light/Dark Theme";
  document.body.appendChild(btn);

  btn.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    const currentIsLight = document.body.classList.contains("light-theme");
    
    // Обновляем иконку
    btn.innerHTML = currentIsLight ? "☀️ <span>Day</span>" : "🌙 <span>Night</span>";
    
    // Сохраняем настройку
    localStorage.setItem("skyrim_theme", currentIsLight ? "light" : "dark");
  });
};

// Сохранение последнего просмотренного изображения в галерее
const saveLastGalleryImage = (imageSrc, title, desc) => {
  const lastImage = {
    src: imageSrc,
    title: title,
    description: desc,
    timestamp: Date.now(),
  };
  localStorage.setItem("last_gallery_image", JSON.stringify(lastImage));
};

// Загрузка последнего просмотренного изображения
const loadLastGalleryImage = () => {
  const saved = localStorage.getItem("last_gallery_image");
  if (saved) {
    try {
      const lastImage = JSON.parse(saved);
      console.log("Последнее просмотренное изображение:", lastImage.title);
    } catch (e) {
      console.error("Ошибка загрузки сохранённого изображения");
    }
  }
};

// Сохранение предпочтений пользователя (вызывается при изменении настроек)
const saveUserPreferences = () => {
  const preferences = {
    damageMultiplier: document.getElementById("perks")?.value || "1.0",
    lastVisit: new Date().toISOString(),
    visitedPages: JSON.parse(localStorage.getItem("visited_pages") || "[]"),
  };

  // Обновляем посещённые страницы
  const currentPage = window.location.pathname;
  if (!preferences.visitedPages.includes(currentPage)) {
    preferences.visitedPages.push(currentPage);
    localStorage.setItem(
      "visited_pages",
      JSON.stringify(preferences.visitedPages),
    );
  }

  localStorage.setItem("skyrim_preferences", JSON.stringify(preferences));
};

// Функция создания кнопки очистки данных
const addClearDataButton = () => {
  // Проверяем, есть ли хоть какие-то данные в localStorage
  if (localStorage.length === 0) return;

  if (!document.getElementById("clear-data-btn")) {
    const clearBtn = document.createElement("button");
    clearBtn.id = "clear-data-btn";
    clearBtn.textContent = "🧹 Clear Data";
    
    // Стилизация для фиксации справа снизу (как переключатель темы)
    clearBtn.style.position = "fixed";
    clearBtn.style.bottom = "20px";
    clearBtn.style.right = "20px";
    clearBtn.style.zIndex = "9999";
    
    // Внешний вид в стиле Skyrim UI
    clearBtn.style.background = "var(--bg-panel)";
    clearBtn.style.border = "var(--border-gold)";
    clearBtn.style.color = "var(--gold)";
    clearBtn.style.padding = "12px 20px";
    clearBtn.style.borderRadius = "30px";
    clearBtn.style.fontFamily = "var(--font-display)";
    clearBtn.style.fontSize = "0.7rem";
    clearBtn.style.textTransform = "uppercase";
    clearBtn.style.letterSpacing = "0.1em";
    clearBtn.style.cursor = "pointer";
    clearBtn.style.backdropFilter = "blur(10px)";
    clearBtn.style.transition = "var(--transition)";
    clearBtn.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.3)";

    // Добавляем эффекты при наведении через JS
    clearBtn.onmouseenter = () => {
      clearBtn.style.transform = "scale(1.1)";
      clearBtn.style.background = "var(--gold)";
      clearBtn.style.color = "var(--bg-dark)";
      clearBtn.style.boxShadow = "0 0 20px var(--gold-glow)";
    };
    clearBtn.onmouseleave = () => {
      clearBtn.style.transform = "scale(1)";
      clearBtn.style.background = "var(--bg-panel)";
      clearBtn.style.color = "var(--gold)";
      clearBtn.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.3)";
    };

    clearBtn.onclick = clearAllData;
    document.body.appendChild(clearBtn);
  }
};

// Очистка всех данных
const clearAllData = () => {
  if (confirm("Очистить все сохранённые данные?")) {
    localStorage.clear();
    location.reload();
  }
};

// Загрузка истории при загрузке страницы
const loadCalculationHistory = () => {
  const historyDisplay = document.getElementById("history-val");
  const baseDmgInput = document.getElementById("base-dmg");
  const skillInput = document.getElementById("skill-level");
  const perksInput = document.getElementById("perks");

  const history = JSON.parse(localStorage.getItem("calc_history") || "[]");
  
  if (history.length > 0) {
    const lastCalc = history[0];
    
    // Подставляем текст в историю
    if (historyDisplay) historyDisplay.textContent = `${lastCalc.result} (${new Date(lastCalc.timestamp).toLocaleTimeString()})`;
    
    // Подставляем значения обратно в инпуты
    if (baseDmgInput && lastCalc.parameters) baseDmgInput.value = lastCalc.parameters.baseDamage || "";
    if (skillInput && lastCalc.parameters) skillInput.value = lastCalc.parameters.skillLevel || "";
    if (perksInput && lastCalc.parameters) perksInput.value = lastCalc.parameters.perkMultiplier || "1";
  }
};
