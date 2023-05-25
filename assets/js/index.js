import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const navToggleEl = document.querySelector(".mobile-nav-toggle");
const primaryNavEL = document.querySelector(".primary-navigation");

navToggleEl.addEventListener('click', () => {
    if (primaryNavEL.hasAttribute("data-visible")){
        navToggleEl.setAttribute("aria-expanded", false)
    }
    else {
        navToggleEl.setAttribute("aria-expanded", true)
    }
    primaryNavEL.toggleAttribute("data-visible");
})