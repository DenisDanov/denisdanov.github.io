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
    fetch(`https://danovs-autoshow-afcbab0f302b.herokuapp.com/api/profile/get`, {
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
            const password = result.password;
            const favVehiclesArr = result.favVehicles

            document.getElementById("username").value = username;
            document.getElementById("email").value = email;
            document.getElementById("password").value = password;
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
                <h3>Add to Favorites</h3>
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
}

// Function to close the pop-up
function closePopup() {
    document.getElementById('overlay').style.display = 'none';
}

// Function to handle "Take me to log in" button click
function removeTheCar(e) {
    var decodedToken = JSON.parse(atob(authToken.split('.')[1]));
    var userId = decodedToken.userId;

    const carId = document.querySelector(`.car-id-remove`).href;
    document.querySelector(`.remove-car`).remove();
    fetch(`https://danovs-autoshow-afcbab0f302b.herokuapp.com/api/favorites/remove`, {
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
            document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=danovs-autoshow-afcbab0f302b.herokuapp.com; secure";

            // Reload the page
            location.reload();
        });
    });
    document.querySelectorAll(`#log-out-text`).forEach(entrie => {
        entrie.addEventListener(`click`, () => {
            // Set expiry to a past date, and include path and domain
            document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=danovs-autoshow-afcbab0f302b.herokuapp.com; secure";

            // Reload the page
            location.reload();
        });
    });
}