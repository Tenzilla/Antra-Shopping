const API = (() => {
  const URL = "http://localhost:3000";

  const doAjax = async (data, url, method) => {
    return new Promise(function (resolved, rejected) {
      const xhttp = new XMLHttpRequest();
      xhttp.open(method, url);
      xhttp.send(data);
      xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
          if (xhttp.status === 200) { resolved(xhttp.responseText); }
          else { rejected(xhttp.statusText); }
        }
      };
    });
  }

  const getCart = (view) => {
    doAjax("", `http://127.0.0.1:4051/get-cart`, "GET").then(
      res => {
        let cartData = JSON.parse(res);

        cart_item_cont_1 = document.createElement("div")
        cart_item_cont_2 = document.createElement("div")

        cart_item_cont_1.classList.add("each-cart")
        cart_item_cont_2.classList.add("each-cart")

        cart_item_cont_1.id = "apple-cart-cont"
        cart_item_cont_2.id = "orange-cart-cont"

        cart_item_cont_1.innerHTML = `Apple x ${cartData.data.apple} <button class="delete-from-cart" id="delete-apple-from-cart">delete</button>`
        cart_item_cont_2.innerHTML = `Orange x ${cartData.data.orange} <button class="delete-from-cart" id="delete-orange-from-cart">delete</button>`

        if (cartData.data.apple != 0) {
          view.cart_container_El.append(cart_item_cont_1)
        }
        if (cartData.data.orange != 0) {
          view.cart_container_El.append(cart_item_cont_2)
        }
      }
    )
  };

  const getInventory = (view) => {
    doAjax("", `http://127.0.0.1:4051/get-inventory`, "GET").then(
      res => {
        let inventoryData = JSON.parse(res);
        //console.log(inventoryData) 
      }
    )
  };

  const addToCart = (inventoryItem) => {
    const formData = new FormData();
    formData.append('item', inventoryItem.item)
    formData.append('count', inventoryItem.count)

    doAjax(formData, `http://127.0.0.1:4051/add-to-cart`, "POST").then(
      res => {
        window.location.reload()
      }
    )
  };

  const updateCart = (id, newAmount) => {
    // define your method to update an item in cart
  };

  const deleteFromCart = (item, view) => {
    const formData = new FormData();
    formData.append('item', item)

    doAjax(formData, `http://127.0.0.1:4051/delete-from-cart`, "DELETE").then(
      res => {

        window.location.reload()

        if (item == "Orange") {
          view.orange_cart_cont_El.style.display = "none"
        }
        else if (item == "apple") {
          view.apple_cart_cont_El.style.display = "none"
        }
      }
    )


  };

  const checkout = () => {
    // you don't need to add anything here
    return getCart().then((data) =>
      Promise.all(data.map((item) => deleteFromCart("*")))
    );
  };

  return {
    getCart,
    updateCart,
    getInventory,
    addToCart,
    deleteFromCart,
    checkout,
  };
})();

const Model = (() => {
  // implement your logic for Model
  class State {
    #onChange;
    #inventory;
    #cart;
    constructor() {
      this.#inventory = [];
      this.#cart = [];
    }
    get cart() {
      return this.#cart;
    }

    get inventory() {
      return this.#inventory;
    }

    set cart(newCart) { }
    set inventory(newInventory) { }

    subscribe(cb) { }
  }
  const {
    getCart,
    updateCart,
    getInventory,
    addToCart,
    deleteFromCart,
    checkout,
  } = API;
  return {
    State,
    getCart,
    updateCart,
    getInventory,
    addToCart,
    deleteFromCart,
    checkout,
  };
})();

const View = (() => {
  // implement your logic for View

  const add_apple_to_cart_El = document.querySelector("#add-apple-to-cart");
  const add_orange_to_cart_El = document.querySelector("#add-orange-to-cart");

  const increment_apple_El = document.querySelector("#increment_apple");
  const decrement_apple_El = document.querySelector("#decrement_apple");

  const increment_orange_El = document.querySelector("#increment_orange");
  const decrement_orange_El = document.querySelector("#decrement_orange");

  const apple_current_val_El = document.querySelector("#apple-current-val");
  const oranges_current_val_El = document.querySelector("#oranges-current-val");

  const cart_container_El = document.querySelector("#cart-container");

  const delete_apple_from_cart_El = document.querySelector("#delete-apple-from-cart");
  const delete_orange_from_cart_El = document.querySelector("#delete-orange-from-cart");

  const apple_cart_cont_El = document.querySelector("#apple-cart-cont");
  const orange_cart_cont_El = document.querySelector("#orange-cart-cont");


  return {
    add_apple_to_cart_El,
    add_orange_to_cart_El,

    apple_current_val_El,
    oranges_current_val_El,

    increment_apple_El, decrement_apple_El,
    increment_orange_El, decrement_orange_El,

    cart_container_El,
    delete_apple_from_cart_El,
    delete_orange_from_cart_El,

    apple_cart_cont_El,
    orange_cart_cont_El,
  };

})();



const Controller = ((model, view) => {
  // implement your logic for Controller
  const state = new model.State();

  const init = () => {

    //--get cart
    model.getCart(view)

    //--get inventory
    model.getInventory(view)

  };


  const handleUpdateAmount = () => {

    view.increment_apple_El.addEventListener("click", (event) => {
      view.apple_current_val_El.value = parseInt(view.apple_current_val_El.value) + 1
    })

    view.increment_orange_El.addEventListener("click", (event) => {
      view.oranges_current_val_El.value = parseInt(view.oranges_current_val_El.value) + 1
    })


    view.decrement_apple_El.addEventListener("click", (event) => {
      view.apple_current_val_El.value = parseInt(view.apple_current_val_El.value) - 1
    })

    view.decrement_orange_El.addEventListener("click", (event) => {
      view.oranges_current_val_El.value = parseInt(view.oranges_current_val_El.value) - 1
    })



  };

  const handleAddToCart = () => {

    view.add_apple_to_cart_El.addEventListener("click", (event) => {
      console.log("apple added to cart")
      console.log(view.apple_current_val_El.value)

      model.addToCart({ item: "Apple", count: parseInt(view.apple_current_val_El.value) })
      window.location.reload()
    })

    view.add_orange_to_cart_El.addEventListener("click", (event) => {
      console.log("orange added to cart")
      console.log(view.oranges_current_val_El.value)

      model.addToCart({ item: "Orange", count: view.oranges_current_val_El.value })
      window.location.reload()

    })


  };

  const handleDelete = () => {

    window.addEventListener("load", function () {

      if (document.querySelector("#delete-apple-from-cart")) {
        document.querySelector("#delete-apple-from-cart").addEventListener("click", (event) => {
          model.deleteFromCart("Apple", view)
          window.location.reload()
        })
      }

      if (document.querySelector("#delete-orange-from-cart")) {
        document.querySelector("#delete-orange-from-cart").addEventListener("click", (event) => {
          model.deleteFromCart("Orange", view)
          window.location.reload()
        })
      }

    })

  };

  const handleCheckout = () => { };

  const bootstrap = () => {
    init()
    handleUpdateAmount()
    handleAddToCart()
    handleDelete()
  };

  return { bootstrap, };
})(Model, View);

Controller.bootstrap();
