// initializing the count of article with the local storage
if (sessionStorage.getItem('nombreArticle') != null && is_int(sessionStorage.getItem('nombreArticle'))) {
    var nmbrArticle = sessionStorage.getItem('nombreArticle');
} else {
    var nmbrArticle = 0;
}
sessionStorage.setItem("nombreArticle", nmbrArticle);

// function testing the type of a variable
function is_int(value) {
    if ((parseFloat(value) == parseInt(value)) && !isNaN(value)) {
        return true;
    } else {
        return false;
    }
}

// function containg a 
function showArticle() {
    return new Promise(function (resolve) {
        var request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                var response = JSON.parse(this.responseText);
                var content = "";

                resolve();
                for (let i = 0; i < response.length; i++) {
                    // creation of an article
                    content = content + '<section class="article"><h1>' + response[i].name + '</h1><img src="' + response[i].imageUrl + '" alt="' + response[i].name + '"><div class="detail"><p><h2>Description :</h2><span>' + response[i].description + '</span></p></div><div class="ajoutPanier"><span>' + response[i].price / 100 + '€</span><div class="button button__personnalisation" id="' + response[i]._id + '">Ajoutez au Panier</div></div></section>'
                    document.querySelector("main").innerHTML = "<span></span>" + content + "<div class='localPopup'></div>";
                }
            }
        };
        request.open("GET", " http://localhost:3000/api/cameras/");
        request.send();
    });
}

async function interactionOnPage() {
    await showArticle().then(function () {
        $(".button__personnalisation").click(function () {
            var id = this.getAttribute("id");

            var requestPopup = new XMLHttpRequest();

            requestPopup.onreadystatechange = function () {
                if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    var content1 = "";

                    // creation of the popup
                    content1 = '<div class="wrapperPopupArticle"><i class="fas fa-times"></i><div class="popupArticle"><img src="' + response.imageUrl + '" alt="' + response.name + '"><section><h1>' + response.name + '</h1><ul><h2>Caractéristiques :</h2><li><h3>Objectifs</h3><select>'

                    for (let x = 0; x < response.lenses.length; x++) {
                        content1 = content1 + '<option class="option' + x + '">' + response.lenses[x] + '</option>';
                    };

                    content1 = content1 + '</select></li></ul><div class="button button__panier" id="' + response._id + '">Ajouter au panier</div></section></div></div>'

                    document.querySelector("main .localPopup").innerHTML = content1;
                };

                // initial fadeIn of the popup
                $('.wrapperPopupArticle').hide();
                $('.wrapperPopupArticle').fadeIn();

                // closing popup
                $('.wrapperPopupArticle').find('i').click(function () {
                    $(".wrapperPopupArticle").fadeOut(function () {
                        $(".wrapperPopupArticle").remove();
                    });
                })

                // gestion nombre articles
                $('.button__panier').click(function () {
                    var idProd = this.getAttribute("id");
                    nmbrArticle++;

                    sessionStorage.setItem("article" + nmbrArticle, idProd);
                    sessionStorage.setItem("nombreArticle", nmbrArticle);

                    document.querySelector('nav').querySelector('i').textContent = nmbrArticle;

                    $(".wrapperPopupArticle").fadeOut(function () {
                        $(".wrapperPopupArticle").remove();
                    });
                })
            };
            requestPopup.open("GET", " http://localhost:3000/api/cameras/" + id);
            requestPopup.send();
        });
    })
}

interactionOnPage();


// gestion nombre articles
if (nmbrArticle > 0) {
    document.querySelector('nav').querySelector('i').textContent = nmbrArticle;
}
