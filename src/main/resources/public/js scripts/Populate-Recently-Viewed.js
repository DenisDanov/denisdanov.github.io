if (authToken) {
    var decodedToken = JSON.parse(atob(authToken.split('.')[1]));
    var userId = decodedToken.userId;
}

function getCarParams() {
    return new Promise((resolve, reject) => {
        if (authToken) {
            fetch(`${window.location.origin}/api/recently-viewed/get?userId=${userId}&authToken=${authToken}`)
                .then(response => response.json())
                .then(result => {
                    if (result == null) {
                        resolve([]);
                    } else {
                        const arr = [];
                        for (const car of result) {
                            arr.push(car);
                        }
                        resolve(arr);
                    }
                })
                .catch(err => reject(err));
        } else {
            const savedParamsCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('recently_viewed='));
            if (savedParamsCookie) {
                let paramsString = decodeURIComponent(savedParamsCookie.split('=')[1]).replace(/%2F/g, '/');
                paramsString = paramsString.replace(/\+/g, " ");
                resolve(paramsString ? paramsString.split(',') : []);
            }
            resolve([]);
        }
    })
}

var currentURL = window.location.href;

var recentlyViewedLoaded = new Promise((resolve, reject) => {
    getCarParams().then(carParams => {
        if (currentURL === `${window.location.origin}/profile`) {
            favoritesLoaded.then(response => {
                const container = document.querySelectorAll(`.recently-viewed-cars .car-card input[type="checkbox"]`);
                if (container.length !== 0) {
                    for (const inputs of container) {
                        inputs.addEventListener(`change`, addCarOrderToFavs);
                    }
                } else {
                    document.querySelector(`.recently-viewed-cars`).appendChild(document.createElement(`p`));
                    document.querySelector(`.recently-viewed-cars`).children[0].textContent = `No recently viewed cars`;
                    document.querySelector(`.recently-viewed-cars`).children[0].style.margin = "1rem 0";
                }
                document.getElementById(`recently-viewed-spinner`).style.display = `none`;
                document.querySelector(`.recently-viewed-cars`).style.display = `flex`;
                resolve("success");
            });
        } else {
            if (carParams.length !== 0) {
                if (authToken) {
                    const container = document.querySelectorAll(`.recently-viewed-cars .car-card input[type="checkbox"]`);
                    if (container.length !== 0) {
                        for (const inputs of container) {
                            if (currentURL.includes(`auto-show`)) {
                                inputs.addEventListener(`change`, trackFavoriteStatus);
                            } else {
                                inputs.addEventListener(`change`, checkFavVehicles);
                            }
                        }
                    } else {
                        document.querySelector(`.recently-viewed-cars`).appendChild(document.createElement(`p`));
                        document.querySelector(`.recently-viewed-cars`).children[0].textContent = `No recently viewed cars`;
                        document.querySelector(`.recently-viewed-cars`).children[0].style.margin = "1rem 0";
                    }
                    document.getElementById(`recently-viewed-spinner`).style.display = `none`;
                    document.querySelector(`.recently-viewed-cars`).style.display = `flex`;
                    resolve("success");
                } else {
                    const container = document.querySelector(`.recently-viewed-cars`);
                    for (let index = carParams.length - 1; index >= 0; index--) {
                        let entrie = carParams[index];
                        const carCard = document.createElement(`div`);
                        const modelName = entrie.split(`3D Models/`)[1];
                        carCard.classList.add(`car-card`);
                        carCard.innerHTML = `
                            <div class="img-container">
                                            <img src="../images/${modelName.split(`.`)[0]}.png" alt="Car 2">
                                        </div>
                                        <div class="car-info">
                                            <h3>${modelName.split('.')[0].replace(/-/g, ' ')}</h3>
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
                                        <a href="showroom.html?car=${entrie}" class="view-button">View in
                                            Showroom</a>        
                            `;
                        carCard.querySelector(`.add-fav input`).addEventListener(`change`, checkFavVehicles);
                        container.appendChild(carCard);
                    }
                    document.getElementById(`recently-viewed-spinner`).style.display = `none`;
                    document.querySelector(`.recently-viewed-cars`).style.display = `flex`;
                    resolve("success");
                }
            } else {
                document.getElementById(`recently-viewed-spinner`).style.display = `none`;
                document.querySelector(`.recently-viewed-cars`).style.display = `flex`;
                document.querySelector(`.recently-viewed-cars`).appendChild(document.createElement(`p`));
                document.querySelector(`.recently-viewed-cars`).children[0].textContent = `No recently viewed cars`;
                document.querySelector(`.recently-viewed-cars`).children[0].style.margin = "1rem 0";
            }
        }
    });
});

function checkFavVehicles(e) {
    if (e.currentTarget.checked && authToken) {
        const carId = e.currentTarget.parentNode.parentNode.parentNode.children[e.currentTarget.parentNode.parentNode.parentNode.children.length - 1].href;
        const carImg = e.currentTarget.parentNode.parentNode.parentNode.children[0]
            .children[0].getAttribute("src");
        const carName = e.currentTarget.parentNode.parentNode.parentNode.children[1].children[0].textContent;
        e.currentTarget.parentNode.parentNode.children[0].textContent = `Remove from Favorites`;
        favoriteVehicles.push(carId);
        fetch(`${window.location.origin}/api/favorites/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                vehicleId: carId,
                vehicleImg: carImg,
                vehicleName: carName,
                authToken: authToken
            })
        })
            .then(response => {
                console.log(response)
            })
            .catch(err => console.log(err));
    } else if (authToken) {
        const carId = e.currentTarget.parentNode.parentNode.parentNode.children[e.currentTarget.parentNode.parentNode.parentNode.children.length - 1].href;
        e.currentTarget.parentNode.parentNode.children[0].textContent = `Add to Favorites`;
        fetch(`${window.location.origin}/api/favorites/remove`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                vehicleId: carId,
                authToken: authToken
            })
        })
            .then(response => {
                console.log(response);
                favoriteVehicles.splice(favoriteVehicles.indexOf(carId), 1);
            })
            .catch(err => console.log(err));
    } else {
        document.getElementById(`overlay`).style.display = "flex";
        e.currentTarget.checked = false;
    }
}

