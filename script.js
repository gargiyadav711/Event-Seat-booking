const signupBtn = document.getElementById("signupBtn");
const signupPopup = document.getElementById("signupPopup");

signupBtn.addEventListener("click", () => {
    signupPopup.classList.add("active");
});

function closeSignup() {
    signupPopup.classList.remove("active");
}

