if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

var checkoutCover = document.getElementById("checkoutCover");
var coverCancel = document.getElementById("coverCancel");

function ready() {
  var removeCartItemButton = document.getElementsByClassName("button-danger");
  for (i = 0; i < removeCartItemButton.length; i++) {
    var button = removeCartItemButton[i];
    button.addEventListener("click", removeCartItem);
  }

  var quantityInputs = document.getElementsByClassName("cart-quantity");
  for (i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }

  var addToCartButton = document.getElementsByClassName("addCart")[0];
  addToCartButton.addEventListener("click", addToCartClicked);

  var checkoutButton = document.getElementsByClassName("checkout")[0];
  checkoutButton.addEventListener("click", checkoutPop);

  var checkoutButtonFinal = document.getElementsByClassName("finalCheckout")[0];
  checkoutButtonFinal.addEventListener("click", () => {
    var cart = [];
    var cartQty = document.getElementsByClassName("cart-quantity");
    for (i = 0; i < cartQty.length; i++) {
      cart.push({ id: i + 1, quantity: parseFloat(cartQty[i].value) });
    }
    updateCartTotal();
    fetch("/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: cart,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      })
      .then(({ url }) => {
        console.log(url);
        //window.location = url;
      })
      .catch((e) => {
        console.error(e.error);
      });
  });
  updateCartTotal();
}

function checkoutPop() {
  var cartItems = document.getElementsByClassName("cart")[0];
  if (cartItems.hasChildNodes()) {
    var qty = 0;
    var cartQty = document.getElementsByClassName("cart-quantity");
    for (i = 0; i < cartQty.length; i++) {
      qty += parseFloat(cartQty[i].value);
    }

    if (qty === 1) {
      document.getElementById("checkoutPara").innerHTML =
        "You are checking out a total of " +
        qty +
        " item. Proceed to checkout!";
    } else if (qty > 40) {
      document.getElementById("coverCancelPara").innerHTML =
        "You have exceeded the number of custom covers in 1 purchase (40 max). Please contact ??? for further inquiries.";
      coverCancel.style.display = "block";
      var span = document.getElementsByClassName("closeButton")[0];
      span.onclick = function () {
        coverCancel.style.display = "none";
      };
      return;
    } else {
      document.getElementById("checkoutPara").innerHTML =
        "You are checking out a total of " +
        qty +
        " items. Proceed to checkout!";
    }

    checkoutCover.style.display = "block";
    var span = document.getElementsByClassName("cancelButton")[0];
    span.onclick = function () {
      checkoutCover.style.display = "none";
    };
  } else {
    document.getElementById("coverCancelPara").innerHTML =
      "Cart empty! Please upload a custom cover and add to cart before checkout.";
    coverCancel.style.display = "block";
    var span = document.getElementsByClassName("closeButton")[0];
    span.onclick = function () {
      coverCancel.style.display = "none";
    };
  }
}

function removeCartItem(event) {
  var buttonClicked = event.target;
  buttonClicked.parentElement.remove();
  updateCartTotal();
}

function quantityChanged(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateCartTotal();
}

function addToCartClicked(event) {
  var cartRow = document.createElement("div");
  cartRow.classList.add("Cart-Items");
  var cartItems = document.getElementsByClassName("cart")[0];
  var imageSrc = document.getElementsByClassName("Cart-Items");

  if (cartItems.childElementCount >= 20) {
    document.getElementById("coverCancelPara").innerHTML =
      "You have exceeded the number of custom covers in 1 purchase. Please continue to checkout and make another order.";
    coverCancel.style.display = "block";
    var span = document.getElementsByClassName("closeButton")[0];
    span.onclick = function () {
      coverCancel.style.display = "none";
    };
    return;
  }

  if (uploaded_image == "") {
    document.getElementById("coverCancelPara").innerHTML =
      "Please upload a custom cover for your mini switch game case before adding to cart!";
    coverCancel.style.display = "block";
    var span = document.getElementsByClassName("closeButton")[0];
    span.onclick = function () {
      coverCancel.style.display = "none";
    };
    return;
  }
  for (i = 0; i < imageSrc.length; i++) {
    if (
      imageSrc[i].getElementsByClassName("image-upload")[0].src ==
      uploaded_image
    ) {
      document.getElementById("coverCancelPara").innerHTML =
        "You have added this cover already! Adjust quantity in the cart section.";
      coverCancel.style.display = "block";
      var span = document.getElementsByClassName("closeButton")[0];
      span.onclick = function () {
        coverCancel.style.display = "none";
      };
      return;
    }
  }
  var cartRowContents = `
  <div class="image-box"><img class="image-upload" src="${uploaded_image}" /></div>
  <div id="spacer"></div>
  <div class="counter">
    <p id="qty">Qty:</p>
    <input class="cart-quantity cartText" type="number" value="1" />
  </div>
  <div class="price cartText">$10</div>
  <div class="button-danger">Remove</div>`;
  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);
  cartRow
    .getElementsByClassName("button-danger")[0]
    .addEventListener("click", removeCartItem);
  cartRow
    .getElementsByClassName("cart-quantity")[0]
    .addEventListener("change", quantityChanged);
  updateCartTotal();
}

function updateCartTotal() {
  var cartItemContainer = document.getElementsByClassName("cart")[0];
  var cartRows = cartItemContainer.getElementsByClassName("Cart-Items");
  var total = 0;
  for (i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i];
    var priceElement = cartRow.getElementsByClassName("price")[0];
    var quantityElement = cartRow.getElementsByClassName("cart-quantity")[0];

    var price = parseFloat(priceElement.innerText.replace("$", ""));
    var quantity = quantityElement.value;
    total = total + price * quantity;
  }
  total = Math.round(total * 100) / 100;
  document.getElementsByClassName("totalPrice")[0].innerText =
    "Your Total is: $" + total;
}

const image_input = document.querySelector("#image_input");
var uploaded_image = "";

image_input.addEventListener("change", function () {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    uploaded_image = reader.result;
    document.querySelector(
      "#display_image"
    ).style.backgroundImage = `url(${uploaded_image})`;
  });
  reader.readAsDataURL(this.files[0]);
});

function showSpineGuide() {
  var x = document.getElementById("vll");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

/*var stripeHander = StripeCheckout.configure({
  key: stripePublicKey,
  locale: "auto",
  token: function (token) {
    console.log(token);
  },
});*/

function purchaseClicked() {
  console.log("Clicked Pay");
  /*alert("谢谢");
  var cartItems = document.getElementsByClassName("cart")[0];
  while (cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild);
  }
  updateCartTotal();
  var priceElement = document.getElementsByClassName("totalPrice")[0];
  var price =
    parseFloat(priceElement.innerText.replace("Your Total is: $", "")) * 100;
  stripeHandler.open({
    amount: price,
  });*/
}

function googleSignin() {
  googleSign = document.getElementById("googleSign");
  googleSign.style.display = "block";
  var span = document.getElementsByClassName("closeSignin")[0];
  span.onclick = function () {
    googleSign.style.display = "none";
  };
}

function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;
  console.log(id_token);
}
