$(document).ready(function () {
    if (sessionStorage.getItem('nombreArticle') != null && is_int(sessionStorage.getItem('nombreArticle'))) {
        var nmbrArticle = sessionStorage.getItem('nombreArticle');
    } else {
        var nmbrArticle = 0;
    }

    // FUNCTION'S SECTION

        // functions running the xml request
        function get(url) {
            return new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest();

                request.onreadystatechange = function () {
                    if (this.readyState == XMLHttpRequest.DONE) {
                        if(this.status == 200) {
                            var responseReq = JSON.parse(this.responseText); 
                            return resolve(responseReq);
                        } else {
                            return reject(console.error("La requête XML a échoué"))
                        }
                    }
                };
                request.open("GET", url);
                request.send();
            });
        }
        function post(url, sent) {
            return new Promise(function(resolve, reject) {
                var request = new XMLHttpRequest();
        
                request.onreadystatechange = function () {
                    if (this.readyState == XMLHttpRequest.DONE) {
                        if (this.status == 201) {
                            resolve(JSON.parse(this.responseText).orderId);
                        } else {
                            reject(console.error("Pas d'order ID reçu"))
                        }
                    }
                }
        
                request.open("POST", url);
                request.setRequestHeader("Content-Type", "application/json");
                request.send(JSON.stringify(sent));
            })
        }
        
        function showArticle() {
            for (let i = 1; i <= nmbrArticle; i++) {
                var article = sessionStorage.getItem("article" + i);
                get("http://localhost:3000/api/cameras/" + article).then(response => {
                    var content = "";
                    var precedentContent = document.querySelector("main .localContent").innerHTML;
        
                    totalPrice = totalPrice + response.price/100;
                    document.querySelector(".totalPrice").textContent = totalPrice + '€';
        
                    // creation of an article
                    content = content + '<section class="article">'+
                                            '<h1>' + response.name + '</h1>'+
                                            '<img src="' + response.imageUrl + '" alt="' + response.name + '">'+
                                            '<div class="detail">'+
                                                '<p>'+
                                                    '<h2>Description :</h2>'+
                                                    '<span>' + response.description + '</span>'+
                                                '</p>'+
                                            '</div>'+
                                            '<div class="ajoutPanier"><span>' + response.price/100 + ' €</span></div>'+
                                        '</section>';
        
                    document.querySelector("main .localContent").innerHTML = precedentContent + content;
                })
            }
        }

        function activationButton() {
            if (validPrenom == true && validNom == true && validAdresse == true && validVille == true && validMail == true) {
                $(".wrapperPopupContact .finalButton").removeClass("inactive");
            } else {
                $(".wrapperPopupContact .finalButton").addClass("inactive");
            }
        }
        // function testing the type of a variable
        function is_int(value) {
            if ((parseFloat(value) == parseInt(value)) && !isNaN(value)) {
                return true;
            } else {
                return false;
            }
        }

    // END OF FUNCTION'S SECTION

    // VARIABLE'S SECTION
        var tabArticle = [];
        var totalPrice = 0;
    // END OF VARIABLE'S SECTION

    // initialization of the array of article
    for (let a = 1; a <= nmbrArticle; a++) {
        tabArticle.push(sessionStorage.getItem("article" + a));
    }

    $(".wrapperPopupContact").hide();

    if (nmbrArticle > 0) {

        // fadeIn fadeOut of the submit Popup
        $(".buttonSubmit").click(function () {
            $(".wrapperPopupContact").fadeIn();
        })
        $(".wrapperPopupContact i").click(function () {
            $(".wrapperPopupContact").fadeOut();
        })

        showArticle();

        // validation of the data 
        var validPrenom = false;
        var validNom = false;
        var validAdresse = false;
        var validVille = false;
        var validMail = false;

        document.querySelector(".prenom").addEventListener('input', function () {
            if (/^[a-zA-Z]+$/.test(document.querySelector(".prenom").value)) {
                validPrenom = true;
                activationButton()
            } else {
                validPrenom = false;
                activationButton()
            }
        })
        document.querySelector(".nom").addEventListener('input', function () {
            if (/^[a-zA-Z]+$/.test(document.querySelector(".nom").value)) {
                validNom = true;
                activationButton()
            } else {
                validNom = false;
                activationButton()
            }
        })
        document.querySelector(".adresse").addEventListener('input', function () {
            if (!document.querySelector(".adresse").value == "") {
                validAdresse = true;
                activationButton()
            } else {
                validAdresse = false;
                activationButton()
            }
        })
        document.querySelector(".ville").addEventListener('input', function () {
            if (/^[a-zA-Z]+$/.test(document.querySelector(".ville").value)) {
                validVille = true;
                activationButton()
            } else {
                validVille = false;
                activationButton()
            }
        })
        document.querySelector(".mail").addEventListener('input', function () {
            if (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-z]{2,6}$/.test(document.querySelector(".mail").value)) {
                validMail = true;
                activationButton()
            } else {
                validMail = false;
                activationButton()
            }
        })


        $(".buttonClear").click(function () {
            sessionStorage.clear();
            document.location.reload();
        })

        // sending info to server 
        $(".wrapperPopupContact .finalButton").click(function () {
            if (!$(".wrapperPopupContact .finalButton").hasClass("inactive")) {
                event.preventDefault();
                
                var body = {
                    contact: {
                        firstName: document.querySelector(".prenom").value,
                        lastName: document.querySelector(".nom").value,
                        address: document.querySelector(".adresse").value,
                        city: document.querySelector(".ville").value,
                        email: document.querySelector(".mail").value,
                    },
                    products: tabArticle,
                }

                post("http://localhost:3000/api/cameras/order", body)
                    .then(response => {
                        sessionStorage.setItem("orderId", response)
                    })
                    .then(() => {
                        document.location.href = 'confirmation.html';
                    })
            };
        })

    } else {
        document.querySelector("main h1").textContent = "vous n'avez pas d'articles dans vote panier";
        $(".buttonClear").hide();
        $(".buttonSubmit").hide();
        $(".wrapperTotalPrice").hide();
    }
});