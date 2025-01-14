document.addEventListener("DOMContentLoaded", function(event) {
    cart = document.getElementById("cart");

    function closeCart(){
        cart.style.visibility = "hidden";
    }
    function openCart(){
        cart.style.visibility = "visible";
        cart.scrollIntoView(false);
    }

    document.getElementById("btn-cart-close").onclick = function(event){
        closeCart();
    };
    document.getElementById("continue-shopping").onclick = function(event){
        closeCart();
    };
    document.getElementById("cart-empty-continue").onclick = function(event){
        closeCart();
    }
    document.getElementById("nav-cart").onclick = function(event){
        if(cart.style.visibility != "visible")
            openCart();
        else
            closeCart();
    };
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }


    var cart_items = document.getElementById('cart-items');
    var total_price_el = document.getElementById("total-price");
    var cart_content = document.getElementsByClassName('cart-content')[0]
    var cart_empty = document.getElementsByClassName('cart-empty')[0]

    var remove_cart_forms = document.getElementsByClassName('cart-item-delete-form');
    function removeCartEventHandler(event){
        event.preventDefault();

        const csrftoken = getCookie('csrftoken');

        url = this.action;
        fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrftoken,
            },
        })
        .then(response => response.json())
        .then(json => removeCartRender(json));
    };
    function removeCartRender(data){
        toastr.info(data['message']);
        total_price_el.innerText = `${Number(data['total_price'])} грн`;

        cart_item = document.getElementById(`cart-item-${data['slug']}`)
        cart_items.removeChild(cart_item);

        if (data['cart_is_empty']){
            cart_content.classList.add('disabled')
            cart_empty.classList.remove('disabled')
        }
    }

    for (var i = 0; i < remove_cart_forms.length; i++) {
        remove_cart_forms[i].addEventListener('submit', removeCartEventHandler);
    }

    var add_cart_forms = document.getElementsByClassName('add_cart_form');
    function addCartEventHandler(event) {
        event.preventDefault();

        const csrftoken = getCookie('csrftoken');

        url = this.action;
        fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrftoken,
            },
        })
        .then(response => response.json())
        .then(json => addCartRender(json));
    }
    function addCartRender(data){
        toastr.success(data['message']);

        if (data['cart_was_empty']){
            cart_content.classList.remove('disabled')
            cart_empty.classList.add('disabled')
        }

        if (data['quantity'] == 1){
            var cart_item = document.createElement("div");
            cart_item.classList.add("cart-item");
            cart_item.id = `cart-item-${data['slug']}`

            cart_item.innerHTML =
            `<div class="cart-item-img-wrap">
                    <a href="${data['absolute_url']}">
                        <img src="${data['photo']}" width=100% height=100% alt="${data['title']}">
                    </a>
                </div>
            <div class="cart-item-description">
                <a class="product-ref" href="${data['absolute_url']}">
                    <div class="cart-item-brand">${data['brand']}</div>
                    <div class="cart-item-title">${data['title']}</div>
                </a>
            </div>
            <div class="cart-item-price">${data['price']}грн</div>
            <div id="item-${data['slug']}-count" class="cart-item-count">${data['quantity']}</div>
            <div id="item-${data['slug']}-totalprice" class="cart-item-totalprice">
                ${data['total_it_price']}грн
            </div>
            <form action="${data['remove_cart_url']}" method="post" class="cart-item-delete-form"
                  id="item-${data['slug']}-delete">
                <button type="submit" class="cart-item-delete">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"><path fill-rule="evenodd" d="M38.6,38.6 L38.6,59.4 C38.6,60.8359403 37.4359403,62 36,62 C34.5640597,62 33.4,60.8359403 33.4,59.4 L33.4,38.6 L12.6,38.6 C11.1640597,38.6 10,37.4359403 10,36 C10,34.5640597 11.1640597,33.4 12.6,33.4 L33.4,33.4 L33.4,12.6 C33.4,11.1640597 34.5640597,10 36,10 C37.4359403,10 38.6,11.1640597 38.6,12.6 L38.6,33.4 L59.4,33.4 C60.8359403,33.4 62,34.5640597 62,36 C62,37.4359403 60.8359403,38.6 59.4,38.6 L38.6,38.6 Z" transform="rotate(45 36 36)"></path></svg>
                </button>
            </form>`

            cart_items.appendChild(cart_item);

            document.getElementById(`item-${data['slug']}-delete`).addEventListener('submit', removeCartEventHandler);
        }
        else{
            document.getElementById(`item-${data['slug']}-count`).innerText = data['quantity'];
            document.getElementById(`item-${data['slug']}-totalprice`).innerText = `${data['total_it_price']}грн`;
        }

        total_price_el.innerText = `${Number(data['total_price'])} грн`;
    }

    for (var i = 0; i < add_cart_forms.length; i++) {
        add_cart_forms[i].addEventListener('submit', addCartEventHandler);
    }
});