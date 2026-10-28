const introScreen = document.getElementById('introScreen');
const mainSite = document.getElementById('mainSite');
const envelope = document.getElementById('envelope');
const openLetterBtn = document.getElementById('openLetterBtn');
const heartsLayer = document.getElementById('floatingHearts');
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const musicLabel = document.getElementById('musicLabel');

function openExperience() {
  envelope.classList.add('open');
  openLetterBtn.textContent = 'Opening your little world… ♡';
  if (bgMusic && bgMusic.paused) {
    bgMusic.play().then(() => {
      musicLabel.textContent = 'Music on';
      musicBtn.classList.add('playing');
    }).catch(() => {
      // Visitor can tap the music button anytime
    });
  }
  setTimeout(() => {
    introScreen.classList.add('hidden');
    mainSite.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    burstHearts(22);
  }, 650);
}
openLetterBtn.addEventListener('click', openExperience);
envelope.addEventListener('click', openExperience);
envelope.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openExperience(); }
});

function makeHeart() {
  const heart = document.createElement('span');
  heart.className = 'floating-heart';
  heart.textContent = ['♡', '♥', '✦', '✿'][Math.floor(Math.random() * 4)];
  heart.style.left = Math.random() * 100 + '%';
  heart.style.fontSize = (12 + Math.random() * 22) + 'px';
  heart.style.animationDuration = (5 + Math.random() * 5) + 's';
  heartsLayer.appendChild(heart);
  setTimeout(() => heart.remove(), 10500);
}
function burstHearts(amount = 12) {
  for (let i = 0; i < amount; i++) setTimeout(makeHeart, i * 100);
}
setInterval(() => { if (!mainSite.classList.contains('hidden')) makeHeart(); }, 850);

// Photo loading: resolves paths from assets or assets/photos
function resolvePhotoSrc(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/') || path.startsWith('data:')) {
    return path;
  }
  if (path.startsWith('assets/')) {
    return path;
  }
  return `assets/${path}`;
}

document.querySelectorAll('[data-photo]').forEach(el => {
  const photoPath = el.dataset.photo;
  const img = new Image();
  img.src = resolvePhotoSrc(photoPath);
  img.alt = 'A personal memory';
  img.onload = () => {
    const target = el.classList.contains('photo-placeholder') ? el : el.querySelector('.photo-placeholder');
    if (!target) return;
    target.querySelectorAll(':scope > span').forEach(s => s.remove());
    target.appendChild(img);
  };
  img.onerror = () => {
    if (img.src.endsWith('.jpg')) {
      img.src = img.src.replace(/\.jpg$/, '.jpeg');
    } else if (img.src.endsWith('.jpeg')) {
      img.src = img.src.replace(/\.jpeg$/, '.jpg');
    }
  };
});

const photoModal = document.getElementById('photoModal');
const modalPhoto = document.getElementById('modalPhoto');
const modalCaption = document.getElementById('modalCaption');
document.querySelectorAll('.memory-card').forEach(card => {
  card.addEventListener('click', () => {
    const photoPath = card.dataset.photo;
    const img = new Image();
    img.src = resolvePhotoSrc(photoPath);
    img.alt = 'Our memory';
    img.onerror = () => {
      if (img.src.endsWith('.jpg')) {
        img.src = img.src.replace(/\.jpg$/, '.jpeg');
      } else if (img.src.endsWith('.jpeg')) {
        img.src = img.src.replace(/\.jpeg$/, '.jpg');
      }
    };
    modalPhoto.replaceChildren();
    modalPhoto.appendChild(img);
    modalCaption.textContent = card.dataset.caption;
    photoModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });
});
function closePhotoModal() {
  photoModal.classList.add('hidden');
  document.body.style.overflow = '';
}
document.getElementById('modalClose').addEventListener('click', closePhotoModal);
photoModal.addEventListener('click', e => { if (e.target === photoModal) closePhotoModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePhotoModal(); });

// Flip cards reveal personalized Hinglish messages.
document.querySelectorAll('.reason-card').forEach(card => {
  card.addEventListener('click', () => {
    const isFlipped = card.classList.toggle('flipped');
    card.setAttribute('aria-expanded', isFlipped);
  });
});

// Replay the letter reveal for a small, gentle effect.
document.getElementById('readToggle').addEventListener('click', () => {
  const copy = document.getElementById('letterCopy');
  copy.classList.remove('reveal');
  void copy.offsetWidth;
  copy.classList.add('reveal');
  burstHearts(8);
  copy.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Music only starts after an intentional click. Browsers block autoplay.
musicBtn.addEventListener('click', async () => {
  if (bgMusic.paused) {
    try {
      await bgMusic.play();
      musicLabel.textContent = 'Music on';
      musicBtn.classList.add('playing');
    } catch (err) {
      musicLabel.textContent = 'Add assets/music.mp3';
    }
  } else {
    bgMusic.pause();
    musicLabel.textContent = 'Music off';
    musicBtn.classList.remove('playing');
  }
});

// Final gift and celebration.
const giftButton = document.getElementById('giftButton');
const finalMessage = document.getElementById('finalMessage');
giftButton.addEventListener('click', () => {
  giftButton.classList.add('open');
  finalMessage.classList.remove('hidden');
  finalMessage.classList.add('reveal');
  document.querySelector('.gift-hint').textContent = 'a little wish, just for you ♡';
  burstHearts(35);
  finalMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
document.getElementById('celebrateBtn').addEventListener('click', () => {
  burstHearts(50);
  giftButton.classList.remove('open');
  void giftButton.offsetWidth;
  giftButton.classList.add('open');
});

// Smooth anchor navigation with no extra dependencies.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});
