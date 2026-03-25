const config = {
  fullName: "Muh. Fhazriel Hidayatullah",
  message: "Semoga rezeki nya lancar terus dan sehat selalu.",
  photoSources: [
    "assets/images/baim.jpg.jpeg",
    "assets/images/baim2.jpg.jpeg",
    "assets/images/baim3.jpg.jpeg",
    "assets/images/baim4.jpg.jpeg",
    "assets/images/baim5.jpg.jpeg",
    "assets/images/baim6.jpg.jpeg",
    "assets/images/baim7.jpg.jpeg",
    "assets/images/baim8.jpg.jpeg",
    "assets/images/baim9.jpg.jpeg",
    "assets/images/baim10.jpg.jpeg",
    "assets/images/baim11.jpg.jpeg",
  ],
};

const introScreen = document.querySelector("#intro-screen");
const photoScreen = document.querySelector("#photo-screen");
const messageScreen = document.querySelector("#message-screen");
const openButton = document.querySelector("#open-button");
const laterButton = document.querySelector("#later-button");
const galleryPhoto = document.querySelector("#gallery-photo");
const galleryPlaceholder = document.querySelector("#gallery-placeholder");
const galleryCount = document.querySelector("#gallery-count");
const messagePhoto = document.querySelector("#message-photo");
const messageCopy = document.querySelector("#message-copy");
const messageText = document.querySelector("#message-text");
const birthdayAudio = document.querySelector("#birthday-audio");
const toast = document.querySelector("#toast");
const confettiLayer = document.querySelector("#confetti-layer");
const photoFrame = document.querySelector("#photo-frame");
const starsLayer = document.querySelector("#stars-layer");

let photoIndex = 0;
let toastTimer;
let touchStartX = 0;
let touchCurrentX = 0;
let isSwiping = false;
let autoMessageTimer;
let audioUnlocked = false;
let openTriggered = false;
let pendingMusicStart = false;

document.title = `Selamat Ulang Tahun 18, ${config.fullName}`;
if (messageText) {
  messageText.textContent = config.message;
}
if (birthdayAudio) {
  birthdayAudio.load();
}

function showToast(message) {
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function launchConfetti(total = 24) {
  if (!confettiLayer) {
    return;
  }

  const colors = ["#d9654f", "#efb64f", "#5f8b67", "#f29d7e", "#a84338"];

  for (let index = 0; index < total; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[index % colors.length];
    piece.style.setProperty("--drift", `${Math.random() * 240 - 120}px`);
    piece.style.animationDelay = `${Math.random() * 120}ms`;
    confettiLayer.appendChild(piece);

    window.setTimeout(() => {
      piece.remove();
    }, 1700);
  }
}

function launchFireworks(total = 3) {
  if (!confettiLayer) {
    return;
  }

  const colors = ["#ffd36a", "#ff8a65", "#fff0c7", "#f29d7e", "#ffe29a"];

  for (let burstIndex = 0; burstIndex < total; burstIndex += 1) {
    const firework = document.createElement("div");
    firework.className = "firework-burst";
    firework.style.left = `${18 + Math.random() * 64}%`;
    firework.style.top = `${12 + Math.random() * 44}%`;
    firework.style.animationDelay = `${burstIndex * 180}ms`;

    for (let sparkIndex = 0; sparkIndex < 12; sparkIndex += 1) {
      const spark = document.createElement("span");
      spark.className = "firework-spark";
      spark.style.background = colors[(burstIndex + sparkIndex) % colors.length];
      spark.style.setProperty("--spark-angle", `${sparkIndex * 30}deg`);
      spark.style.setProperty("--spark-distance", `${42 + Math.random() * 26}px`);
      spark.style.animationDelay = `${burstIndex * 180}ms`;
      firework.appendChild(spark);
    }

    confettiLayer.appendChild(firework);

    window.setTimeout(() => {
      firework.remove();
    }, 1600);
  }
}

function createStars(total = 28) {
  if (!starsLayer) {
    return;
  }

  starsLayer.innerHTML = "";

  for (let index = 0; index < total; index += 1) {
    const star = document.createElement("span");
    star.className = "floating-star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${-10 - Math.random() * 90}px`;
    star.style.animationDelay = `${Math.random() * 6}s`;
    star.style.animationDuration = `${8 + Math.random() * 6}s`;
    star.style.setProperty("--drift-x", `${Math.random() * 90 - 45}px`);
    star.style.setProperty("--fall-distance", `${110 + Math.random() * 40}vh`);
    star.style.opacity = `${0.55 + Math.random() * 0.35}`;
    star.style.width = `${10 + Math.random() * 10}px`;
    star.style.height = star.style.width;
    starsLayer.appendChild(star);
  }
}

function updatePhotoCount() {
  if (galleryCount) {
    galleryCount.textContent = `${photoIndex + 1} / ${config.photoSources.length}`;
  }
}

function queueAutoMessage() {
  window.clearTimeout(autoMessageTimer);

  if (photoIndex !== config.photoSources.length - 1) {
    return;
  }

  autoMessageTimer = window.setTimeout(() => {
    openMessageScreen();
  }, 1800);
}

function setPhoto(index, direction = "right") {
  if (!galleryPhoto) {
    return;
  }

  if (index < 0 || index >= config.photoSources.length) {
    return;
  }

  photoIndex = index;
  galleryPhoto.classList.remove("slide-left", "slide-right");
  galleryPhoto.classList.add(direction === "left" ? "slide-left" : "slide-right");

  window.setTimeout(() => {
    galleryPhoto.src = config.photoSources[photoIndex];
  }, 140);
}

function showNextPhoto() {
  setPhoto(photoIndex + 1, "right");
}

function showPreviousPhoto() {
  setPhoto(photoIndex - 1, "left");
}

function setupPhotos() {
  if (!galleryPhoto || !galleryPlaceholder) {
    return;
  }

  galleryPhoto.addEventListener("load", () => {
    galleryPhoto.classList.add("is-ready");
    galleryPhoto.classList.remove("slide-left", "slide-right");
    galleryPlaceholder.classList.add("hidden");
    updatePhotoCount();
    queueAutoMessage();
  });

  galleryPhoto.addEventListener("error", () => {
    galleryPhoto.classList.remove("is-ready");
    galleryPlaceholder.classList.remove("hidden");
  });

  galleryPhoto.src = config.photoSources[0];
}

function openPhotoScreen() {
  if (birthdayAudio) {
    birthdayAudio.currentTime = 0;
  }
  introScreen?.classList.add("hidden");
  photoScreen?.classList.remove("hidden");
  document.body.classList.add("locked");
  launchConfetti(18);
  launchFireworks(2);
}

function openMessageScreen() {
  window.clearTimeout(autoMessageTimer);
  photoScreen?.classList.add("hidden");
  messageScreen?.classList.remove("hidden");
  document.body.classList.remove("locked");
  if (messagePhoto) {
    messagePhoto.classList.remove("is-visible");
    messagePhoto.src = "assets/images/baim6.jpg.jpeg";
    window.setTimeout(() => {
      messagePhoto.classList.add("is-visible");
    }, 80);
  }
  if (messageCopy) {
    messageCopy.classList.remove("is-visible");
    window.setTimeout(() => {
      messageCopy.classList.add("is-visible");
    }, 520);
  }
  launchConfetti(28);
  launchFireworks(4);
  playMusic();
}

async function playMusic() {
  if (!birthdayAudio) {
    return;
  }

  try {
    birthdayAudio.muted = false;
    await birthdayAudio.play();
    audioUnlocked = true;
    pendingMusicStart = false;
  } catch {
    pendingMusicStart = true;
  }
}

function retryMusicStart() {
  if (!pendingMusicStart) {
    return;
  }

  playMusic();
}

function moveLaterButton() {
  if (!laterButton || window.innerWidth <= 640) {
    showToast("Klik tombol buka.");
    return;
  }

  const offsetX = Math.random() * 120 - 60;
  const offsetY = Math.random() * 60 - 30;
  laterButton.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
}

function handleTouchStart(event) {
  if (!galleryPhoto || event.touches.length !== 1) {
    return;
  }

  touchStartX = event.touches[0].clientX;
  touchCurrentX = touchStartX;
  isSwiping = true;
  galleryPhoto.style.transition = "none";
}

function handleTouchMove(event) {
  if (!isSwiping || !galleryPhoto || event.touches.length !== 1) {
    return;
  }

  touchCurrentX = event.touches[0].clientX;
  const diffX = touchCurrentX - touchStartX;
  galleryPhoto.style.transform = `translateX(${diffX * 0.4}px) scale(1)`;
}

function handleTouchEnd() {
  if (!isSwiping || !galleryPhoto) {
    return;
  }

  const diffX = touchCurrentX - touchStartX;
  isSwiping = false;
  galleryPhoto.style.transition = "";
  galleryPhoto.style.transform = "";

  if (Math.abs(diffX) < 60) {
    return;
  }

  if (diffX < 0) {
    showNextPhoto();
  } else {
    showPreviousPhoto();
  }
}

function handleOpenStart() {
  if (openTriggered) {
    return;
  }

  openTriggered = true;
  playMusic();
  openPhotoScreen();
}

setupPhotos();
createStars();

openButton?.addEventListener("click", handleOpenStart);
laterButton?.addEventListener("mouseenter", moveLaterButton);
laterButton?.addEventListener("focus", moveLaterButton);
laterButton?.addEventListener("click", moveLaterButton);
photoFrame?.addEventListener("touchstart", handleTouchStart, { passive: true });
photoFrame?.addEventListener("touchmove", handleTouchMove, { passive: true });
photoFrame?.addEventListener("touchend", handleTouchEnd);
photoFrame?.addEventListener("touchcancel", handleTouchEnd);
document.addEventListener("touchstart", retryMusicStart, { passive: true });
document.addEventListener("click", retryMusicStart);
