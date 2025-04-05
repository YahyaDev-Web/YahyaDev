document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Language Switching
    const langButtons = document.querySelectorAll('.lang-btn');
    const langElements = document.querySelectorAll('[data-en], [data-ar]');
    const placeholders = document.querySelectorAll('[data-en-placeholder], [data-ar-placeholder]');
    
    // Typewriter variables
    let typewriterTimeout;
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let currentLanguage = localStorage.getItem('language') || 'en';
    // Modified updateLanguage function
    function updateLanguage(lang) {
        document.body.setAttribute('data-lang', lang);
        document.body.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        currentLanguage = lang;

        // Force update placeholders with !important styles
        document.querySelectorAll('[data-en-placeholder], [data-ar-placeholder]').forEach(el => {
            el.placeholder = el.getAttribute(`data-${lang}-placeholder`);
            el.style.backgroundColor = 'white !important';
            el.style.color = '#333 !important';
        });

        // Update other elements
        langElements.forEach(el => {
            if (!(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
                el.textContent = el.getAttribute(`data-${lang}`);
            }
        });

        // Update button text spans
        document.querySelectorAll('.btn-text').forEach(btn => {
            btn.textContent = btn.parentElement.getAttribute(`data-${lang}`);
        });
        
        // Reset typewriter with new language
        resetTypewriter();
    }
    
    function resetTypewriter() {
        clearTimeout(typewriterTimeout);
        const typewriter = document.querySelector('.typewriter');
        typewriter.textContent = '';
        currentPhraseIndex = 0;
        currentCharIndex = 0;
        isDeleting = false;
        typeWriter();
    }
    
    function typeWriter() {
        const typewriter = document.querySelector('.typewriter');
        const phrases = {
            en: ["Python Developer", "Web Enthusiast", "Tech Explorer"],
            ar: ["مطور بايثون", "مهتم بتطوير الويب", "مستكشف تقني"]
        };
        
        const currentPhrases = phrases[currentLanguage];
        const currentPhrase = currentPhrases[currentPhraseIndex];
        
        if (isDeleting) {
            typewriter.textContent = currentPhrase.substring(0, currentCharIndex - 1);
            currentCharIndex--;
        } else {
            typewriter.textContent = currentPhrase.substring(0, currentCharIndex + 1);
            currentCharIndex++;
        }

        let typingSpeed = 100;
        
        if (isDeleting) {
            typingSpeed = 50;
        }

        if (!isDeleting && currentCharIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 1500;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentPhraseIndex = (currentPhraseIndex + 1) % currentPhrases.length;
            typingSpeed = 500;
        }

        typewriterTimeout = setTimeout(typeWriter, typingSpeed);
    }
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            localStorage.setItem('language', lang);
            
            langButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            updateLanguage(lang);
        });
    });

    // Initialize language
    const savedLang = localStorage.getItem('language') || 'en';
    document.querySelector(`.lang-btn[data-lang="${savedLang}"]`).classList.add('active');
    updateLanguage(savedLang);

    // Theme Switching
    const themeToggle = document.querySelector('.theme-toggle input');
    themeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', this.checked ? 'dark' : 'light');
    });

    // Initialize theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
    }

    // Generate Skill Bars
    const skills = [
        { name: { en: "Python", ar: "بايثون" }, level: 95 },
        { name: { en: "HTML", ar: "HTML" }, level: 40 },
        { name: { en: "CSS", ar: "CSS" }, level: 30 },
        { name: { en: "JavaScript", ar: "جافاسكريبت" }, level: 20 },
        { name: { en: "Problem Solving", ar: "حل المشكلات" }, level: 75 }
    ];

    function updateSkills() {
        const skillsContainer = document.querySelector('.skills-container');
        skillsContainer.innerHTML = '';
        
        skills.forEach(skill => {
            const skillElement = document.createElement('div');
            skillElement.className = 'skill-item';
            
            skillElement.innerHTML = `
                <div class="skill-info">
                    <span class="skill-name">${skill.name[currentLanguage]}</span>
                    <span class="skill-percent">${skill.level}%</span>
                </div>
                <div class="skill-bar">
                    <div class="skill-progress" style="width: ${skill.level}%"></div>
                </div>
            `;
            skillsContainer.appendChild(skillElement);
        });
    }
    
    // Initial skills setup
    updateSkills();

    // Form Submission
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.querySelector('.form-message');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.querySelector('.btn-text').textContent;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 
            currentLanguage === 'en' ? 'Sending...' : 'جاري الإرسال...';
        
        // Simulate form submission
        setTimeout(() => {
            formMessage.style.display = 'block';
            formMessage.style.backgroundColor = '#d4edda';
            formMessage.style.color = '#155724';
            formMessage.textContent = 
                currentLanguage === 'en' 
                ? 'Message sent successfully!' 
                : 'تم إرسال الرسالة بنجاح!';
            
            // Reset form
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = originalText;
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }, 1500);
    });

    // Mobile Menu Toggle
    const menuToggle = document.createElement('div');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('header').appendChild(menuToggle);
    
    menuToggle.addEventListener('click', function() {
        document.querySelector('.main-nav').classList.toggle('active');
        this.innerHTML = document.querySelector('.main-nav').classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                document.querySelector('.main-nav').classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });

    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.section, .project-card, .info-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial state for animation
    document.querySelectorAll('.section, .project-card, .info-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
    
    // Start typewriter effect
    typeWriter();
});
// Form submission handler
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const formMessage = document.querySelector('.form-message');
    const originalText = submitBtn.querySelector('.btn-text').textContent;
  
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 
      currentLanguage === 'en' ? 'Sending...' : 'جاري الإرسال...';
  
    try {
      const response = await fetch(this.action, {
        method: 'POST',
        body: new FormData(this),
        headers: {
          'Accept': 'application/json'
        }
      });
  
      if (response.ok) {
        formMessage.style.display = 'block';
        formMessage.style.backgroundColor = '#d4edda';
        formMessage.style.color = '#155724';
        formMessage.textContent = 
          currentLanguage === 'en' 
          ? 'Message sent successfully!' 
          : 'تم إرسال الرسالة بنجاح!';
        this.reset();
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      formMessage.style.display = 'block';
      formMessage.style.backgroundColor = '#f8d7da';
      formMessage.style.color = '#721c24';
      formMessage.textContent = 
        currentLanguage === 'en' 
        ? 'Error sending message. Please try again.' 
        : 'خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = originalText;
      setTimeout(() => formMessage.style.display = 'none', 5000);
    }
  });
