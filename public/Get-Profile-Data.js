var authToken = getCookie("authToken");
if (authToken) {
    // User is logged in
    document.querySelectorAll(`#log-in-icon`).forEach(entrie => {
        entrie.style.display = `none`;
    });
    document.querySelectorAll(`#log-in-text`).forEach(entrie => {
        entrie.style.display = `none`;
    });
    document.querySelectorAll(`#log-out-icon`).forEach(entrie => {
        entrie.style.display = `inline`;
    });
    document.querySelectorAll(`#log-out-text`).forEach(entrie => {
        entrie.style.display = `inline`;
    });
    document.querySelectorAll(`#profile`).forEach(entrie => {
        entrie.style.display = `inline`;
    });
    logOutUser();
    var decodedToken = JSON.parse(atob(authToken.split('.')[1]));
    var userId = decodedToken.userId;
    fetch(`https://danov-autoshow-656625355b99.herokuapp.com/api/profile/get`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId: userId
        })
    })
        .then(response => response.json())
        .then(result => {
            const username = result.username;
            const email = result.email;
            const favVehiclesArr = result.favVehicles

            document.getElementById("username").value = username;
            document.getElementById("email").value = email;
            for (const vehicle of favVehiclesArr) {
                const favVehiclesContainer = document.createElement(`li`);

                favVehiclesContainer.innerHTML = `
            <div class="car-card">
            <div class="img-container">
                <img src="${vehicle.vehicleImg}" alt="Car 2">
            </div>
            <div class="car-info">
                <h3>${vehicle.vehicleName}</h3>
            </div>
            <div class="favorites">
                <h3>Remove from Favorites</h3>
                <label class="add-fav">
                    <input type="checkbox" />
                    <i class="icon-heart fas fa-heart">
                        <i class="icon-plus-sign fa-solid fa-plus"></i>
                    </i>
                </label>
            </div>
            <a href="${vehicle.vehicleId}" class="view-button">View in
                Showroom</a>
        </div>
            `
                document.getElementById(`favorite-vehicles`).appendChild(favVehiclesContainer);
                favVehiclesContainer.children[0].children[2].children[1].children[0].checked = true;
                favVehiclesContainer.children[0].children[2].children[1].children[0].addEventListener(`change`, removeFavVehicle);
                document.getElementById(`remove-btn`).addEventListener(`click`, removeTheCar);
            }
        })

    fetch(`https://danov-autoshow-656625355b99.herokuapp.com/api/carOrders/get?id=${userId}`)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            for (const carOrder of result) {
                const container = document.createElement(`li`);
                let carManufacturer = carOrder.carManufacturer;
                carManufacturer = carManufacturer.charAt(0).toUpperCase() + carManufacturer.substring(1);
                container.innerHTML = `
                <div class="car-orders-container">
                <div class="car-order-details">
                    <div>
                        <span>Car manufacturer</span>
                        <p>${carManufacturer}</p>
                    </div>
                    <div>
                        <span>Car model</span>
                        <p>${carOrder.carModel}</p>
                    </div>
                    <div>
                        <span>Manufacture year</span>
                        <p>${carOrder.carYear}</p>
                    </div>
                </div>
                <div class="car-order-status">
                    <div>
                        <span>Order status</span>
                        <p class="order-status">${carOrder.orderStatus}</p>
                    </div>
                    <div>
                        <span>Order date</span>
                        <p>${carOrder.dateOfOrder}</p>
                    </div>
                </div>
                <div class="car-order-model" style="display: none;">
                    <h1>Ordered car</h1>
                    <div class="car-card">
                        <div class="img-container">
                            <img src="images/${carManufacturer}-${carOrder.carModel}.png" alt="Car 2">
                        </div>
                        <div class="car-info">
                            <h3>${carOrder.carYear} ${carManufacturer.toUpperCase()} ${carOrder.carModel.toUpperCase()}</h3>
                        </div>
                        <div class="favorites">
                            <h3>Add to Favorites</h3>
                            <label class="add-fav">
                                <input type="checkbox" />
                                <i class="icon-heart fas fa-heart">
                                    <i class="icon-plus-sign fa-solid fa-plus"></i>
                                </i>
                            </label>
                        </div>
                        <a href="showroom.html?car=3D Models/${carManufacturer}-${carOrder.carModel}-${carOrder.carYear}.glb"
                            class="view-button">View in
                            Showroom</a>
                    </div>
                </div>
            </div>
                `
                const imagePath = `images/${carManufacturer}-${carOrder.carModel}.png`;
                const img = new Image();
                img.onload = function() {
                    container.children[0].querySelector(`.car-order-model`).style.display = `flex`;
                };
                img.onerror = function() {
                    container.children[0].querySelector(`.car-order-model`).remove();
                };
                img.src = imagePath;
                document.querySelectorAll(`.order-status`).forEach(entrie => {
                    entrie.setAttribute("status", carOrder.orderStatus);
                });
                document.getElementById(`car-orders`).appendChild(container);
            }
        })
        .catch(err => console.log(err));
}

// Function to close the pop-up
function closePopup() {
    document.getElementById('overlay').style.display = 'none';
}

// Function to handle "Remove car" button click
function removeTheCar(e) {
    var decodedToken = JSON.parse(atob(authToken.split('.')[1]));
    var userId = decodedToken.userId;

    const carId = document.querySelector(`.car-id-remove`).href;
    document.querySelector(`.remove-car`).remove();
    fetch(`https://danov-autoshow-656625355b99.herokuapp.com/api/favorites/remove`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId: userId,
            vehicleId: carId
        })
    })
        .then(response => console.log(response))
        .catch(err => console.log(err));
    closePopup();
}

// Function to handle "No thanks" button click
function noThanks() {
    document.querySelector(`.car-id-remove`).classList.remove(`car-id-remove`);
    document.querySelector(`.remove-car`).classList.remove(`remove-car`);
    closePopup();
}

function removeFavVehicle(e) {
    e.currentTarget.checked = true;
    e.currentTarget.parentNode.parentNode.parentNode.children[3].classList.add(`car-id-remove`);
    e.currentTarget.parentNode.parentNode.parentNode.parentNode.classList.add(`remove-car`);
    document.getElementById('overlay').style.display = 'flex';
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Check if the cookie name matches
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

//Function to log out the user
function logOutUser() {
    document.querySelectorAll(`#log-out-icon`).forEach(entrie => {
        entrie.addEventListener(`click`, () => {
            // Set expiry to a past date, and include path and domain
            document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=danov-autoshow-656625355b99.herokuapp.com; secure";

            // Reload the page
            location.reload();
        });
    });
    document.querySelectorAll(`#log-out-text`).forEach(entrie => {
        entrie.addEventListener(`click`, () => {
            // Set expiry to a past date, and include path and domain
            document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=danov-autoshow-656625355b99.herokuapp.com; secure";

            // Reload the page
            location.reload();
        });
    });
}