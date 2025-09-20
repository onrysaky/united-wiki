// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
  const loadingScreen = document.querySelector('.loading-screen');
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
  }, 1000);
});

// ===== ACCORDION =====
const acc = document.querySelectorAll(".accordion button");
acc.forEach(button => {
  button.addEventListener("click", () => {
    const panel = button.nextElementSibling;
    panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + "px";
  });
});

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry, index) => {
    if(entry.isIntersecting){
      setTimeout(()=>{
        entry.target.classList.add('active');
      }, index * 150);
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

// ===== HERO FADE IN =====
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.header-hero').classList.add('active');
  
  // ===== LIGHTBOX =====
  const lightboxImages = document.querySelectorAll('.lightbox');
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  document.body.appendChild(lightbox);
  
  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.innerHTML = '×';
  lightbox.appendChild(closeBtn);
  
  lightboxImages.forEach(img => {
    img.addEventListener('click', (e) => {
      e.preventDefault();
      lightbox.innerHTML = '';
      
      // Recreate close button
      const newCloseBtn = document.createElement('button');
      newCloseBtn.className = 'lightbox-close';
      newCloseBtn.innerHTML = '×';
      lightbox.appendChild(newCloseBtn);
      
      const lbImg = document.createElement('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lightbox.appendChild(lbImg);
      
      // Add image caption
      const caption = document.createElement('div');
      caption.className = 'lightbox-caption';
      caption.textContent = img.alt;
      lightbox.appendChild(caption);
      
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
  
  // Close lightbox when clicking close button
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.className === 'lightbox-close') {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Close lightbox with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

// ===== COUNTER =====
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
  const updateCount = () => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;
    const increment = target / 100;
    
    if(count < target){
      counter.innerText = Math.ceil(count + increment);
      setTimeout(updateCount, 30);
    } else { 
      counter.innerText = target; 
    }
  };
  
  const obs = new IntersectionObserver((entries, ob)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        updateCount();
        ob.unobserve(counter);
      }
    });
  }, {threshold:0.5});
  obs.observe(counter);
});

// ===== VIDEO HANDLER =====
const video = document.getElementById('highlight-video');
let videoUnmuted = false;

function enableVideoSound() {
  if (!videoUnmuted && video && video.muted) {
    video.muted = false;
    video.play().catch(e => console.log("Video play failed:", e));
    videoUnmuted = true;
  }
}

document.addEventListener('click', enableVideoSound, { once: true });
document.addEventListener('touchstart', enableVideoSound, { once: true });

video.addEventListener('error', () => {
  video.style.display = 'none';
  const errorMsg = document.createElement('div');
  errorMsg.className = 'video-error';
  errorMsg.textContent = 'Video tidak dapat dimuat. Silakan coba lagi nanti.';
  video.parentNode.appendChild(errorMsg);
});

// ===== NAVBAR SHRINK ON SCROLL =====
window.addEventListener('scroll', ()=>{
  const navbar = document.querySelector('.navbar');
  if(window.scrollY > 50){
    navbar.classList.add('shrink');
  } else {
    navbar.classList.remove('shrink');
  }
});

// ===== STATS ICON STAGGER =====
const statSection = document.getElementById('statistik-mu');
const statIcons = statSection.querySelectorAll('.stat-icon');

const statObs = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      statIcons.forEach((icon, i) => {
        setTimeout(() => {
          icon.classList.add('active');
        }, i * 200);
      });
      observer.unobserve(statSection);
    }
  });
}, { threshold: 0.3 });

statObs.observe(statSection);

// ===== TIMELINE REVEAL =====
const timelineItems = document.querySelectorAll('.timeline-content');
const timelineObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('active');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

timelineItems.forEach(item => timelineObs.observe(item));

// ===== SEARCH FUNCTIONALITY =====
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

function performSearch() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  
  if (searchTerm === '') {
    alert('Masukkan kata kunci pencarian!');
    return;
  }
  
  const sections = document.querySelectorAll('.articles, .about');
  let found = false;
  
  sections.forEach(section => {
    const text = section.textContent.toLowerCase();
    if (text.includes(searchTerm)) {
      section.scrollIntoView({ behavior: 'smooth' });
      found = true;
      
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      const walker = document.createTreeWalker(
        section,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      
      let node;
      while (node = walker.nextNode()) {
        const parent = node.parentNode;
        if (parent.nodeName !== 'SCRIPT' && parent.nodeName !== 'STYLE') {
          const matches = node.nodeValue.match(regex);
          if (matches) {
            const span = document.createElement('span');
            span.innerHTML = node.nodeValue.replace(regex, '<mark>$1</mark>');
            parent.replaceChild(span, node);
            
            setTimeout(() => {
              span.outerHTML = span.innerHTML;
            }, 5000);
          }
        }
      }
    }
  });
  
  if (!found) {
    alert(`Tidak ditemukan hasil untuk "${searchTerm}"`);
  }
}

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    performSearch();
  }
});

// ===== BACK TO TOP BUTTON =====
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopButton.classList.add('show');
  } else {
    backToTopButton.classList.remove('show');
  }
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ===== DARK MODE TOGGLE =====
const darkModeToggle = document.getElementById('darkModeToggle');

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

if (localStorage.getItem('darkMode') === 'true' || 
    (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.body.classList.add('dark-mode');
}

// ===== PARALLAX EFFECT =====
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallax = document.querySelector('.header-hero');
  parallax.style.transform = `translateY(${scrolled * 0.5}px)`;

});

// ===== MOBILE VIDEO HANDLER =====
document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('highlight-video');
  
  // Deteksi mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    // Untuk mobile: hapus autoplay, tambah poster
    video.removeAttribute('autoplay');
    video.setAttribute('poster', 'https://via.placeholder.com/800x450?text=Manchester+United+Highlight');
    
    // Hapus muted agar ada suara
    video.removeAttribute('muted');
    
    // Force play saat user klik
    video.addEventListener('click', () => {
      video.play().catch(e => {
        console.log('Video play failed:', e);
        // Tampilkan fallback jika video gagal
        const fallback = video.querySelector('.video-fallback');
        if (fallback) {
          fallback.style.display = 'flex';
        }
      });
    });
  } else {
    // Untuk desktop: tetap pakai autoplay muted
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
  }
  
  // Handle video error
  video.addEventListener('error', () => {
    const fallback = video.querySelector('.video-fallback');
    if (fallback) {
      fallback.style.display = 'flex';
    }
  });
});
