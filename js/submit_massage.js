document.getElementById("contactForm").addEventListener("submit", function(event){
    event.preventDefault();

    let formData = new FormData(this);

    fetch("submit_message.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
    })
    .catch(error => {
        alert("There was an error: " + error);
    });
});
