document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.querySelector('.navbar-toggle');
    const menu = document.querySelector('.navbar-menu');

    if (toggleBtn && menu) {
        toggleBtn.addEventListener('click', () => {
            menu.classList.toggle('open');
        });
    }
});
