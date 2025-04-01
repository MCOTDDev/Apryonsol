document.addEventListener('DOMContentLoaded', function() {
    const likeButtons = document.querySelectorAll('.apry-like-button');
    
    likeButtons.forEach(button => {
      button.addEventListener('mouseenter', function() {
        const heartIcon = this.querySelector('.apry-heart-icon');
        heartIcon.style.transform = 'scale(1.2)';
        heartIcon.style.transition = 'transform 0.2s';
      });
      
      button.addEventListener('mouseleave', function() {
        const heartIcon = this.querySelector('.apry-heart-icon');
        heartIcon.style.transform = 'scale(1)';
      });
      
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const heartIcon = this.querySelector('.apry-heart-icon');
        
        // Toggle like state
        if (heartIcon.style.color !== 'rgb(249, 24, 128)') {
          heartIcon.style.color = '#f91880';
          const likeCount = this.textContent.trim().split(' ')[1];
          const newCount = (parseFloat(likeCount) + 0.1).toFixed(1);
          this.innerHTML = `<span class="apry-heart-icon" style="color: #f91880;">❤</span> ${newCount}K`;
        } else {
          heartIcon.style.color = '#71767b';
          const likeCount = this.textContent.trim().split(' ')[1];
          const newCount = (parseFloat(likeCount) - 0.1).toFixed(1);
          this.innerHTML = `<span class="apry-heart-icon">❤</span> ${newCount}K`;
        }
        
        
        heartIcon.style.transform = 'scale(1.4)';
        setTimeout(() => {
          heartIcon.style.transform = 'scale(1)';
        }, 200);
      });
    });
  });

  document.addEventListener('DOMContentLoaded', function() {
    let cards = document.querySelectorAll(".card");
    let stackArea = document.querySelector(".stack-area");
    let rightSection = document.querySelector(".right");
    let currentMobileCard = 0;
    let isMobile = window.innerWidth < 1024;
    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartX = 0; 
    let touchEndX = 0;
    let touchDirection = null;
    let lastScrollPos = window.pageYOffset;
    let isAnimating = false;
    let isCardInteractionMode = true; 
    
    if (!document.querySelector('.mobile-progress')) {
      const progressContainer = document.createElement('div');
      progressContainer.className = 'mobile-progress';
      
      cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        if (index === 0) dot.classList.add('active');
        progressContainer.appendChild(dot);
      });
      
      rightSection.appendChild(progressContainer);
    }
    
    if (!document.querySelector('.scroll-toggle') && isMobile) {
      const toggleButton = document.createElement('button');
      toggleButton.className = 'scroll-toggle';
      toggleButton.innerHTML = '<span>Scroll Page</span>';
      toggleButton.title = "Toggle between card navigation and page scrolling";
      
      toggleButton.addEventListener('click', function() {
        isCardInteractionMode = !isCardInteractionMode;
        this.innerHTML = isCardInteractionMode ? '<span>Scroll Page</span>' : '<span>Navigate Cards</span>';
        
        if (isCardInteractionMode) {
          rightSection.classList.add('card-interaction');
          rightSection.classList.remove('page-scrolling');
        } else {
          rightSection.classList.add('page-scrolling');
          rightSection.classList.remove('card-interaction');
        }
      });
      
      rightSection.appendChild(toggleButton);
    }
    
    function rotateCards() {
      let angle = 0;
      cards.forEach((card, index) => {
        if (card.classList.contains("away")) {
          card.style.transform = `translateY(-120vh) rotate(-48deg)`;
        } else {
          card.style.transform = `rotate(${angle}deg)`;
          angle = angle - 10;
          card.style.zIndex = cards.length - index;
        }
      });
    }
    
    function updateMobileCards() {
      if (isAnimating) return;
      isAnimating = true;
      
      const dots = document.querySelectorAll('.progress-dot');
      
      dots.forEach((dot, index) => {
        if (index === currentMobileCard) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
      
      cards.forEach((card, index) => {
        card.classList.remove('mobile-active', 'mobile-prev', 'mobile-next', 'mobile-far');
        
        const relativePos = (index - currentMobileCard + cards.length) % cards.length;
        
        if (relativePos === 0) {
          card.classList.add('mobile-active');
          card.style.opacity = '1';
          card.style.transform = 'translateX(-50%) scale(1)';
          card.style.zIndex = '10';
        } else if (relativePos === cards.length - 1) {
          card.classList.add('mobile-prev');
          card.style.opacity = '0.65';
          card.style.transform = 'translateX(-85%) scale(0.85) rotateY(10deg)';
          card.style.zIndex = '5';
        } else if (relativePos === 1) {
          card.classList.add('mobile-next');
          card.style.opacity = '0.65';
          card.style.transform = 'translateX(-15%) scale(0.85) rotateY(-10deg)';
          card.style.zIndex = '5';
        } else {
          card.classList.add('mobile-far');
          card.style.opacity = '0';
          card.style.transform = 'translateX(-50%) scale(0.7)';
          card.style.zIndex = '1';
        }
        
        card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      });
      
      setTimeout(() => {
        isAnimating = false;
      }, 500);
    }
    
    function nextMobileCard() {
      if (isAnimating || !isCardInteractionMode) return;
      currentMobileCard = (currentMobileCard + 1) % cards.length;
      updateMobileCards();
    }
    
   
    function prevMobileCard() {
      if (isAnimating || !isCardInteractionMode) return;
      currentMobileCard = (currentMobileCard - 1 + cards.length) % cards.length;
      updateMobileCards();
    }
    
    
    function initializeLayout() {
      isMobile = window.innerWidth < 1024;
      
      if (isMobile) {
        
        if (!document.querySelector('.scroll-toggle')) {
          const toggleButton = document.createElement('button');
          toggleButton.className = 'scroll-toggle';
          toggleButton.innerHTML = '<span>Scroll Page</span>';
          toggleButton.title = "Toggle between card navigation and page scrolling";
          
          toggleButton.addEventListener('click', function() {
            isCardInteractionMode = !isCardInteractionMode;
            this.innerHTML = isCardInteractionMode ? '<span>Scroll Page</span>' : '<span>Navigate Cards</span>';
            
            if (isCardInteractionMode) {
              rightSection.classList.add('card-interaction');
              rightSection.classList.remove('page-scrolling');
            } else {
              rightSection.classList.add('page-scrolling');
              rightSection.classList.remove('card-interaction');
            }
          });
          
          rightSection.appendChild(toggleButton);
        }
        
        
        isCardInteractionMode = true;
        rightSection.classList.add('card-interaction');
        rightSection.classList.remove('page-scrolling');
        
        
        cards.forEach(card => {
          card.classList.remove("away");
          card.style.transform = '';
        });
        
        
        window.removeEventListener("scroll", handleDesktopScroll);
        
        
        rightSection.addEventListener('touchstart', handleTouchStart, { passive: true });
        rightSection.addEventListener('touchmove', handleTouchMove, { passive: false });
        rightSection.addEventListener('touchend', handleTouchEnd, { passive: true });
        rightSection.addEventListener('wheel', handleMobileWheel, { passive: false });
        
        
        setTimeout(() => {
          updateMobileCards();
        }, 100);
      } else {
        
        const toggleButton = document.querySelector('.scroll-toggle');
        if (toggleButton) toggleButton.remove();
        
        rotateCards();
        
        
        window.addEventListener("scroll", handleDesktopScroll);
        
        
        rightSection.removeEventListener('touchstart', handleTouchStart);
        rightSection.removeEventListener('touchmove', handleTouchMove);
        rightSection.removeEventListener('touchend', handleTouchEnd);
        rightSection.removeEventListener('wheel', handleMobileWheel);
      }
    }
    
    
    function handleDesktopScroll() {
      let distance = window.innerHeight * 0.5;
      let topVal = stackArea.getBoundingClientRect().top;
      let index = -1 * (topVal / distance + 1);
      index = Math.floor(index);
  
      for (let i = 0; i < cards.length; i++) {
        if (i <= index) {
          cards[i].classList.add("away");
        } else {
          cards[i].classList.remove("away");
        }
      }
      rotateCards();
    }
    
    
    function handleTouchStart(e) {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      touchDirection = null;
    }
    
    function handleTouchMove(e) {
      if (!isCardInteractionMode) return; 
      
      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const diffY = currentY - touchStartY;
      const diffX = currentX - touchStartX;
      
      
      if (!touchDirection) {
        if (Math.abs(diffX) > Math.abs(diffY) * 1.5) {
          touchDirection = 'horizontal';
          return;
        }
        
        
        if (Math.abs(diffY) > 10) {
          touchDirection = 'vertical';
          e.preventDefault();
        }
      } else if (touchDirection === 'vertical') {
        e.preventDefault();
      }
    }
    
    function handleTouchEnd(e) {
      if (!isCardInteractionMode || touchDirection !== 'vertical') return;
      
      touchEndY = e.changedTouches[0].clientY;
      const swipeDist = touchEndY - touchStartY;
      
      
      if (Math.abs(swipeDist) > 30) {
        if (swipeDist > 0) {
          prevMobileCard();
        } else {
          nextMobileCard();
        }
      }
    }
    
    
    function handleMobileWheel(e) {
      if (!isCardInteractionMode) return; 
      
      e.preventDefault();
      
      
      clearTimeout(wheelTimeout);
      
      const wheelTimeout = setTimeout(() => {
        if (e.deltaY > 0) {
          nextMobileCard();
        } else {
          prevMobileCard();
        }
      }, 50);
    }
    
    
    document.querySelectorAll('.progress-dot').forEach((dot, index) => {
      dot.addEventListener('click', () => {
        if (currentMobileCard !== index && !isAnimating && isCardInteractionMode) {
          currentMobileCard = index;
          updateMobileCards();
        }
      });
    });
    
  
    document.addEventListener('keydown', (e) => {
      if (isMobile && isCardInteractionMode) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          prevMobileCard();
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          nextMobileCard();
        }
      }
    });
    
   
    initializeLayout();
    
   
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const wasMobile = isMobile;
        isMobile = window.innerWidth < 1024;
        
      
        if (wasMobile !== isMobile) {
          initializeLayout();
        }
      }, 250);
    });
  });
  document.addEventListener('DOMContentLoaded', () => {
    const merchCard = document.querySelector('.apry-merch-card');
    
    
    if (window.matchMedia("(hover: hover)").matches) {
        merchCard.addEventListener('mousemove', (e) => {
            const rect = merchCard.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const angleX = (e.clientY - centerY) / 20;
            const angleY = -(e.clientX - centerX) / 20;
            
            merchCard.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(30px)`;
        });

        merchCard.addEventListener('mouseleave', () => {
            merchCard.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
        });
    }
});

