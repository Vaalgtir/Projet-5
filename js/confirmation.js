if (sessionStorage.getItem("orderId")) {
    var numCommande = sessionStorage.getItem("orderId");

    document.querySelector(".confirmationContent h2").textContent = "Votre numéro de commande est le : " + numCommande;

    $(".buttonRetour").click(function() {
        sessionStorage.clear();
        document.location.href='index.html';
    })
} else {
    document.location.href='attrapeCouillon.html';
}