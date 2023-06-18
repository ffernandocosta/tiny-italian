import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import { menuArray } from './data.js';

let basketItemsArray = [];
let isPaymentFormValid = false;

const navToggleEl = document.getElementById('mobile-nav-toggle');
const menuSectionEl = document.getElementById('menu-section');
const basketContentEl = document.getElementById('basket--content');
const basketEmptyEl = document.getElementById('basket--empty');
const menuItemsEl = document.getElementById('menu-items');
const filterBtns = document.querySelectorAll('.filter-btn');
const basketPaymentForm = document.getElementById('basket-payment-form');
const paymentFormEl = document.querySelector('[data-form]');
const thankyouMessageEl = document.getElementById('thankyou-message');
const paymentFormUsername = document.getElementById('name');
const paymentFormCreditCard = document.getElementById('credit-card');
const paymentFormCardCvv = document.getElementById('card-cvv');
const continueShoppingFormBtn = document.getElementById('continue-shopping-form');

navToggleEl.addEventListener('click', () => {
    handleMobileNavToggleClick();
});

menuSectionEl.addEventListener('click', (e) => {
    if(e.target.dataset.orderButton){
        handleOrderBtnClick(e.target.dataset.orderButton);
        handleShoppingCartUiUpdate();
    }
    else if(e.target.dataset.decrementBtn){
        handleDecrementOrderBtnClick(e.target.dataset.decrementBtn);
        handleShoppingCartUiUpdate();
    }
    else if(e.target.dataset.incrementBtn){
        handleIncrementOrderBtnClick(e.target.dataset.incrementBtn);
        handleShoppingCartUiUpdate();
    }
    else if(e.target.id === "menu--go-to-cart"){
        renderBasket();
        handleGoToCartBtnClick();
    }
});

basketContentEl.addEventListener('click', (e) => {
    if(e.target.classList.contains('basket--continue-shopping')){
        handleContinueShoppingBtnClick();
    }
    else if(e.target.dataset.qtyBtnDecrement){
        handleDecrementOrderBtnClick(e.target.dataset.qtyBtnDecrement);
        renderBasket();
        handleShoppingCartUiUpdate();
        
        // checks to see if the basket is empty and renders empty basket section
        if(!basketItemsArray.length){
            basketEmptyEl.toggleAttribute('data-visible');
            basketContentEl.toggleAttribute('data-visible');
        }
    }
    else if(e.target.dataset.qtyBtnIncrement){
        handleIncrementOrderBtnClick(e.target.dataset.qtyBtnIncrement);
        renderBasket();
        handleShoppingCartUiUpdate();
    }
    else if(e.target.id === 'basket--place-order-btn'){
        basketContentEl.toggleAttribute('data-visible');
        basketPaymentForm.toggleAttribute('data-visible');
    }
});

basketEmptyEl.addEventListener('click', (e) => {
    if(e.target.classList.contains('basket--continue-shopping')){
        handleContinueShoppingBtnClick();
    }
});

document.addEventListener('click', (e) => {
    if(e.target.classList.contains('cart-click')){
        handleGoToCartBtnClick();
        renderBasket();
        if(e.target.classList.contains('shopping-cart-icon')){
            handleMobileNavToggleClick();
        }
    }
    else if(e.target.id === 'nav-menu'){
        e.preventDefault();
        menuSectionEl.scrollIntoView({ behavior: 'smooth' });
        handleMobileNavToggleClick();
    }
    else if(e.target.id === 'hero--order-now-btn'){
        e.preventDefault();
        menuSectionEl.scrollIntoView({ behavior: 'smooth' });
    }
    else if(e.target.id === 'nav-whyus'){
        e.preventDefault();
        document.getElementById('whyus-section').scrollIntoView({ behavior: 'smooth' });
        handleMobileNavToggleClick();
    }
    else if(e.target.id === 'nav-locations'){
        e.preventDefault();
        document.getElementById('locations-section').scrollIntoView({ behavior: 'smooth' });
        handleMobileNavToggleClick();
    }
    else if(e.target.id === 'thankyou--go-back-btn'){
        thankyouMessageEl.toggleAttribute('data-visible');
    }
});

paymentFormEl.addEventListener('submit', (e) => {
    e.preventDefault();
    handleInputValidation();
    handlePurchaseThankYouMessage();
});

continueShoppingFormBtn.addEventListener('click', () => {
    basketPaymentForm.toggleAttribute('data-visible');
    basketContentEl.toggleAttribute('data-visible');
});

filterBtns.forEach( (btn) => {
    btn.addEventListener('click', (e) => {
        const category = e.currentTarget.dataset.id;
        const menuCategory = menuArray.filter( (item) => {
            if(item.category === category){
                return item;
            }
        })
        if(category === "all"){
            renderMenu(menuArray);
            handleShoppingCartUiUpdate();
        }
        else {
            renderMenu(menuCategory);
            handleShoppingCartUiUpdate();
        }
    });
});



function handleMobileNavToggleClick(){
    const navToggleEl = document.getElementById('mobile-nav-toggle');
    const primaryNavEL = document.getElementById('primary-navigation');
    
    if (primaryNavEL.hasAttribute("data-visible")){
        navToggleEl.setAttribute("aria-expanded", false);
    }
    else {
        navToggleEl.setAttribute("aria-expanded", true);
    }
    primaryNavEL.toggleAttribute("data-visible");
}

function handleOrderBtnClick(id){
    const targetItemObj = menuArray.filter( (item) => {
        return item.uuid === id
    })[0]

    targetItemObj.itemCount++
    
    if(targetItemObj.itemCount > 0){
        document.querySelector(`[data-order-button-div="${id}"]`).innerHTML = 
        `
            <button class="card-order-item-btn fs-300 fw-semi-bold" data-order-item-button="${id}">
                <span class="decrement-btn" data-decrement-btn="${id}">-</span>
                <span class="item-count" data-item-count="${id}">${targetItemObj.itemCount}</span>
                <span class="increment-btn" data-increment-btn="${id}">+</span>
            </button>
        `
    }

    basketItemsArray.push(targetItemObj);
}

function handleDecrementOrderBtnClick(id){
    const targetItemObj = menuArray.filter( (item) => {
        return item.uuid === id
    })[0]

    targetItemObj.itemCount--

    document.querySelector(`[data-item-count="${id}"]`).textContent = targetItemObj.itemCount
    
    if(targetItemObj.itemCount < 1){
        document.querySelector(`[data-order-button-div="${id}"]`).innerHTML = 
        `
        <button class="card-order-btn fs-300 fw-semi-bold" data-order-button="${id}">
            Order
        </button>
        `

        basketItemsArray.forEach( (item, index) => {
            if(targetItemObj === item){
                basketItemsArray.splice(index, 1)
            }
        })

    }
}

function handleIncrementOrderBtnClick(id){
    const targetItemObj = menuArray.filter( (item) => {
        return item.uuid === id
    })[0]

    targetItemObj.itemCount++

    document.querySelector(`[data-item-count="${id}"]`).textContent = targetItemObj.itemCount
}

function handleShoppingCartUiUpdate(){
    const itemCountDivEl = document.querySelectorAll('.card--item-count');
    const navShoppingCartEl = document.getElementById('nav-shopping-cart');

    function getBasketItemCountTotal(){
        let basketItemCountTotal = 0;
        basketItemsArray.forEach( (item) => {
            basketItemCountTotal += item.itemCount
        })
        
        return basketItemCountTotal;
    }

    itemCountDivEl.forEach( (div) => {
        div.innerHTML = 
        `
        <img src="/assets/img/shopping-cart-icon.svg" alt="A shopping cart icon" class="card-cart cart-click">
        <span class="card--how-many-items cart-click fs-200 fw-medium text-white show">
            ${getBasketItemCountTotal()}
        </span>
        `
    });

    navShoppingCartEl.innerHTML = `
        <img src="/assets/img/shopping-cart-icon.svg" alt="A shopping cart icon" class="shopping-cart-icon cart-click">
        <span class="nav--how-many-items cart-click fs-200 fw-medium text-white show">
            ${getBasketItemCountTotal()}
        </span>
    `

    if(getBasketItemCountTotal() === 0){
        const itemCountSpanEl = document.querySelectorAll('.card--how-many-items');
        const navItemCountSpanEl = document.querySelector('.nav--how-many-items');

        itemCountSpanEl.forEach( (span) => {
            span.classList.remove('show');
            span.classList.add('hidden');
        });

        navItemCountSpanEl.classList.remove('show');
        navItemCountSpanEl.classList.add('hidden');
    }
}

function handleGoToCartBtnClick(){
    if(!basketItemsArray.length){
        basketEmptyEl.toggleAttribute('data-visible');
    }
    else {
        basketContentEl.toggleAttribute('data-visible');
    }
}

function handleContinueShoppingBtnClick(){
    if(basketContentEl.hasAttribute('data-visible')){
        basketContentEl.toggleAttribute('data-visible');
    }
    else if(basketEmptyEl.hasAttribute('data-visible')){
        basketEmptyEl.toggleAttribute('data-visible');
    }
}

function getBasketHtml(){
    let basketHtml = ``

    function getBasketItemsHtml(){
        let basketItemsHtml = ``

        basketItemsArray.forEach( (item) => {
            basketItemsHtml +=`
            <div class="basket--grid-item">
                <img src="${item.itemImage}" alt="${item.alt}" class="basket--img">
            </div>
            <div class="basket--grid-item-details">
                <h3 class="fs-400 fw-semi-bold">${item.name}</h3>
                <p class="fs-500 fw-semi-bold">$${(item.price * item.itemCount).toFixed(2)}</p>
                <button class="basket--qty-btn">
                    <span class="qty-btn-decrement" data-qty-btn-decrement="${item.uuid}">-</span>
                    <span class="qty-item-count">${item.itemCount}</span>
                    <span class="qty-increment-btn" data-qty-btn-increment="${item.uuid}">+</span>
                </button>
            </div>
            `
        })
    
        return basketItemsHtml
    }

    function getBasketItemsTotalPrice(){
        let basketItemsTotalPrice = 0;
        basketItemsArray.forEach( (item) => {
            basketItemsTotalPrice += item.price * item.itemCount
        })
        
        return basketItemsTotalPrice;
    }

    basketHtml = `
    <div class="basket--inner-content">
        <p class="basket--continue-shopping fs-300 fw-medium text-main">← Continue Shopping</p>
        <h1 class="basket--h1 fs-600 fw-bold">Basket Items</h1>
        <div class="basket--full-basket">
            <div class="basket--grid-container">
                ${getBasketItemsHtml()}
            </div>
        </div>
        <hr>
        <p class="fs-500 fw-semi-bold basket--total-price">Total: $${getBasketItemsTotalPrice()}</p>
        <button class="basket--place-order-btn fs-400 fw-semi-bold" id="basket--place-order-btn">Place Order</button>
        <p class="basket--continue-shopping fs-300 fw-medium text-main">← Continue Shopping</p>
    </div>
    `

    return basketHtml
    
}

function getMenuHtml(menuItems){
    let htmlMenu = ``

    menuItems.forEach( (item) => {
        htmlMenu += `
        <div class="card-menu">    
            <div class="card-inner">
                <img src="${item.itemImage}" alt="${item.alt}" class="card-img">
                <img src="/assets/img/stars-rating.svg" alt="Five yellow starts rating" class="card-rating">
                <div class="card--item-count">
                    <img src="/assets/img/shopping-cart-icon.svg" alt="A shopping cart icon" class="card-cart cart-click">
                    <span class="card--how-many-items cart-click fs-200 fw-medium text-white hidden">
                    </span>
                </div>
                <p class="fs-400 fw-extra-bold card-title">${item.name}</p>
                <p class="fs-300 card-ingredients">${item.ingredients}</p>
                <div class="card-price">
                    <p class="price-discount fs-300">${item.discount}</p>
                    <p class="fs-500 fw-semi-bold">${item.priceText}</p>
                </div>
                <div class="order-button-div" data-order-button-div="${item.uuid}">
                    <button class="card-order-btn fs-300 fw-semi-bold" data-order-button="${item.uuid}">
                        Order
                    </button>
                </div>
            </div>
        </div>
        `
    });

    return htmlMenu

}

function renderBasket(){
    basketContentEl.innerHTML = getBasketHtml();
}

function renderMenu(category){
    menuItemsEl.innerHTML = getMenuHtml(category);
}

function setFormError(element, message){
    const elementFieldset = element.parentElement;
    const errorDisplay = elementFieldset.querySelector('.error-message');

    errorDisplay.innerText = message;
}

function setFormSuccess(element){
    const elementFieldset = element.parentElement;
    const errorDisplay = elementFieldset.querySelector('.error-message');

    errorDisplay.innerText = '';
}

function handleInputValidation(){
    const usernameValue = paymentFormUsername.value.trim();
    const creditCardValue = paymentFormCreditCard.value.trim();
    const cvvValue = paymentFormCardCvv.value.trim();

    isPaymentFormValid = true;

    if(usernameValue === '') {
        setFormError(paymentFormUsername, 'Username is required');
        isPaymentFormValid = false;
    }
    else if(usernameValue.length < 3){
        setFormError(paymentFormUsername, 'Username must have more than 3 letters');
        isPaymentFormValid = false
    }
    else {
        setFormSuccess(paymentFormUsername);
    }

    if(creditCardValue === '') {
        setFormError(paymentFormCreditCard, 'Credit card number is required');
        isPaymentFormValid = false
    }
    else if(creditCardValue.length < 13){
        setFormError(paymentFormCreditCard, 'Credit card number must have 13 digits')
        isPaymentFormValid = false
    }
    else {
        setFormSuccess(paymentFormCreditCard);
    }

    if(cvvValue === '') {
        setFormError(paymentFormCardCvv, 'CVV is required');
        isPaymentFormValid = false
    }
    else if(cvvValue.length < 3 ) {
        setFormError(paymentFormCardCvv, 'CVV must be at least 3 character.')
        isPaymentFormValid = false
    }
    else {
        setFormSuccess(paymentFormCardCvv);
    }
}

function handlePurchaseThankYouMessage(){
    if(isPaymentFormValid){
        thankyouMessageEl.innerHTML = `
        <div class="thankyou-message-content">
            <a href="#" class="logo-link">
                <span class="logo fw-semi-bold text-accent">TinyItalian</span>
                <span class="logo-slogan fw-medium text-secondary-accent">An Italian affair</span>
            </a>
            <p class="thankyou-costumer-name">Thank you for your order, <span class="fw-bold">${paymentFormUsername.value.trim()}!</span></p>
            <img src="/assets/img/cash-payment-animate.svg" class="animated-payment-svg">
            <p class="thankyou--go-back-btn fs-300 fw-medium text-main" id="thankyou--go-back-btn">← Go back</p>
        </div>
        `
        thankyouMessageEl.toggleAttribute('data-visible');
        basketPaymentForm.toggleAttribute('data-visible');

        basketItemsArray = [];
        renderMenu(menuArray);
        handleShoppingCartUiUpdate();
    }
}

renderMenu(menuArray);






