const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("");
const addresWarn = document.getElementById("address-warning");

let cart = [];

// Abrir modal
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex";
});

// Fechar modal
closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none";
});

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal){
        cartModal.style.display = "none";
    };

    let parentAddButton = event.target.closest(".add-to-cart-btn");
    let parentRemoveButton = event.target.closest(".remove-from-cart-btn");
    
    if(parentAddButton) {
        console.log(parentAddButton);
        const name = parentAddButton.getAttribute("data-name");
        const price = parseFloat(parentAddButton.getAttribute("data-price"));
        addToCart(name, price);
    }
    
    if(parentRemoveButton) {
        console.log(parentRemoveButton);
        const name = parentRemoveButton.getAttribute("data-name");
        RemoveToCart(name);
    }
});

menu.addEventListener("click", function(event) {
    let parentAddButton = event.target.closest(".add-to-cart-btn");
    let parentRemoveButton = event.target.closest(".remove-from-cart-btn");
    
    if(parentAddButton) {
        const name = parentAddButton.getAttribute("data-name");
        const price = parseFloat(parentAddButton.getAttribute("data-price"));
        addToCart(name, price);
    }

    if(parentRemoveButton) {
        const name = parentRemoveButton.getAttribute("data-name");
        RemoveToCart(name);
    }
});

// Funcão para adicionar no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    const quantitySpan = document.querySelector(`.product-quantity[data-name="${name}"]`);

    if(existingItem) {
        existingItem.quantity += 1;
        quantitySpan.textContent = existingItem.quantity;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        });
        quantitySpan.textContent = 1;
    }

    updateCartModal();
};

// Funcão para remover no carrinho
function RemoveToCart(name) {
    const existingItem = cart.find(item => item.name === name);
    const quantitySpan = document.querySelector(`.product-quantity[data-name="${name}"]`);

    if(existingItem && existingItem.quantity > 1) {
        existingItem.quantity -= 1;
        quantitySpan.textContent = existingItem.quantity;
    } else if (existingItem && existingItem.quantity === 1) {
        const itemNameToRemove = existingItem.name;
        const indexToRemove = cart.findIndex(item => item.name === itemNameToRemove);
        if (indexToRemove !== -1) {
            cart.splice(indexToRemove, 1);
            quantitySpan.textContent = 0;
        }
    } else {
        console.log("Item não encontrado no carrinho.");
    }

    updateCartModal();
};

// Atualiza o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "flex-col", "space-y-1");

        cartItemElement.innerHTML = `
            <p class = "font-semibold">${item.name}</p>
            <div class="flex items-center">
                <p class="flex-1">${item.price.toLocaleString('pt-BR', { style: "currency", currency: "BRL" })}</p>
                <div class="flex justify-center flex-1 gap-4">
                    <button class="remove-from-cart-btn border rounded-md px-1 shadow" data-name="${item.name}" data-price=${item.price}>
                        <i class="fa-solid fa-minus"></i>
                    </button>
                    ${String(item.quantity).padStart(2, '0')}
                    <button class="add-to-cart-btn border rounded-md px-1 shadow" data-name="${item.name}" data-price=${item.price}>
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
                <p class="w-16 flex-1 text-end">${(item.quantity * item.price).toLocaleString('pt-BR', { style: "currency", currency: "BRL" })}</p>
            </div>
        `;

        total += item.price * item.quantity;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    cartTotal.textContent = total.toLocaleString('pt-BR', { style: "currency", currency: "BRL" });

    cartCounter.innerHTML = cart.length;
};