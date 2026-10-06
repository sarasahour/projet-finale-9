document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       CART STORAGE
    ===================================================== */

    let cart = [];

    try {
        cart = JSON.parse(localStorage.getItem("saramelCart")) || [];
    } catch (error) {
        cart = [];
    }


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const basket = document.querySelector(".basket");
    const cartCount = document.querySelector(".basket small");


    /* =====================================================
       SAVE CART
    ===================================================== */

    function saveCart() {
        localStorage.setItem(
            "saramelCart",
            JSON.stringify(cart)
        );
    }


    /* =====================================================
       UPDATE CART COUNT
    ===================================================== */

    function updateCartCount() {

        if (!cartCount) {
            return;
        }

        const totalQuantity = cart.reduce(function (total, product) {

            return total + Number(product.quantity || 0);

        }, 0);

        cartCount.textContent = totalQuantity;
    }


    /* =====================================================
       SHOW MESSAGE
    ===================================================== */

    function showMessage(message) {

        const oldMessage =
            document.querySelector(".cart-message");

        if (oldMessage) {
            oldMessage.remove();
        }


        const messageBox =
            document.createElement("div");

        messageBox.className = "cart-message";

        messageBox.textContent = message;


        messageBox.style.position = "fixed";
        messageBox.style.right = "25px";
        messageBox.style.bottom = "25px";
        messageBox.style.zIndex = "99999";
        messageBox.style.background = "#3e443c";
        messageBox.style.color = "#ffffff";
        messageBox.style.padding = "15px 22px";
        messageBox.style.borderRadius = "6px";
        messageBox.style.fontSize = "14px";
        messageBox.style.boxShadow =
            "0 5px 20px rgba(0,0,0,0.2)";


        document.body.appendChild(messageBox);


        setTimeout(function () {

            messageBox.style.opacity = "0";
            messageBox.style.transition =
                "opacity 0.4s ease";

            setTimeout(function () {

                messageBox.remove();

            }, 400);

        }, 1800);
    }


    /* =====================================================
       ADD PRODUCT TO CART
    ===================================================== */

    function addToCart(product) {

        const existingProduct = cart.find(function (item) {

            return item.id === product.id;

        });


        if (existingProduct) {

            existingProduct.quantity =
                Number(existingProduct.quantity || 0) + 1;

        } else {

            cart.push({

                id: product.id,

                name: product.name,

                price: Number(product.price),

                image: product.image,

                quantity: 1

            });

        }


        saveCart();

        updateCartCount();

        showMessage(
            product.name + " has been added to your cart."
        );
    }


    /* =====================================================
       PRODUCT BUTTONS
    ===================================================== */

    const productButtons =
        document.querySelectorAll(".discover-button");


    productButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const productCard =
                button.closest(".product-card");


            if (!productCard) {
                return;
            }


            const productNameElement =
                productCard.querySelector(".product-info h3");


            const priceElement =
                productCard.querySelector(".price");


            const imageElement =
                productCard.querySelector(".product-image img");


            if (
                !productNameElement ||
                !priceElement ||
                !imageElement
            ) {

                console.error(
                    "Product information is missing."
                );

                return;
            }


            /* ---------------------------------------------
               PRODUCT ID
            --------------------------------------------- */

            let productId =
                productCard.dataset.productId;


            if (!productId) {

                productId =
                    productNameElement.textContent
                    .trim()
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "");

            }


            /* ---------------------------------------------
               PRODUCT NAME
            --------------------------------------------- */

            const productName =
                productNameElement.textContent.trim();


            /* ---------------------------------------------
               PRODUCT PRICE
            --------------------------------------------- */

            /*
                IMPORTANT:
                We remove the € / £ / $ symbol and
                convert the remaining value to a number.
            */

            const rawPrice =
                priceElement.dataset.price ||
                priceElement.textContent;


            const cleanPrice =
                rawPrice
                    .replace(",", ".")
                    .replace(/[^\d.]/g, "");


            const productPrice =
                parseFloat(cleanPrice);


            if (isNaN(productPrice)) {

                console.error(
                    "Invalid product price:",
                    rawPrice
                );

                alert(
                    "There is a problem with the price of this product."
                );

                return;
            }


            /* ---------------------------------------------
               PRODUCT IMAGE
            --------------------------------------------- */

            const productImage =
                imageElement.getAttribute("src");


            /* ---------------------------------------------
               PRODUCT OBJECT
            --------------------------------------------- */

            const product = {

                id: productId,

                name: productName,

                price: productPrice,

                image: productImage,

                quantity: 1

            };


            /* ---------------------------------------------
               ADD TO CART
            --------------------------------------------- */

            addToCart(product);

        });

    });


    /* =====================================================
       BASKET
    ===================================================== */

    if (basket) {

        basket.addEventListener("click", function () {

            window.location.href = "cart.html";

        });


        basket.addEventListener("keydown", function (event) {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                window.location.href = "cart.html";

            }

        });

    }


    /* =====================================================
       AVAILABILITY FILTER
    ===================================================== */

    const inStockFilter =
        document.getElementById("inStockFilter");

    const outStockFilter =
        document.getElementById("outStockFilter");

    const productCards =
        document.querySelectorAll(".product-card");


    function updateProductFilter() {

        const showInStock =
            inStockFilter &&
            inStockFilter.checked;


        const showOutStock =
            outStockFilter &&
            outStockFilter.checked;


        productCards.forEach(function (card) {

            const availability =
                card.dataset.availability;


            if (!showInStock && !showOutStock) {

                card.style.display = "";

                return;
            }


            if (
                availability === "in-stock" &&
                showInStock
            ) {

                card.style.display = "";

                return;
            }


            if (
                availability === "out-stock" &&
                showOutStock
            ) {

                card.style.display = "";

                return;
            }


            card.style.display = "none";

        });

    }


    if (inStockFilter) {

        inStockFilter.addEventListener(
            "change",
            updateProductFilter
        );

    }


    if (outStockFilter) {

        outStockFilter.addEventListener(
            "change",
            updateProductFilter
        );

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    updateCartCount();

});