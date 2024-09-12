/* ----------- Navbar animációhoz ------------ */

function handleNavbarScroll() {

window.addEventListener('scroll', function() {
    const navbar = document.querySelector('#navigation');
        
        let logo = document.querySelector('.logo');
        let smallLogo = document.querySelector('.logo-small');
        

        if (window.scrollY > 50) {
            navbar.style.transition = 'height 0.5s ease-in-out';
            navbar.style.height = '50px'; 
            navbar.classList.add('scrolled');
            logo.classList.add('hidden');
            smallLogo.classList.remove('hidden');
        } else {
            navbar.style.transition = 'height 0.5s ease-in-out'; 
            navbar.style.height = '100px';
            navbar.classList.remove('scrolled');
            logo.classList.remove('hidden');
            smallLogo.classList.add('hidden');
        }
    });
}


export {
    handleNavbarScroll
}