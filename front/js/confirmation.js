const params = new URLSearchParams(document.location.search);
const id = params.get("id"); 
const confirmation = document.querySelector(".confirmation p")
const commandeNumber = document.getElementById("orderId");
if (id){
    commandeNumber.textContent = id;
}else{
    confirmation.textContent = "Vous n'avez pas de commande."
}