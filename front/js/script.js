// déclaration d'une variable correspondant à l'URL de l'API
const urlProduit = "http://localhost:3000/api/products";

// variable qui récupére le premier noeud du DOM
let items = document.getElementById("items");

// fetch qui retourne une promise avec les informations produits
fetch(urlProduit)
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(products) {
        console.log(products);
        printProducts(products);
    })
    .catch(function(err) {
        console.log("Une erreur est survenue !!")
    });


// fonction qui va ajouter les élements de façon dynamiques (boucle)
function printProducts(products) {
    for (i in products) {
        
        let link = document.createElement("a");
        items.appendChild(link);

        let article = document.createElement("article");
        link.appendChild(article);

        let img = document.createElement("img");
        article.appendChild(img);

        let titre = document.createElement("h3");
        article.appendChild(titre);

        let description = document.createElement("p");
        article.appendChild(description);

        link.setAttribute("href",`./product.html?id=${products[i]._id}`);// ce lien redirige vers la page produit correspondante
        img.setAttribute("src",products[i].imageUrl);
        img.setAttribute("alt",products[i].altTxt);

        titre.innerHTML = products[i].name;
        description.innerText = products[i].description;
              
    };
};