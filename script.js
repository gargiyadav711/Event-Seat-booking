const signupBtn = document.getElementById("signupBtn");
const signupPopup = document.getElementById("signupPopup");

signupBtn.addEventListener("click", () => {
    signupPopup.classList.add("active");
});

function closeSignup() {
    signupPopup.classList.remove("active");
}

const circleText = document.getElementById("circleText");
const circleImage = document.getElementById("circleImage");

const slides = [
    {
        text: "DISCOVER AMAZING EVENTS",
        image: "img2.jpeg"
    },
    {
        text: "BOOK YOUR EXPERIENCE",
        image: "img3.jpeg"
    },
    {
        text: "ENJOY EVERY MOMENT",
        image: "img1.jpeg"
    }
];
let currentSlide = 0;
function typeText(text, callback) {
    const textPath = document.querySelector("#circleText textPath");
    textPath.textContent = "";
    let index = 0;
    const typing = setInterval(() => {
        textPath.textContent += text[index];
        index++;
        if (index >= text.length) {
            clearInterval(typing);
            setTimeout(callback, 2500);
        }
    }, 80);
}
function showSlide() {
    if (!circleText || !circleImage) {
        console.error("circleText or circleImage element not found");
        return;
    }
    const slide = slides[currentSlide];
    circleImage.style.opacity = "0";
    setTimeout(() => {
        circleImage.src = slide.image;
        circleImage.onload = () => {
            circleImage.style.opacity = "1";
        };
    }, 400);
    typeText(slide.text, () => {
        currentSlide++;
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }
        showSlide();
    });
}

showSlide();
const seatLayout = document.getElementById("seatLayout");
const selectedSeatsText = document.getElementById("selectedSeats");
const totalPriceText = document.getElementById("totalPrice");
const confirmBooking = document.getElementById("confirmBooking");
const seatSection = document.getElementById("seatSection");
const seatPrice = 250;
const totalSeats = 60;
const bookedSeats = [3, 8, 15, 22, 35];

