const signupBtn = document.getElementById("signupBtn");
const signupPopup = document.getElementById("signupPopup");

signupBtn.addEventListener("click", () => {
    signupPopup.classList.add("active");
});

function closeSignup() {
    signupPopup.classList.remove("active");
}
const seatLayout = document.getElementById("seatLayout");
const selectedSeatsText = document.getElementById("selectedSeats");
const totalPriceText = document.getElementById("totalPrice");
const confirmBooking = document.getElementById("confirmBooking");
const seatSection = document.getElementById("seatSection");
const seatPrice = 250;
const totalSeats = 60;
const bookedSeats = [3, 8, 15, 22, 35];
const STORAGE_KEY = "selectedSeats";
function getSelectedSeats() { 
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; 
}