document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Here you would typically make an AJAX request to the server to validate the credentials
    // For simplicity, let's assume the username is "admin" and the password is "password"
    if (username === 'admin' && password === 'password') {
        // Successful login, redirect to another page or perform other actions
        alert('Login successful!');
    } else {
        // Display error message
        document.getElementById('error-message').innerText = 'Invalid username or password';
    }
});
