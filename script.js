const signupBtn = document.getElementById("signupBtn");
const signupPopup = document.getElementById("signupPopup");
if (signupBtn && signupPopup) {
    signupBtn.addEventListener("click", () => {
        signupPopup.classList.add("active");
    });
}
function closeSignup() {
    if (signupPopup) {
        signupPopup.classList.remove("active");
    }
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
    if (!textPath) {
        return;
    }
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
        console.error("Circle elements not found.");
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
const myBookingsContainer = document.getElementById("myBookingsContainer");
let selectedSeats = [];
let currentEvent = null;
let bookings = JSON.parse(localStorage.getItem("myBookings")) || [];
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
    return JSON.parse(
        localStorage.getItem(`bookedSeats_${eventId}`)
    ) || [];
}
function loadSeatsForEvent(eventId) {
    if (!seatLayout) {
        return;
    }
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
            } else {
                seat.classList.add("available");
            }
            seat.addEventListener("click", () => {
                selectSeat(seat, seatNumber);
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
        const index = selectedSeats.indexOf(seatNumber);
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
        const category = getSeatCategory(seatNumber);
        totalAmount += seatPrices[category];
    });
    if (selectedSeatsText) {
        selectedSeatsText.textContent = selectedSeats.length > 0 ? selectedSeats.join(", ") : "None";
    }
    if (totalPriceText) {
        totalPriceText.textContent = totalAmount;
    }
}

document.querySelectorAll(".get-tickets").forEach(button => {
    button.addEventListener("click", function () {
        const eventCard = this.closest(".event_card1");
        if (!eventCard) {
            return;
        }
        currentEvent = {
            id: eventCard.dataset.eventId,
            name: eventCard.dataset.eventName,
            date: eventCard.dataset.eventDate
        };
        if (selectedEventName) {
            selectedEventName.textContent = currentEvent.name;
        }
        if (selectedEventDate) {
            selectedEventDate.textContent = currentEvent.date;
        }
        loadSeatsForEvent(currentEvent.id);
        if (seatSection) {
            seatSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

if (confirmBooking) {
    confirmBooking.addEventListener("click", function () {
        if (!currentEvent) {
            alert("Please select an event first.");
            return;
        }
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }
        const bookedSeats = getBookedSeats(currentEvent.id);
        const alreadyBooked = selectedSeats.some(seat =>
            bookedSeats.includes(seat)
        );
        if (alreadyBooked) {
            alert("One or more selected seats are already booked.");
            loadSeatsForEvent(currentEvent.id);
            return;
        }
        const totalAmount = selectedSeats.reduce((total, seat) => {
            return total + seatPrices[getSeatCategory(seat)];
        }, 0);
        const booking = {
            bookingId: "BK" + Date.now(),
            eventId: currentEvent.id,
            eventName: currentEvent.name,
            eventDate: currentEvent.date,
            seats: [...selectedSeats],
            totalAmount: totalAmount,
            status: "Confirmed"
        };
        bookings.push(booking);
        localStorage.setItem("myBookings", JSON.stringify(bookings));
        const updatedBookedSeats = [...bookedSeats, ...selectedSeats];
        localStorage.setItem(`bookedSeats_${currentEvent.id}`, JSON.stringify(updatedBookedSeats));
        alert("Booking confirmed successfully!");
        loadSeatsForEvent(currentEvent.id);
        displayMyBookings();
    });
}
function displayMyBookings() {
    myBookingsContainer.innerHTML = "";

    if (bookings.length === 0) {
        myBookingsContainer.innerHTML = `
            <p class="no-bookings">No bookings found.</p>
        `;
        return;
    }

    bookings.forEach(booking => {
        const bookingCard = document.createElement("div");
        bookingCard.classList.add("booking-card");

        bookingCard.innerHTML = `
            <h3>${booking.eventName}</h3>

            <p>
                <strong>Booking ID:</strong>
                <span>${booking.bookingId}</span>
            </p>

            <p>
                <strong>Date:</strong>
                <span>${booking.eventDate}</span>
            </p>

            <p>
                <strong>Seats:</strong>
                <span>${booking.seats.join(", ")}</span>
            </p>

            <p>
                <strong>Total Amount:</strong>
                <span>₹${booking.totalAmount}</span>
            </p>

            <div class="booking-status">
                ${booking.status}
            </div>

            ${booking.status === "Confirmed"
                ? `
                        <button
                            class="cancel-booking"
                            data-booking-id="${booking.bookingId}">
                            Cancel Booking
                        </button>
                    `
                : ""
            }
        `;
        myBookingsContainer.appendChild(bookingCard);
    });
}
if (myBookingsContainer) {
    myBookingsContainer.addEventListener("click", function (event) {
        const cancelButton = event.target.closest(".cancel-booking");
        if (!cancelButton) {
            return;
        }
        const bookingId = cancelButton.dataset.bookingId;
        const bookingIndex = bookings.findIndex(booking => {
            return booking.bookingId === bookingId;
        });
        if (bookingIndex === -1) {
            alert("Booking not found.");
            return;
        }
        const booking = bookings[bookingIndex];
        const confirmCancel = confirm(`Do you want to cancel the booking for ${booking.eventName}?`);
        if (!confirmCancel) {
            return;
        }
        const bookedSeats = getBookedSeats(booking.eventId);
        const remainingBookedSeats = bookedSeats.filter(seat => {
            return !booking.seats.includes(seat);
        });
        localStorage.setItem(`bookedSeats_${booking.eventId}`, JSON.stringify(remainingBookedSeats));
        bookings.splice(bookingIndex, 1);
        localStorage.setItem("myBookings", JSON.stringify(bookings));
        if (currentEvent && currentEvent.id === booking.eventId) {
            loadSeatsForEvent(currentEvent.id);
        }
        displayMyBookings();
        alert("Booking cancelled successfully. The seats are available again.");
    });
}

displayMyBookings();