const urlProduit = "http://localhost:3000/api/products";
let items = document.getElementById("items");
// Récupération des données du Back-end

fetch(urlProduit)
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(value) {
        console.log(value);
        parcourRes(value);
    })
    .catch(function(err) {
        console.log("Une erreur est survenue !!")
    });

// fonction qui va ajouter les élements de façon dynamiques
    
function parcourRes(value) {
    for (i in value) {
        
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

        link.setAttribute("href",`./product.html?id=${value[i]._id}`);// ce lien redirige vers la page produit correspondante
        img.setAttribute("src",value[i].imageUrl);
        img.setAttribute("alt",value[i].altTxt);

        titre.innerHTML = value[i].name;
        description.innerText = value[i].description;
              
    };
};