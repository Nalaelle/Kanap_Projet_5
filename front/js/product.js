// Récupération de l'url Api et Id
const urlProduit = "http://localhost:3000/api/products";
let params = new URLSearchParams(document.location.search);
const id = params.get("id"); 

// variable => récupère l'id du produit courant
let appelApi = "http://localhost:3000/api/products"+"/"+id;

// fetch renvoi en promise une fonction qui affiche les infos du produit
fetch(appelApi)
    .then(function(res) {
        if (res.ok) {
            return res.json();            
        }
    })
    .then(function(produit) {     
        callValue(produit);
    })
    .catch(function(err) {
        console.log("Une erreur est survenue !!");
        console.log(err);
    });

// Récupération des noeud du DOM + création img
let boxImg = document.querySelector(".item__img");
let img = document.createElement("img");
boxImg.appendChild(img); 

let title = document.getElementById("title");
let price = document.getElementById("price");

let description = document.getElementById("description");
let optionColors = document.querySelector("#colors");

// fonction qui attribut les informations produit aux élements du DOM 
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

/*           Local Storage
 **************************************  */
// Déclaration tableau qui sera pousser dans le LS
let cart = [];

// 1-déclarer les couleurs et quantites
let eventColor = document.getElementById("colors");
let eventQuantity = document.getElementById("quantity");

// Objet représentant un produit (à pousser dans le panier)
let objectCart = {
    Id: id,
    Color: '',
    Quantity: 0
};

// Ecoute color/Qty et attribution des valeurs à {objetCart} : produit
eventColor.addEventListener('change', function(){
    return objectCart.Color = eventColor.value;    
});
eventQuantity.addEventListener('change', function(){
    let number = parseInt(eventQuantity.value);
    return objectCart.Quantity = number;
});

// 2-verifier la couleur et la quantité et alerte l'utilisateur sur la validité de son choix
function validation(){
    let Qty = objectCart.Quantity;
    let validCart;

    if ( isNaN(Qty) || Qty < 1 || Qty > 100 || Qty == 0 || Qty === null || Qty === undefined){
        console.log("test qty ");
        validCart = false;
        
    } else if (objectCart.Color === 'color' || objectCart.Color === '' || objectCart.Color === undefined){
        console.log("test color");
        validCart = false;
            
        } else {  
            console.log(validCart)      
            validCart = true;
            }
    console.log(validCart)
    if (validCart){
        alert('Votre couleur et votre quantité sont validées');
        return validCart;
    }else{
        alert("Votre selection de couleur ou de quantité n'est pas valide");
        return validCart;
    }     
}

//  4- pousser le tableau dans le localstorage 
function saveCart(cart){ 
    return localStorage.setItem('cart',JSON.stringify(cart));
};
//  Recupere le local storage sous forme de tableau 
function getCart(){
    let cart = localStorage.getItem('cart');
    if (cart == null){ return [];}
    else {return JSON.parse((cart));};    
};

/* Ecoute le bouton "ajouter au panier" 
   + fonction qui vérifie la validité de la sélection 
   + fonction qui check si le produit est déjà existant dans le panier
*/
const button = document.getElementById('addToCart');
button.addEventListener('click',function listenButton(){
    if (validation()){
        cart = getCart();
        checkProduct();   
    };   
});  


/*  3- inserer l'objet dans le tableau => LS
   Fonction qui vérifie la présence d'un produit dans le LS 
   Si l'id et la couleur d'un même produit sont présent : modifier la quantité 
   Sinon créer un nouveau produit 

   La variable stopFunction permet de bloquer l'envoi du produit 
   si la quantité total de celui-ci est supérieur à 100
*/
function checkProduct(){
    cart = getCart();
    let test = false;
    let stopFunction = true; // stop le fonctionnement si la quantité totale est superieur à 100
    cart.forEach(element => {      
        if (element.Id === objectCart.Id && element.Color === objectCart.Color){
            element.Quantity += objectCart.Quantity
            if (element.Quantity < 101){
                test = true;
            }else{
                stopFunction = false; // stop le fonctionnement 
                console.log("total Quantité superieur à 100");
                alert("votre quantité totale dépasse 100 produits les stocks ne sont pas disponibles");
                }     
        }              
    });

    if(stopFunction) {
        if (test){        
            saveCart(cart); 
        }else{     
            cart.push(objectCart);  
            saveCart(cart); 
        }
    }      
};