function resetPassword() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
    } else if (password.length < 8) {
        alert("Please use password with at least 8 characters.")
        return;
    } else {
        fetch(`https://danov-autoshow-656625355b99.herokuapp.com/api/reset-password?token=${token}?newPassword=${password}`)
            .then(response => response.text())
            .then(data => {
                if (data === `Password reset successful!`) {
                    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=danov-autoshow-656625355b99.herokuapp.com; secure";
                    document.getElementById(`result-msg`).textContent = result + " Redirecting you to the log in page...";
                    document.getElementById(`result-msg`).style.display = `block`;
                    document.getElementById(`result-msg`).style.backgroundColor = `green`;
                    document.getElementById(`result-msg`).style.border = "3px solid green";
                    setTimeout(function () {
                        document.getElementById(`result-msg`).style.display = `none`;
                        // Redirect the user to log back in
                        location = `https://danov-autoshow-656625355b99.herokuapp.com/login`;
                    }, 1500);
                } else {
                    document.getElementById(`result-msg`).textContent = result;
                    document.getElementById(`result-msg`).style.display = `block`;
                    document.getElementById(`result-msg`).style.backgroundColor = `red`;
                    document.getElementById(`result-msg`).style.border = "3px solid red";
                    setTimeout(function () {
                        document.getElementById(`result-msg`).style.display = `none`;
                    }, 3500);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}