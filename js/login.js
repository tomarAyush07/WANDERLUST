const signInBtn = document.getElementById("signIn");
const signUpBtn = document.getElementById("signUp");
const fistForm = document.getElementById("form1");
const secondForm = document.getElementById("form2");
const container = document.querySelector(".container");
const accountName = document.getElementById("accountName");
const sideMenu = document.getElementById("sideMenu");
const logoutBtn = document.getElementById("logoutBtn");

let loggedInUser = null;

signInBtn.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
});

signUpBtn.addEventListener("click", () => {
    container.classList.add("right-panel-active");
});

fistForm.addEventListener("submit", (e) => {
    e.preventDefault();
    loggedInUser = {
        name: document.getElementById("signupName").value,
        email: document.getElementById("signupEmail").value
    };
    alert('Sign up successful! Automatically switching to Signin.');
    container.classList.remove("right-panel-active");
});

secondForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (loggedInUser) {
        document.getElementById("userName").textContent = loggedInUser.name;
        document.getElementById("userEmail").textContent = loggedInUser.email;
        accountName.textContent = loggedInUser.name; 
        accountName.style.display = "block"; 
        container.style.display = "none";
    } else {
        alert('Sign up first!');
    }
});