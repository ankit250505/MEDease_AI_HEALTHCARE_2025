document.addEventListener('DOMContentLoaded', function() {
  const stepTabs = document.querySelectorAll('.step-tab');
  const stepContents = document.querySelectorAll('.step-content');
  const stepIndicator = document.getElementById('step-indicator');
  const stepVisual = document.getElementById('step-visual');
  const progressTitle = document.getElementById('progress-title');
  const languageSwitcher = document.getElementById('languageSwitcherCompact');
  const languageDropdown = document.getElementById('languageDropdownCompact');
  const languageOptions = document.querySelectorAll('.language-option-compact');
  const currentFlag = document.getElementById('currentLanguageFlag');
  const currentCode = document.getElementById('currentLanguageCode');
  
  // Step data for MedCare
  const stepData = {
    1: {
      title: 'Check Symptoms',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
              <path d="M9 12l2 2 4-4"></path>
              <rect width="18" height="18" x="3" y="3" rx="2"></rect>
            </svg>`,
      visual: `<div class="text-center">
                <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
                    <path d="M9 12l2 2 4-4"></path>
                    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  </svg>
                </div>
                <p class="text-white/90 text-sm">MedCare Symptom Checker Interface</p>
              </div>`,
      progress: [100, 0, 0]
    },
    2: {
      title: 'Analyze Results',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
              <path d="M9 12l2 2 4-4"></path>
              <path d="M21 12c.552 0 1.005.449.95 1-.272 2.72-1.707 5.049-3.95 6.34V21a1 1 0 01-1 1H7a1 1 0 01-1-1v-1.66c-2.243-1.291-3.678-3.62-3.95-6.34C2.995 12.45 3.448 12 4 12h17z"></path>
            </svg>`,
      visual: `<div class="text-center">
                <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
                    <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
                  </svg>
                </div>
                <p class="text-white/90 text-sm">AI Analysis Results Screen</p>
              </div>`,
      progress: [100, 100, 0]
    },
    3: {
      title: 'Connect to Care',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>`,
      visual: `<div class="text-center">
                <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <path d="M12 17h.01"></path>
                  </svg>
                </div>
                <p class="text-white/90 text-sm">Healthcare Provider Finder Map</p>
              </div>`,
      progress: [100, 100, 100]
    }
  };

  function updateStep(stepNumber) {
    // Update tabs
    stepTabs.forEach(tab => {
      tab.classList.remove('bg-white', 'text-black');
      tab.classList.add('bg-neutral-900/50', 'text-white/80');
    });
    stepTabs[stepNumber - 1].classList.remove('bg-neutral-900/50', 'text-white/80');
    stepTabs[stepNumber - 1].classList.add('bg-white', 'text-black');

    // Update content panels
    stepContents.forEach(content => content.classList.add('hidden'));
    document.querySelector(`[data-panel="${stepNumber}"]`).classList.remove('hidden');

    // Update indicator
    const data = stepData[stepNumber];
    stepIndicator.innerHTML = `${data.icon}<span class="font-medium">${data.title}</span>`;

    // Update visual
    stepVisual.innerHTML = data.visual;

    // Update progress bars
    document.getElementById('step1-progress').textContent = `${data.progress[0]}%`;
    document.getElementById('step1-bar').style.width = `${data.progress[0]}%`;
    document.getElementById('step2-progress').textContent = `${data.progress[1]}%`;
    document.getElementById('step2-bar').style.width = `${data.progress[1]}%`;
    document.getElementById('step3-progress').textContent = `${data.progress[2]}%`;
    document.getElementById('step3-bar').style.width = `${data.progress[2]}%`;

    // Update progress colors
    if (data.progress[1] > 0) {
      document.getElementById('step2-bar').classList.remove('bg-white/40');
      document.getElementById('step2-bar').classList.add('bg-gradient-to-r', 'from-green-500', 'to-green-400');
    }
    if (data.progress[2] > 0) {
      document.getElementById('step3-bar').classList.remove('bg-white/30');
      document.getElementById('step3-bar').classList.add('bg-gradient-to-r', 'from-purple-500', 'to-purple-400');
    }
  }

  // Add click event listeners
  stepTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      updateStep(index + 1);
    });
    let currentLanguage = 'en';

        // Toggle dropdown
        languageSwitcher.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isVisible = !languageDropdown.classList.contains('opacity-0');
            
            if (isVisible) {
                closeDropdown();
            } else {
                openDropdown();
            }
        });

        function openDropdown() {
            languageDropdown.classList.remove('opacity-0', 'invisible', 'translate-y-2');
            languageDropdown.classList.add('opacity-100', 'visible', 'translate-y-0');
        }

        function closeDropdown() {
            languageDropdown.classList.add('opacity-0', 'invisible', 'translate-y-2');
            languageDropdown.classList.remove('opacity-100', 'visible', 'translate-y-0');
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!languageSwitcher.contains(e.target) && !languageDropdown.contains(e.target)) {
                closeDropdown();
            }
        });

        // Language selection
        languageOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                
                const selectedLang = this.dataset.lang;
                const selectedCode = this.dataset.code;
                const selectedFlag = this.dataset.flag;
                const selectedName = this.dataset.name;
                
                // Update current language
                currentLanguage = selectedLang;
                
                // Update button display
                currentFlag.textContent = selectedFlag;
                currentCode.textContent = selectedCode;
                
                // Update active states
                languageOptions.forEach(opt => {
                    const checkIcon = opt.querySelector('svg');
                    opt.classList.remove('active-language');
                    
                    if (opt.dataset.lang === selectedLang) {
                        opt.classList.add('active-language');
                        checkIcon.classList.remove('text-white/0');
                        checkIcon.classList.add('text-green-400');
                        // Update to check icon
                        checkIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>';
                    } else {
                        checkIcon.classList.add('text-white/0');
                        checkIcon.classList.remove('text-green-400');
                        // Update to arrow icon
                        checkIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>';
                    }
                });
                
                // Close dropdown
                closeDropdown();
                
                // Store preference
                localStorage.setItem('medease-language', selectedLang);
                
                // Log language change (replace with actual translation logic)
                console.log(`Language changed to: ${selectedName} (${selectedLang})`);
                
                // Optional: Show brief notification
                showLanguageChangeNotification(selectedName);
            });
        });

        // Load saved language preference
        const savedLanguage = localStorage.getItem('medease-language');
        if (savedLanguage && savedLanguage !== 'en') {
            const savedOption = document.querySelector(`[data-lang="${savedLanguage}"]`);
            if (savedOption) {
                savedOption.click();
            }
        }

        // Optional: Show notification when language changes
        function showLanguageChangeNotification(languageName) {
            const notification = document.createElement('div');
            notification.className = 'fixed top-20 right-6 bg-green-500/90 backdrop-blur text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full text-sm font-medium';
            notification.textContent = `Language: ${languageName}`;
            
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.classList.remove('translate-x-full');
            }, 100);
            
            // Remove after 2 seconds
            setTimeout(() => {
                notification.classList.add('translate-x-full');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, 2000);
        }

        // Close dropdown on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeDropdown();
            }
        });
    });

     // Initialize lucide icons
      lucide.createIcons();

      // Optional: subtle cursor-follow accent circle with eased motion
      const circle = document.getElementById('accentCircle');
      let targetX = window.innerWidth - 64; // initial near right
      let targetY = window.innerHeight / 2;
      let currentX = targetX, currentY = targetY;

      const lerp = (a, b, t) => a + (b - a) * t;

      function animate() {
        currentX = lerp(currentX, targetX, 0.12);
        currentY = lerp(currentY, targetY, 0.12);
        circle.style.transform = `translate(${currentX - 20}px, ${currentY - 20}px)`; // offset radius (w/h 40)
        requestAnimationFrame(animate);
      }

      // Start animation (only on md and up)
      const mq = window.matchMedia('(min-width: 768px)');
      if (mq.matches && circle) {
        circle.style.left = '0px';
        circle.style.top = '0px';
        circle.style.right = 'auto';
        circle.style.bottom = 'auto';
        circle.style.willChange = 'transform';
        requestAnimationFrame(animate);

        window.addEventListener('mousemove', (e) => {
          targetX = e.clientX;
          targetY = e.clientY;
        }, { passive: true });
      }

      // Resize handler to keep motion stable
      window.addEventListener('resize', () => {
        if (!mq.matches) return;
        targetX = Math.min(targetX, window.innerWidth - 20);
        targetY = Math.min(targetY, window.innerHeight - 20);
      });

      // Smooth scrolling for navigation links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });

      // Intersection Observer for animations
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
          }
        });
      }, observerOptions);

      // Observe all animated elements
      document.querySelectorAll('[style*="animation:"]').forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
      });
});