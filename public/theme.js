// Toggle between dark and light mode
function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';

     // Switch the theme
     document.body.classList.toggle('dark-mode');

     // Save the new theme to localStorage
     const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
     localStorage.setItem('theme', newTheme);
   }

   // On page load, apply the saved theme
   window.addEventListener('DOMContentLoaded', () => {
     const savedTheme = localStorage.getItem('theme');

     if (savedTheme === 'dark') {
       document.body.classList.add('dark-mode');
     } else {
       document.body.classList.remove('dark-mode');
     }
   });