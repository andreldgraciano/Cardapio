const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address-input");
const addressWarn = document.getElementById("address-warning");
const emptyWarn = document.getElementById("empty-warning");
const dateVerify = document.getElementById("date-span");
const banner = document.getElementById("banner");
const quantityElements = document.querySelectorAll('.product-quantity');
let paymentValue = document.querySelector('input[name="payment"]:checked').value;


// FIXXX
function updatePayment() {
    const selectedPayment = document.querySelector('input[name="payment"]:checked').value;
    paymentValue = selectedPayment;
}

let cart = [];

// Abrir modal
cartBtn.addEventListener("click", function () {
    hideWarnings();
    updateCartModal();
    cartModal.style.display = "flex";
});

// Fechar modal
closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none";
});

cartModal.addEventListener("click", function (event) {
    // Fechar o modal quando clicar fora
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    };

    // Adicionar ou remover quantidade de produtos do carrinho no modal
    let parentAddButton = event.target.closest(".add-to-cart-btn");
    let parentRemoveButton = event.target.closest(".remove-from-cart-btn");

    if (parentAddButton) {
        console.log(parentAddButton);
        const name = parentAddButton.getAttribute("data-name");
        const price = parseFloat(parentAddButton.getAttribute("data-price"));
        addToCart(name, price);
    }

    if (parentRemoveButton) {
        console.log(parentRemoveButton);
        const name = parentRemoveButton.getAttribute("data-name");
        RemoveToCart(name);
    }
});

menu.addEventListener("click", function (event) {
    let parentAddButton = event.target.closest(".add-to-cart-btn");
    let parentRemoveButton = event.target.closest(".remove-from-cart-btn");

    if (parentAddButton) {
        const name = parentAddButton.getAttribute("data-name");
        const price = parseFloat(parentAddButton.getAttribute("data-price"));
        addToCart(name, price);
    }

    if (parentRemoveButton) {
        const name = parentRemoveButton.getAttribute("data-name");
        RemoveToCart(name);
    }
});

// Funcão para adicionar no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    const quantitySpan = document.querySelector(`.product-quantity[data-name="${name}"]`);

    if (existingItem) {
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

    if (existingItem && existingItem.quantity > 1) {
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

addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue != "") {
        addressWarn.classList.add("hidden");
    }
});


/*
 * LIMPAR CARRINHO APOS ENVIAR WPP E FECHAR MODAL
 */
checkoutBtn.addEventListener("click", function () {
    hideWarnings();

    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
        alert("Lamentamos. Fora do horário de atendimento.");
        cartModal.style.display = "none";
        return;
    }

    if (cart.length === 0) {
        emptyWarn.classList.remove("hidden");
        return;
    }

    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        return;
    }

    const cartItems = cart.map((item) => {
        return `${item.quantity} x ${item.name} (R$ ${item.price}) - R$ ${item.price * item.quantity}`;
    }).join("\n");


    // Mudar Telefone
    const message = `*Itens no carrinho:*\n${cartItems}`;
    const encodedMessage = encodeURIComponent(message);
    const phone = "5533991680233";
    const total = cartTotal.textContent;
    const address = addressInput.value;

    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        // resetApp();
        window.open(`https://wa.me/${phone}?text=${encodedMessage}%0A%0AEndereço: *${address}*%0AForma de Pagamento: *${paymentValue}*%0ATotal: *${total}*`, "_blank");
    } else { 
        // resetApp();
        window.open(`https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}%0A%0AEndereço: *${address}*%0AForma de Pagamento: *${paymentValue}*%0ATotal: *${total}*`, "_blank");
    }

    // window.open(`https://wa.me/${phone}?phone=${phone}&text=${encodedMessage}%0AEndereço: ${addressInput.value}%0A *Total: ${total}* `, "_blank");

    // window.open(`https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}%0AEndereço: ${addressInput.value}%0A *Total: ${total}* `, "_blank");

    cartModal.style.display = "none";
});

function resetApp() {
    cart.length = 0;
    cart.forEach(item => {
        item.quantity = 0;
    });
    quantityElements.forEach(element => {
        element.textContent = '0';
    });
    updateCartModal();
    addressInput.value = "";
}

function hideWarnings() {
    addressWarn.classList.add("hidden");
    emptyWarn.classList.add("hidden");
}

function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 1 && hora < 23;
}

const isOpen = checkRestaurantOpen();

if (isOpen) {
    dateVerify.classList.remove("bg-red-700");
    dateVerify.classList.add("bg-green-600");
    cartBtn.removeAttribute("disabled");
    banner.classList.remove("saturate-[1.7]");
} else {
    dateVerify.classList.remove("bg-green-600");
    dateVerify.classList.add("bg-red-700");
    cartBtn.setAttribute("disabled", true);
    banner.classList.add("saturate-[0.3]");
}