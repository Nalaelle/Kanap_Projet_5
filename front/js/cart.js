// Déclaration des élements Url API / Premier noeud du DOM / Class > créateur de produit
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

let boite = []; // boite qui sert à stocker les information des produits
let cart = getCart(); // cart recupere le tableau du LS
testCart();

// Fonction qui test si LS est vide ou non 
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

/* Fonction qui va effectuer fetch pour chaque élément du LS
    fetch return un nouvel objet "  product "
    => qui est pousser dans la " boite "
    => qui est passer en argument de la fonction articlePrint()
*/
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

//Fonction qui appel toutes les autres nécessaire à l'affichage de chaque produit 
function articlePrint(products){
        articleChoice(products);
        deleteProduct();
        PrintTotal();  
}

// Pousser le tableau dans le localStorage
function saveCart(cart){
    return localStorage.setItem('cart',JSON.stringify(cart));
}
// Récuperer le tableau du localStorage
function getCart(){
    let cart = localStorage.getItem('cart');
    if (cart == null){ return [];}
    else {return JSON.parse((cart));};    
}

/* Fonction qui créer les élément du DOM pour chaque produit
    paramétre : " product " => objet créer dans la fonction rcupData()
    + écoute de l'input quantité
*/
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

    // Ecoute de la quantité, argument donné : " product " , nouvelle quantité   
        inputQ.addEventListener("input", () => updateQty(arg, parseInt(inputQ.value)));
}

// Fonction qui met à jour la quantité dans LS et " boite "
function updateQty(arg, newValue){
    const produit = arg;
    const idProd = produit.id;
    const colorProd = produit.color;
    produit.Qty = newValue;   
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
        PrintTotal(); // recalcule le total
    }else{
        alert("La quantité choisie n'est pas valide");
        for (i in cart){
            if (cart[i].Id === idProd && cart[i].Color === colorProd){
                cart[i].Quantity = 1;
                saveCart(cart);
                if (boite[i].id === idProd && boite[i].color === colorProd){
                    boite[i].Qty = 1;
                }
            }
        }
        PrintTotal();  // recalcule le total
    };    
}

// Fonction qui calcul et affiche le prix total et la Quantité total 
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

// Fonction qui supprime un produit
function deleteProduct(){
    const btnDelete = document.querySelectorAll(".deleteItem"); // récupération du noeud correspondant
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
            PrintTotal(); // recalcule le total
        })              
    })   
}
/* ***********  Fin d'affichage du panier *************** 

****************  FORMULAIRE *************************  
 Déclaration de l'objet contact  */
let contact = {
    firstName : "",
    lastName : "",
    address : "",
    city : "",
    email : ""
};

let validBox = false;

// regex 
let regexName = /^[a-zA-ZÂÀÈÉËÏÎéèëêïî'\s-][a-zA-ZÂÀÈÉËÏÎéèëêïîôç'\s-]{2,60}$/;
let regexAddress = /^[a-zA-ZÂÀÈÉËÏÎéèëêïî0-9][0-9a-zA-Zàéèëêïîôç'\s-]{5,100}$/;
let regexCity = /^[a-zA-ZÂÀÈÉËÏÎéèëêïî][a-zA-Zàéèëêïîôç'\s-]{2,100}$/;
let regexEmail = /^[a-zA-Z0-9._-]+[@]{1}[a-zA-Z0-9._-]+[.]{1}[a-z]{2,10}$/;

validateField("firstName", "firstNameErrorMsg", regexName, " du prénom "); 
validateField("lastName", "lastNameErrorMsg", regexName, " du nom ");
validateField("address", "addressErrorMsg", regexAddress, " de l'adresse ");
validateField("city", "cityErrorMsg", regexCity, " de la ville ");
validateField("email", "emailErrorMsg", regexEmail, " de l'email ");

// Fonction -> récupére les éléments du DOM / écoute l'évenement / appel les fonction suivante
function validateField(id, errorMsgId, regexString, messageError) {
    const element = document.getElementById(id);
    const errorElement = document.getElementById(errorMsgId);
    
    element.addEventListener("change", function () {
        validationForm(this, regexString, errorElement, messageError);
        if (validBox === false){
            setContactValue(id, "")
        }else{
            setContactValue(id, this.value)      
        }
    });

}

// Fonction de validation de la saisie du formulaire / affiche un message d'erreur personnalisé
function validationForm(currentComponent, regex, componentError, errorMsg) {
    let Regex = regex;  
    if (!Regex.test(currentComponent.value)) {
      const ErrorMsg = componentError;
      ErrorMsg.textContent = "La saisie" + errorMsg + "n'est pas valide";
      validBox = false;
      return validBox;
    } else {
      const ErrorMsg = componentError;
      ErrorMsg.textContent = "";
      validBox = true;
      return validBox;
    }
}
// Fonction -> permet d'attribuer la bonne valeur à l'objet Contact
function setContactValue(field, value) {
    if (field === "firstName"){
        contact.firstName = value;
    }
    if (field === "lastName"){
        contact.lastName = value;
    }
    if (field === "address"){
        contact.address = value;
    }
    if (field === "city"){
        contact.city = value;
    }
    if (field === "email"){
        contact.email = value;
    }
}

// Déclaration du tableau comprenant les ID produits
let products = [];
function ArrayID(){ 
    for (i in cart){
        if (cart[i].Id){
            products.push(cart[i].Id)
        }
    }
}
ArrayID();

// test si l'object contact est rempli ou pas  avec un compteur (y)
function testcontact(){
    let z = Object.values(contact);
    let y = 0;    
    for (i in z){
        if(z[i] === null || z[i] === undefined || z[i] === ''){
            y = -1;// bloque tout             
        }else{
            y +=1
        }
    }   
    if ( y === 5){ // valide et appel la fonction d'envoi des données à l'API
        send();
    }else{
        alert("Il manque des informations dans le formulaire. Veillez à remplir tous les champs");
    }
}

/* Récupération noeud du DOM 
    Ecoute du bouton " commander "
    vérifie la présence d'un produit au minimum dans le LS
    informe l'utilisateur si le panier est vide
*/
const order = document.getElementById("order");
order.addEventListener('click', function(e){
    e.preventDefault();
    if (cart && cart.length != 0){
        testcontact();
    }else{
        alert('Votre panier est vide, veuillez choisir au moins un produit');
    }
});

/* Fonction d'envoi des données
    fetch avec le verbe post => envoi de données
    information utilisateur : propose une redirection sur la page confirmation     
*/
function send() {
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
        return res.json();
      }
    })
    .then(function(value) {
      let x = value.orderId;
      if (confirm('Vous allez être rediriger sur la page de confirmation')){
        setTimeout(() => {
            console.log('redirection ok');
            window.location.href = `confirmation.html?id=${x}`;
            localStorage.clear();
          }, 1000)
      }else{
        console.log('stay here')
      }
    })
    .catch(function(err) {
        console.log("Une erreur est survenue dans l'envoi de la commande!!");
        console.log(err);
    });
}
