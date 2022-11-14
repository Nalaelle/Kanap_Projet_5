const urlProduit = "http://localhost:3000/api/products";
// // récupération Api et Id


let params = new URLSearchParams(document.location.search);
const id = params.get("id"); 

let appelApi = "http://localhost:3000/api/products"+"/"+id;

fetch(appelApi)
    .then(function(res) {
        if (res.ok) {
            // console.log(res);
            return res.json();            
        }
    })
    .then(function(produit) {
        console.log(produit);
        callValue(produit);
    })
    // .then(callValue)
    .catch(function(err) {
        console.log("Une erreur est survenue !!");
        console.log(err);
    });

let boxImg = document.querySelector(".item__img");
let img = document.createElement("img");
boxImg.appendChild(img); 

let title = document.getElementById("title");
let price = document.getElementById("price");

let description = document.getElementById("description");
let optionColors = document.querySelector("#colors");


function callValue(produit) {
    for (let i in produit) {                   
        img.setAttribute("src",produit.imageUrl);
        img.setAttribute("alt",produit.altTxt);
        
        title.textContent = produit.name;        
        price.textContent = produit.price;        
        description.textContent = produit.description;
    }     
    for (let choice of produit.colors) {
        optionColors.innerHTML += `<option i="${choice}">${choice}</option>`;
    }    
};

// **********************************************
//          Local Storage
// **********************************************
    // 1-déclarer les couleurs et quantites
    // 2- verifier les selections
    // 3- inserer dans l'objet
    // 4- pousser le tableau dans le localstorage 

let cart = [];

// 1-déclarer les couleurs et quantites
let eventColor = document.getElementById("colors");
let eventQuantity = document.getElementById("quantity");

let objectCart = {
    Id: id,
    Color: '',
    Quantity: 0
};

eventColor.addEventListener('change', function(){
    return objectCart.Color = eventColor.value;    
});
eventQuantity.addEventListener('change', function(){
    let number = parseInt(eventQuantity.value);
    return objectCart.Quantity = number;
});
// 
console.log(objectCart);

// 2-verifier les selections //

function validation(){
    let cart = objectCart;
    let Qty = cart.Quantity;
    let validCart;

    if ( Qty === NaN || cart.Color === 'color' || cart.Color === ''){
    validCart = false;
    }else{
        if (Qty < 1 || Qty > 100 || Qty == 0){
            validCart = false;
        }else{        
            if (cart.Quantity === undefined || cart.Color === undefined){
                validCart = false;
            }else{        
                validCart = true;
            }
        }
    }
    if (validCart){
        alert('Votre couleur et votre quantité sont validées');
        return validCart;
    }else{
        alert('nooooooooooon');
        return validCart;
    }     
}

//  4- pousser le tableau dans le localstorage //
function saveCart(cart){  
    console.log(cart);
    return localStorage.setItem('cart',JSON.stringify(cart));
};
//  Recupere le local storage
function getCart(){
    let cart = localStorage.getItem('cart');
    if (cart == null){ return [];}
    else {return JSON.parse((cart));};    
};
// 
// ecoute le bouton "ajouter au panier"
const button = document.getElementById('addToCart');
button.addEventListener('click',function listenButton(){
    console.log(objectCart);
    let X = objectCart;
    if (validation(X)){
        cart = getCart();
        checkProduct(X);   
    };   
});  

// 3- inserer dans l'objet //
function checkProduct(){
    cart = getCart();
    let X = objectCart;
    let test = false;
    cart.forEach(element => {
        console.log(element.Id);
        if (element.Id === X.Id && element.Color === X.Color){
            element.Quantity = element.Quantity + X.Quantity
            test = true;
            console.log(test);          
        }      
    });
    if (test){        
        saveCart(cart); 
    }else{     
        cart.push(X);  
        saveCart(cart); 
    }
    console.log(test)   
};
