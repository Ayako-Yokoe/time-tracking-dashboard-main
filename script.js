const periodOptions = document.querySelectorAll("li");
const dataSection = document.querySelector(".data-section");

let jsonData = [];
let currentPeriod = "daily";

// Fetch Data
async function fetchData() {
    try {
        const response = await fetch("./data.json");
        if (!response.ok) {
            throw new Error("Error fetching data");
        }
        jsonData = await response.json();
        displayCards();
    } catch (error) {
        console.log(error);
    }
}

// Sanitize Class Name
function sanitizeClassName(title) {
    return title.toLowerCase().replace(/\s+/g, "-");
}

// Dynamically Create and Display Cards
function displayCards() {
    dataSection.innerHTML = "";
    jsonData.forEach((data) => {
        const sanitizedClassName = sanitizeClassName(data.title);
        const card = document.createElement("article");
        card.className = `data-card ${sanitizedClassName}`;
        card.innerHTML = `
            <div class="contents">
                <div class="content-top">
                    <p>${data.title}</p>
                    <button aria-label="More options">
                        <img
                            src="./images/icon-ellipsis.svg"
                            alt="Ellipsis menu"
                        />
                    </button>
                </div>
                <div class="data">
                    <p class="current">
                    ${data.timeframes[currentPeriod].current}
                    ${
                        data.timeframes[currentPeriod].current <= 1
                            ? "hr"
                            : "hrs"
                    }</p>
                    <p class="previous">${
                        currentPeriod === "daily"
                            ? "Yesterday"
                            : currentPeriod === "weekly"
                            ? "Last Week"
                            : "Last Month"
                    } - ${data.timeframes[currentPeriod].previous}
                    ${
                        data.timeframes[currentPeriod].previous <= 1
                            ? "hr"
                            : "hrs"
                    }</p>
                </div>
            </div>
        `;
        dataSection.appendChild(card);
    });
}

// Handle Period change
function handleSetPeriod(e) {
    periodOptions.forEach((li) => {
        li.classList.remove("selected");
    });
    e.target.classList.add("selected");
    currentPeriod = e.target.innerText.toLowerCase();
    displayCards();
}

// Dynamically add event listeners to li
periodOptions.forEach((li) => {
    li.addEventListener("click", handleSetPeriod);
});

fetchData();
