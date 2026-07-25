(() => {
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress span');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const modal = document.querySelector('#media-modal');
  const modalStage = modal?.querySelector('.modal-stage');
  const modalCaption = modal?.querySelector('.modal-caption');
  const modalClose = modal?.querySelector('.modal-close');

  document.querySelector('#year').textContent = new Date().getFullYear();

  // Theme switcher
  const storedTheme = localStorage.getItem('portfolio-theme');
  if (storedTheme) root.dataset.theme = storedTheme;
  document.querySelectorAll('.theme-dot').forEach((dot) => {
    dot.classList.toggle('active', dot.dataset.themeValue === root.dataset.theme);
    dot.addEventListener('click', () => {
      root.dataset.theme = dot.dataset.themeValue;
      localStorage.setItem('portfolio-theme', dot.dataset.themeValue);
      document.querySelectorAll('.theme-dot').forEach((item) => item.classList.toggle('active', item === dot));
    });
  });

  // Header, progress and active section
  const sections = [...document.querySelectorAll('main section[id]')];
  const navAnchors = [...document.querySelectorAll('.nav-links a')];
  const onScroll = () => {
    const scrollTop = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('scrolled', scrollTop > 20);
    progress.style.width = `${max > 0 ? (scrollTop / max) * 100 : 0}%`;

    let current = 'home';
    sections.forEach((section) => {
      if (scrollTop >= section.offsetTop - window.innerHeight * .34) current = section.id;
    });
    navAnchors.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile navigation
  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    navLinks.classList.toggle('open', !open);
  });
  navAnchors.forEach((link) => link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    navLinks?.classList.remove('open');
  }));

  // Scroll reveal
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -7% 0px' });
  document.querySelectorAll('.reveal,.reveal-text,.reveal-scale').forEach((element) => revealObserver.observe(element));

  // Rotating hero words
  const rotatingWord = document.querySelector('.rotating-word');
  if (rotatingWord) {
    const words = JSON.parse(rotatingWord.dataset.words || '[]');
    let index = 0;
    window.setInterval(() => {
      index = (index + 1) % words.length;
      rotatingWord.classList.remove('swap');
      void rotatingWord.offsetWidth;
      rotatingWord.textContent = words[index];
      rotatingWord.classList.add('swap');
    }, 2300);
  }

  // Cursor glow and magnetic buttons on pointer devices
  const glow = document.querySelector('.cursor-glow');
  if (window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', (event) => {
      glow.style.opacity = '1';
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    });
    document.querySelectorAll('.magnetic').forEach((item) => {
      item.addEventListener('pointermove', (event) => {
        const rect = item.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        item.style.transform = `translate(${x * .08}px, ${y * .08}px)`;
      });
      item.addEventListener('pointerleave', () => item.style.transform = '');
    });
  }

  // Play reel previews only when visible
  const reelVideos = document.querySelectorAll('.reel-card video');
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
  }, { threshold: .45 });
  reelVideos.forEach((video) => videoObserver.observe(video));

  // Reel filtering
  const filterButtons = document.querySelectorAll('.filter');
  const reelCards = document.querySelectorAll('.reel-card');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      reelCards.forEach((card) => {
        const visible = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !visible);
      });
    });
  });

  // Modal helpers
  const closeModal = () => {
    if (!modal?.open) return;
    modal.close();
    modalStage.innerHTML = '';
    modalCaption.textContent = '';
    body.classList.remove('modal-open');
  };
  const openModal = ({ type, src, caption }) => {
    if (!modal || !modalStage) return;
    modalStage.innerHTML = '';
    const media = document.createElement(type === 'video' ? 'video' : 'img');
    media.src = src;
    if (type === 'video') {
      media.controls = true;
      media.autoplay = true;
      media.loop = true;
      media.playsInline = true;
    } else {
      media.alt = caption || 'Portfolio graphic';
    }
    modalStage.appendChild(media);
    modalCaption.textContent = caption || '';
    modal.showModal();
    body.classList.add('modal-open');
  };

  document.querySelectorAll('.reel-card').forEach((card) => {
    card.querySelector('.reel-media').addEventListener('click', () => openModal({
      type: 'video', src: card.dataset.video, caption: card.dataset.title
    }));
  });
  document.querySelectorAll('.graphic-card').forEach((card) => {
    card.addEventListener('click', () => openModal({
      type: 'image', src: card.dataset.image, caption: card.dataset.caption
    }));
  });
  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });

  // Stats counters
  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const number = entry.target;
      const target = Number(number.dataset.count || 0);
      const suffix = number.dataset.suffix || '';
      const duration = 1200;
      const start = performance.now();
      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        number.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      observer.unobserve(number);
    });
  }, { threshold: .7 });
  document.querySelectorAll('[data-count]').forEach((number) => countObserver.observe(number));

  // Slight parallax for portrait and hero background
  const portrait = document.querySelector('.portrait-wrap');
  const heroVideo = document.querySelector('.hero-video');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (portrait && y < window.innerHeight * 1.2) portrait.style.translate = `0 ${y * .035}px`;
    if (heroVideo && y < window.innerHeight * 1.2) heroVideo.style.transform = `scale(1.05) translateY(${y * .02}px)`;
  }, { passive: true });
})();

//video
const videoShell = document.querySelector(".video-shell");
const featuredVideo = document.querySelector(".featured-video");

const playButton = document.querySelector(".video-play-button");
const muteButton = document.querySelector(".video-mute-button");
const fullscreenButton = document.querySelector(
  ".video-fullscreen-button"
);

const progressSlider = document.querySelector(".video-progress");
const currentTimeText = document.querySelector(".video-current-time");
const durationText = document.querySelector(".video-duration");

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

function updatePlayButton() {
  if (featuredVideo.paused) {
    playButton.textContent = "▶";
    playButton.setAttribute("aria-label", "Play video");
  } else {
    playButton.textContent = "❚❚";
    playButton.setAttribute("aria-label", "Pause video");
  }
}

function updateMuteButton() {
  if (featuredVideo.muted) {
    muteButton.textContent = "🔇";
    muteButton.setAttribute("aria-label", "Unmute video");
  } else {
    muteButton.textContent = "🔊";
    muteButton.setAttribute("aria-label", "Mute video");
  }
}

playButton?.addEventListener("click", () => {
  if (featuredVideo.paused) {
    featuredVideo.play().catch(() => {});
  } else {
    featuredVideo.pause();
  }
});

featuredVideo?.addEventListener("click", () => {
  if (featuredVideo.paused) {
    featuredVideo.play().catch(() => {});
  } else {
    featuredVideo.pause();
  }
});

muteButton?.addEventListener("click", () => {
  featuredVideo.muted = !featuredVideo.muted;
  updateMuteButton();
});

featuredVideo?.addEventListener("loadedmetadata", () => {
  durationText.textContent = formatTime(featuredVideo.duration);
});

featuredVideo?.addEventListener("timeupdate", () => {
  if (!featuredVideo.duration) {
    return;
  }

  const progress =
    (featuredVideo.currentTime / featuredVideo.duration) * 100;

  progressSlider.value = progress;
  currentTimeText.textContent = formatTime(featuredVideo.currentTime);
});

progressSlider?.addEventListener("input", () => {
  if (!featuredVideo.duration) {
    return;
  }

  featuredVideo.currentTime =
    (progressSlider.value / 100) * featuredVideo.duration;
});

featuredVideo?.addEventListener("play", updatePlayButton);
featuredVideo?.addEventListener("pause", updatePlayButton);

fullscreenButton?.addEventListener("click", async () => {
  try {
    if (!document.fullscreenElement) {
      await videoShell.requestFullscreen();
      fullscreenButton.setAttribute("aria-label", "Exit fullscreen");
    } else {
      await document.exitFullscreen();
      fullscreenButton.setAttribute("aria-label", "Enter fullscreen");
    }
  } catch (error) {
    console.log("Fullscreen is not available.");
  }
});

document.addEventListener("fullscreenchange", () => {
  fullscreenButton.textContent = document.fullscreenElement ? "✕" : "⛶";
});

const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        featuredVideo.play().catch(() => {});
      } else {
        featuredVideo.pause();
      }
    });
  },
  {
    threshold: [0, 0.5, 1]
  }
);

if (featuredVideo) {
  videoObserver.observe(featuredVideo);
}

let controlsTimeout;

function showControlsTemporarily() {
  videoShell.classList.add("controls-visible");

  clearTimeout(controlsTimeout);

  controlsTimeout = setTimeout(() => {
    if (!featuredVideo.paused) {
      videoShell.classList.remove("controls-visible");
    }
  }, 2500);
}

videoShell?.addEventListener("mousemove", showControlsTemporarily);
videoShell?.addEventListener("touchstart", showControlsTemporarily);

updatePlayButton();
updateMuteButton();
