import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import { menuArray } from './data.js';

let basketItemsArray = [];

const navToggleEl = document.getElementById('mobile-nav-toggle');
const primaryNavEL = document.getElementById('primary-navigation');
const menuSectionEl = document.getElementById('menu-section');
const basketContentEl = document.getElementById('basket--content');
const basketEmptyEl = document.getElementById('basket--empty');
const menuItemsEl = document.getElementById('menu-items');

navToggleEl.addEventListener('click', () => {
    if (primaryNavEL.hasAttribute("data-visible")){
        navToggleEl.setAttribute("aria-expanded", false);
    }
    else {
        navToggleEl.setAttribute("aria-expanded", true);
    }
    primaryNavEL.toggleAttribute("data-visible");
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
});

basketEmptyEl.addEventListener('click', (e) => {
    if(e.target.classList.contains('basket--continue-shopping')){
        handleContinueShoppingBtnClick();
    }
});

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
        <img src="/assets/img/shopping-cart-icon.svg" alt="A shopping cart icon" class="card-cart">
        <span class="card--how-many-items fs-200 fw-medium clr-white show">
            ${getBasketItemCountTotal()}
        </span>
        `
    });

    navShoppingCartEl.innerHTML = `
        <img src="/assets/img/shopping-cart-icon.svg" alt="A shopping cart icon" class="shopping-cart-icon">
        <span class="nav--how-many-items fs-200 fw-medium clr-white show">
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

function getMenuHtml(){
    let htmlMenu = ``

    menuArray.forEach( (item) => {
        htmlMenu += `
        <div class="card-menu">    
            <div class="card-inner">
                <img src="${item.itemImage}" alt="${item.alt}" class="card-img">
                <img src="/assets/img/stars-rating.svg" alt="Five yellow starts rating" class="card-rating">
                <div class="card--item-count">
                    <img src="/assets/img/shopping-cart-icon.svg" alt="A shopping cart icon" class="card-cart">
                    <span class="card--how-many-items fs-200 fw-medium clr-white hidden">
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

function renderMenu(){
    menuItemsEl.innerHTML = getMenuHtml();
}

renderMenu();
