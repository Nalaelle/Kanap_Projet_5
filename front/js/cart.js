//**************  Declaration des élements *******************//
const urlProduit = "http://localhost:3000/api/products";
const cartItems = document.getElementById('cart__items');

class produit {
    constructor (id,name,color,urlImg,altImg,description,price,Qty){
        this.id = id;
        this.name = name;
        this.color = color;
        this.urlImg = urlImg;
        this.altImg = altImg;
        this.description = description;
        this.price = price;
        this.Qty = Qty;
    }
};

let boite = [];
let cart = getCart();
testCart();

//**************  Check LS *******************//
function testCart(){
    if (cart[0] != null){
        recupData();             
    }else{
        const pannierVide = document.createElement("p");
        cartItems.appendChild(pannierVide);
        pannierVide.textContent = "Votre pannier est vide, Veuillez sélectionner au moins un article.";  
        cart = null; 
    };
}

//**************  Récupère les données du back end en fonction des produit du LS *******************//
function recupData(){
    cart = getCart();
    for (let i of cart){     
        fetch(urlProduit+'/'+i.Id)
            .then(function(res) {
                if (res.ok) {                 
                    return res.json();            
                }
            })
            .then(function(y){
                const products = new produit (y._id,y.name,i.Color,y.imageUrl,y.altTxt,y.description,y.price,i.Quantity);
                boite.push(products);
                articlePrint(products);
            })
            .catch(function(err) {
                console.log("Une erreur est survenue !!");
                console.log(err)
            });             
    }
}

//**************  Fonction qui affiche les produits du panier et appel les autres fonctions nécessaires *******************//
function articlePrint(products){
        articleChoice(products);
        deleteProduct();
        PrintTotal();  
}

//  1- pousser le tableau dans le localstorage ******************************
function saveCart(cart){  
    // console.log(cart);
    return localStorage.setItem('cart',JSON.stringify(cart));
}
//  2- recuperer du localstorage ********************************************
function getCart(){
    let cart = localStorage.getItem('cart');
    if (cart == null){ return [];}
    else {return JSON.parse((cart));};    
}

//**************  Créer les produits dans le HTML  *******************//
function articleChoice(arg){
        let article = document.createElement("article");
        cartItems.appendChild(article);
        article.classList.add("cart__item");
        article.setAttribute("data-id",`${arg.id}`);
        article.setAttribute("data-color",`${arg.color}`);

        let divImg = document.createElement("div");
        article.appendChild(divImg);
        divImg.classList.add("cart__item__img");

        let img = document.createElement("img");
        divImg.appendChild(img);
        img.setAttribute("src",`${arg.urlImg}`);
        img.setAttribute("alt",`${arg.altImg}`);

        let divContent = document.createElement("div");
        article.appendChild(divContent);
        divContent.classList.add("cart__item__content");

        let divDescription = document.createElement("div");
        divContent.appendChild(divDescription);
        divDescription.classList.add("cart__item__content__description");

        let nameProduct = document.createElement("h2");
        divDescription.appendChild(nameProduct);
        nameProduct.textContent = arg.name;

        let pColor = document.createElement("p");
        divDescription.appendChild(pColor);
        pColor.textContent = `Couleur : ${arg.color}`;

        let pPrice = document.createElement("p");
        divDescription.appendChild(pPrice);
        pPrice.textContent = `Tarif : ${arg.price} €`;

        let divSettings = document.createElement("div");
        divContent.appendChild(divSettings);
        divSettings.classList.add("cart__item__content__settings");

        let divQuantity = document.createElement("div");
        divSettings.appendChild(divQuantity);
        divQuantity.classList.add("cart__item__content__settings__quantity");
        divQuantity.style = "padding-bottom: 16px;";

        let pQuantity = document.createElement("p");
        divQuantity.appendChild(pQuantity);
        pQuantity.textContent = "Qté : ";

        let inputQ = document.createElement("input");
        divQuantity.appendChild(inputQ);
        inputQ.classList.add("itemQuantity");
        inputQ.setAttribute("type","number");
        inputQ.setAttribute("name","itemQuantity");
        inputQ.setAttribute("min","1");
        inputQ.setAttribute("max","100");
        inputQ.setAttribute("value",`${arg.Qty}`);

        let divDelete = document.createElement("div");
        divSettings.appendChild(divDelete);
        divDelete.classList.add("cart__item__content__settings__delete");

        let pDelete = document.createElement("p");
        divDelete.appendChild(pDelete);
        pDelete.classList.add("deleteItem");
        pDelete.textContent = "Supprimer";
    // ********************** Ecoute de la quantité ********************************************        
        inputQ.addEventListener("input", () => updateQty(arg, parseInt(inputQ.value)));
}

//**************  Fonction qui met à jour la quantité dans LS et boite *******************//
function updateQty(arg, newValue){
    const produit = arg;
    const idProd = produit.id;
    const colorProd = produit.color;
    produit.Qty = newValue;
    console.log(produit.Qty);
    if (produit.Qty > 0 && produit.Qty <= 100 ){
        for (i in cart){
            if (cart[i].Id === idProd && cart[i].Color === colorProd){
                cart[i].Quantity = produit.Qty;
                saveCart(cart);
                if (boite[i].id === idProd && boite[i].color === colorProd){
                    boite[i].Qty = produit.Qty;
                }
            }
        }
        PrintTotal();
    }else{
        alert("La quantité choisie n'est pas valide");
        console.log('on fait le else');
        for (i in cart){
            if (cart[i].Id === idProd && cart[i].Color === colorProd){
                cart[i].Quantity = 1;
                saveCart(cart);
                if (boite[i].id === idProd && boite[i].color === colorProd){
                    boite[i].Qty = 1;
                }
            }
        }
        PrintTotal();
    };    
}

//**********Fonction qui affiche le prix total et la Q total *******************//
function PrintTotal(){
    let totalPrice = 0;
    let totalQuantity = 0;
    let a = 0; // vaut quantité de un produit
    let b = 0; // vaut prix de un produit    
    for (i in boite){
        b = boite[i].Qty*boite[i].price;
        totalPrice += b;
        a = boite[i].Qty;
        totalQuantity += a;
    };         
    const totalP = document.querySelector("#totalPrice");
    const totalQ = document.querySelector("#totalQuantity");
    totalP.textContent = totalPrice;
    totalQ.textContent = totalQuantity;
}

//**************  Fonction qui supprime un produit *******************//
function deleteProduct(){
    const btnDelete = document.querySelectorAll(".deleteItem");
    btnDelete.forEach((btn) => {
        btn.addEventListener("click", function(){            
            const article = btn.closest(".cart__item");           
            const articleId = article.dataset.id;
            const articleColor = article.dataset.color;
            article.remove();        
            let x;
            for (i in cart){                
                if (cart[i].Id == articleId && cart[i].Color == articleColor){
                    x = i;             
                    cart.splice(x,1);
                    saveCart(cart);
                    boite.splice(x,1);
                }
            };
            PrintTotal();     
        })
        // console.log('pour voir le nbr de tour');        
    })    
}

// ************  Fin ************  //
//  si il faut appeler les produits par groupes 
// let orderAlpha = cart.sort((a,b) => a.name.localeCompare(b.name))
//  ****************  FORMULAIRE *************************  //
let contact = {
    firstName : "",
    lastName : "",
    address : "",
    city : "",
    email : ""
};

let validBox = false;
// regex pour FirstName et LastName
let regexName = /^[a-zA-ZÂÀÈÉËÏÎéèëêïî'\s-][a-zA-ZÂÀÈÉËÏÎéèëêïîôç'\s-]{2,60}$/;

// *****FirstName
const firstName = document.getElementById("firstName");
const FN_error = document.getElementById("firstNameErrorMsg")
const FN_msg = " du prénom ";

firstName.addEventListener("change", function () {
    validationForm(this, regexName, FN_error, FN_msg);
    if (validBox === false){
        contact.firstName = "";
    }else{
        contact.firstName = this.value;       
    }
});

// *****LastName
const lastName = document.getElementById("lastName");
const LN_error = document.getElementById("lastNameErrorMsg");
const LN_msg = " du nom ";

lastName.addEventListener("change", function () {
    validationForm(this, regexName, LN_error, LN_msg);
    if (validBox === false){
        contact.lastName = "";
    }else{
        contact.lastName = this.value;        
    }
});

// *****Address
const address = document.getElementById("address");
const AddressError = document.getElementById("addressErrorMsg");
let AddressRegex = /^[a-zA-ZÂÀÈÉËÏÎéèëêïî0-9][0-9a-zA-Zàéèëêïîôç'\s-]{5,100}$/;
const AddressMsg = " de l'adresse ";

address.addEventListener("change", function () {
    validationForm(this, AddressRegex, AddressError, AddressMsg);
    if (validBox === false){
        contact.address = "";
    }else{
        contact.address = this.value;       
    }
});

// *****city
const city = document.getElementById("city");
const cityError = document.getElementById("cityErrorMsg")
let cityRegex = /^[a-zA-ZÂÀÈÉËÏÎéèëêïî][a-zA-Zàéèëêïîôç'\s-]{2,100}$/;
const cityMsg = " de la ville ";

city.addEventListener("change", function () {
    validationForm(this, cityRegex, cityError, cityMsg);
    if (validBox === false){
        contact.city = "";
    }else{
        contact.city = this.value;      
    }
});

// *****email
const email = document.getElementById("email");
const emailError = document.getElementById("emailErrorMsg")
let emailRegex = /^[a-zA-Z0-9._-]+[@]{1}[a-zA-Z0-9._-]+[.]{1}[a-z]{2,10}$/;
const emailMsg = " de l'email ";

email.addEventListener("change", function () {
    validationForm(this, emailRegex, emailError, emailMsg);
    if (validBox === false){
        contact.email = "";
    }else{
        contact.email = this.value;       
    }
});

// ************Fonction de validation de la saisie du formulaire*******//
function validationForm(a, b, c, d) {
    let Regex = b;  
    if (!Regex.test(a.value)) {
      const ErrorMsg = c;
      ErrorMsg.textContent = "La saisie" + d + "n'est pas valide";
      validBox = false;
      return validBox;
    } else {
      const ErrorMsg = c;
      ErrorMsg.textContent = "";
      validBox = true;
      return validBox;
    }
}

// recup array strin ID ====> incompréhension pk on envoi pas la quantité et la couleur ???
let products = [];
function ArrayID(){
    for (i in cart){
        if (cart[i].Id){
            products.push(cart[i].Id)
        }
    }
}

ArrayID();
// test les si l'object contact est remplis ou pas 
function testcontact(){
    let z = Object.values(contact);
    let y = 0;
    console.log(z);
    for (i in z){
        if(z[i] === null || z[i] === undefined || z[i] === ''){
            y = -1;
            // bloque tout 
        }else{
            y +=1
        }
    }
    console.log(y);
    if ( y === 5){
        send();
    }
}
// *************Fonction d'envoi des données **********//

// 1- recup arrayProduct = boite / 2- recup Objetcontact / 3- vérifie les id 

// const ApiPost = "http://localhost:3000/api/order/";
const order = document.getElementById("order");

order.addEventListener('click', function(e){
    e.preventDefault();
    console.log('coucou');
    if (cart){
        console.log('test le contact if cart ok')
        testcontact()
    }else{
        alert('Votre panier est vide, veuillez choisir au moins un produit');
    }
});

function send() {
    console.log('je debute la fonction send')
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({products,contact})
    })
    .then(function(res) {
      if (res.ok) {
        console.log(res);
        return res.json();
      }
    })
    .then(function(value) {
      console.log(value);
      let x = value.orderId;
      console.log(x);
    //   Est ce qu'un message avec un temps de lantence avant la redirection (ex : settimeout)???
      window.location.href = `confirmation.html?id=${x}`;
    })
    .catch(function(err) {
        console.log("Une erreur est survenue dans l'envoi de la commande!!");
        console.log(err);
    });
}
