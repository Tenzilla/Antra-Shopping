const API = (() => {
  const URL = "http://localhost:3000";

  const doAjax = async ( data, url, method ) => {
    return new Promise(function(resolved, rejected){
        const xhttp = new XMLHttpRequest();
        xhttp.open(method, url);
        xhttp.send(data);
        xhttp.onreadystatechange = ()=>{
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) { resolved(xhttp.responseText); } 
                else { rejected(xhttp.statusText); }
            }
        };
    });
  }

  const getCart = () => {
    // define your method to get cart data
  };

  const getInventory = () => {
    // define your method to get inventory data
  };

  const addToCart = (inventoryItem) => {
    // define your method to add an item to cart

    const formData = new FormData(); 
    formData.append( 'item', inventoryItem.item )
    formData.append( 'count', inventoryItem.count )

    doAjax( formData, "http://127.0.0.1:80/add-to-cart", "POST" ).then( 
      res => { console.log(res) }
    )
  };

  const updateCart = (id, newAmount) => {
    // define your method to update an item in cart
  };

  const deleteFromCart = (id) => {
    // define your method to delete an item in cart
  };

  const checkout = () => {
    // you don't need to add anything here
    return getCart().then((data) =>
      Promise.all(data.map((item) => deleteFromCart(item.id)))
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

    set cart(newCart) {}
    set inventory(newInventory) {}

    subscribe(cb) {}
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

  //const _El = document.querySelector("");

  return { 
    add_apple_to_cart_El, 
    add_orange_to_cart_El, 
    
    apple_current_val_El, 
    oranges_current_val_El,
    
    increment_apple_El, decrement_apple_El,
    increment_orange_El, decrement_orange_El,
  };
})();

const Controller = ((model, view) => {
  // implement your logic for Controller
  const state = new model.State();

  const init = () => {};

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

        model.addToCart({ item: "Apple", count: parseInt(view.apple_current_val_El.value) }).then((data) => {
          console.log(data)
        })
    })

    view.add_orange_to_cart_El.addEventListener("click", (event) => {
        console.log("orange added to cart")
        console.log(view.oranges_current_val_El.value)

        model.addToCart({ item: "Orange", count: parseInt(view.oranges_current_val_El.value) }).then((data) => {
          console.log(data)
        })
    })

  };

  const handleDelete = () => {};

  const handleCheckout = () => {};

  const bootstrap = () => {
    init()
    handleUpdateAmount()
    handleAddToCart()
  };

  return { bootstrap, };
})(Model, View);

Controller.bootstrap();
