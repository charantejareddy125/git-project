
const destination = document.getElementById("destination");
const departure = document.getElementById("departure");
const returnDate = document.getElementById("returnDate");
const travelers = document.getElementById("travelers");
const searchForm = document.getElementById("searchForm");
const searchMessage = document.getElementById("searchMessage");

const bookingForm = document.getElementById("bookingForm");
const bookingDestination = document.getElementById("bookingDestination");
const confirmation = document.getElementById("confirmation");

// Demo package prices in Indian Rupees, per traveler.
const prices = {
  "Bali": 25000,
  "Santorini": 45000,
  "Swiss Alps": 55000,
  "Kyoto": 35000
};

// Set today's date as the earliest departure date.
const today = new Date();
const todayString = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0")
].join("-");

departure.min = todayString;
returnDate.min = todayString;

departure.addEventListener("change", () => {
  returnDate.min = departure.value || todayString;

  if (
    returnDate.value &&
    departure.value &&
    returnDate.value < departure.value
  ) {
    returnDate.value = "";
  }
});

// Search trips.
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const place = destination.value;
  const start = departure.value;
  const end = returnDate.value;
  const count = Number(travelers.value);

  if (!place || !start || !end) {
    searchMessage.textContent = "Please complete all search fields.";
    return;
  }

  if (start < todayString) {
    searchMessage.textContent = "Departure date cannot be in the past.";
    return;
  }

  if (end < start) {
    searchMessage.textContent =
      "Return date must be on or after departure date.";
    return;
  }

  bookingDestination.value = place;

  searchMessage.textContent =
    `Found your ${place} trip for ${count} traveler(s), ` +
    `from ${start} to ${end}. Estimated package total: ` +
    `₹${(prices[place] * count).toLocaleString("en-IN")}. ` +
    "Complete the booking form below.";

  document.getElementById("booking-details").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

// Book directly from a destination card.
document.querySelectorAll(".book-btn").forEach((button) => {
  button.addEventListener("click", () => {
    bookingDestination.value = button.dataset.destination;

    document.getElementById("booking-details").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    document.getElementById("fullName").focus({
      preventScroll: true
    });
  });
});

// Submit a demo booking.
bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const place = bookingDestination.value;

  if (!name || !email || !place) {
    alert("Please fill in all booking details.");
    return;
  }

  if (!prices[place]) {
    alert("Please select a valid destination.");
    return;
  }

  const reference = "WAN" + Date.now().toString().slice(-8);

  confirmation.replaceChildren();

  const heading = document.createElement("h3");
  heading.textContent = "Booking Request Created!";

  const greeting = document.createElement("p");
  greeting.textContent = `Thank you, ${name}.`;

  const destinationText = document.createElement("p");
  destinationText.textContent = `Destination: ${place}`;

  const totalText = document.createElement("p");
  totalText.textContent =
    `Estimated price per traveler: ₹${prices[place].toLocaleString("en-IN")}`;

  const emailText = document.createElement("p");
  emailText.textContent = `Contact email: ${email}`;

  const referenceText = document.createElement("p");
  referenceText.textContent = `Reference number: ${reference}`;

  const note = document.createElement("p");
  note.textContent =
    "Demo only: no payment was taken and no real reservation was made.";

  confirmation.append(
    heading,
    greeting,
    destinationText,
    totalText,
    emailText,
    referenceText,
    note
  );

  confirmation.hidden = false;
  confirmation.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
});
