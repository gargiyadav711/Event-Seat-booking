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
const selectedEventName = document.getElementById("selectedEventName");
const selectedEventDate = document.getElementById("selectedEventDate");
let selectedSeats = [];
let currentEvent = null;
const seatPrices = {
    VIP: 500,
    Premium: 300,
    Regular: 150
};

const rows = ["A", "B", "C", "D", "E", "F"];
function getSeatCategory(seatNumber) {
    const row = seatNumber.charAt(0);
    if (row === "A" || row === "B") {
        return "VIP";
    }
    if (row === "C" || row === "D") {
        return "Premium";
    }
    return "Regular";
}
function getBookedSeats(eventId) {
    return JSON.parse(localStorage.getItem(`bookedSeats_${eventId}`)) || [];
}
function loadSeatsForEvent(eventId) {
    seatLayout.innerHTML = "";
    selectedSeats = [];
    const bookedSeats = getBookedSeats(eventId);
    rows.forEach(row => {
        for (let number = 1; number <= 10; number++) {
            const seatNumber = `${row}${number}`;
            const category = getSeatCategory(seatNumber);
            const seat = document.createElement("button");
            seat.type = "button";
            seat.classList.add("seat");
            seat.classList.add(category.toLowerCase());
            seat.textContent = seatNumber;
            seat.dataset.seat = seatNumber;
            seat.dataset.category = category;
            seat.dataset.price = seatPrices[category];
            if (bookedSeats.includes(seatNumber)) {
                seat.classList.add("booked");
                seat.disabled = true;
            }
            else{
                seat.classList.add("available");
            }
            seat.addEventListener("click", function () {
                selectSeat(seat,seatNumber);
            });
            seatLayout.appendChild(seat);
        }
    });
    updateBookingSummary();
}
function selectSeat(seat, seatNumber) {
    if (seat.classList.contains("booked")) {
        return;
    }
    if (seat.classList.contains("selected")) {
        seat.classList.remove("selected");
        seat.classList.add("available");
        const index =selectedSeats.indexOf(seatNumber);
        if (index !== -1) {
            selectedSeats.splice(index, 1);
        }
    }
    else {
        seat.classList.remove("available");
        seat.classList.add("selected");
        selectedSeats.push(seatNumber);
    }
    updateBookingSummary();
}
function updateBookingSummary() {
    let totalAmount = 0;
    selectedSeats.forEach(seatNumber => {
        const category =getSeatCategory(seatNumber);
        totalAmount += seatPrices[category];
    });
    if (selectedSeats.length > 0){
        selectedSeatsText.textContent =selectedSeats.join(", ");
    }
    else{
        selectedSeatsText.textContent = "None";
    }
    totalPriceText.textContent = totalAmount;
}
document.querySelectorAll(".get-tickets").forEach(button => {
    button.addEventListener("click", function () {
        const eventCard =this.closest(".event_card1");
        currentEvent = {
            id: eventCard.dataset.eventId,
            name: eventCard.dataset.eventName,
            date: eventCard.dataset.eventDate
        };
        if (selectedEventName) {
            selectedEventName.textContent =
                currentEvent.name;
        }
        if (selectedEventDate) {
            selectedEventDate.textContent =
                currentEvent.date;
        }
        loadSeatsForEvent(
            currentEvent.id
        );
        seatSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});
confirmBooking.addEventListener("click",
    function (){
        if (!currentEvent) {
            alert("Please select an event first.");
            return;
        }
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }
        const bookedSeats =getBookedSeats(currentEvent.id);
        const updatedBookedSeats = [...bookedSeats,...selectedSeats];
        localStorage.setItem(`bookedSeats_${currentEvent.id}`,JSON.stringify(updatedBookedSeats));
        alert(`Booking confirmed for ${currentEvent.name}!`);
        loadSeatsForEvent(currentEvent.id);
        updateBookingSummary();
    }
);