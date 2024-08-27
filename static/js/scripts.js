document.addEventListener('DOMContentLoaded', () => {
    console.log('JavaScript is working!');
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    console.log(width);
    
    // Example of form validation
    document.querySelector('contact-form').addEventListener('submit', function(event) {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            event.preventDefault();
        }
    });
});


// Smooth scrolling for links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
  });


// Initialize AOS library
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 1000, // Duration of animations
        easing: 'ease-in-out', // Easing function
        once: true // Animation should only happen once
    });
});


// Filter projects
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-button');
    const projectItems = document.querySelectorAll('.project-block');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            projectItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
});


// Theme toggle logic
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
        
        // Check for saved user preference in localStorage
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.body.classList.add(currentTheme);

        themeToggle.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Toggle theme between 'light' and 'dark'
            const newTheme = document.body.classList.contains('light') ? 'dark' : 'light';
            document.body.classList.remove('light', 'dark');
            document.body.classList.add(newTheme);

            // Save user preference in localStorage
            localStorage.setItem('theme', newTheme);
        });
});
