import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import { menuArray } from './data.js';

let basketItemsArray = [];

const navToggleEl = document.querySelector(".mobile-nav-toggle");
const primaryNavEL = document.querySelector(".primary-navigation");

navToggleEl.addEventListener('click', () => {
    if (primaryNavEL.hasAttribute("data-visible")){
        navToggleEl.setAttribute("aria-expanded", false);
    }
    else {
        navToggleEl.setAttribute("aria-expanded", true);
    }
    primaryNavEL.toggleAttribute("data-visible");
});

document.getElementById('menu-items').addEventListener('click', (e) => {
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
    })

    if(getBasketItemCountTotal() === 0){
        const itemCountSpanEl = document.querySelectorAll('.card--how-many-items');

        itemCountSpanEl.forEach( (span) => {
            span.classList.remove('show');
            span.classList.add('hidden');
        })
    }
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

function renderMenu(){
    document.getElementById('menu-items').innerHTML = getMenuHtml();
}

renderMenu();
