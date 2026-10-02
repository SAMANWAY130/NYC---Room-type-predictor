/*
 * Change this URL when your FastAPI backend is deployed.
 * Local FastAPI example:
 * http://127.0.0.1:8000
 */
const API_BASE_URL = "http://127.0.0.1:8000";

const neighbourhoods = [
    "Kensington", "Midtown", "Harlem", "Clinton Hill", "East Harlem",
    "Murray Hill", "Bedford-Stuyvesant", "Hell's Kitchen", "Upper West Side",
    "Chinatown", "South Slope", "West Village", "Williamsburg", "Fort Greene",
    "Chelsea", "Crown Heights", "Park Slope", "Windsor Terrace", "Inwood",
    "East Village", "Greenpoint", "Bushwick", "Flatbush", "Lower East Side",
    "Prospect-Lefferts Gardens", "Long Island City", "Kips Bay", "SoHo",
    "Upper East Side", "Prospect Heights", "Washington Heights", "Woodside",
    "Brooklyn Heights", "Carroll Gardens", "Gowanus", "Flatlands",
    "Cobble Hill", "Flushing", "Boerum Hill", "Sunnyside", "DUMBO",
    "St. George", "Highbridge", "Financial District", "Ridgewood",
    "Morningside Heights", "Jamaica", "Middle Village", "NoHo",
    "Ditmars Steinway", "Flatiron District", "Roosevelt Island",
    "Greenwich Village", "Little Italy", "East Flatbush", "Tompkinsville",
    "Astoria", "Clason Point", "Eastchester", "Kingsbridge", "Two Bridges",
    "Queens Village", "Rockaway Beach", "Forest Hills", "Nolita", "Woodlawn",
    "University Heights", "Gravesend", "Gramercy", "Allerton", "East New York",
    "Theater District", "Concourse Village", "Sheepshead Bay", "Emerson Hill",
    "Fort Hamilton", "Bensonhurst", "Tribeca", "Shore Acres", "Sunset Park",
    "Concourse", "Elmhurst", "Brighton Beach", "Jackson Heights",
    "Cypress Hills", "St. Albans", "Arrochar", "Rego Park", "Wakefield",
    "Clifton", "Bay Ridge", "Graniteville", "Spuyten Duyvil", "Stapleton",
    "Briarwood", "Ozone Park", "Columbia St", "Vinegar Hill", "Mott Haven",
    "Longwood", "Canarsie", "Battery Park City", "Civic Center", "East Elmhurst",
    "New Springville", "Morris Heights", "Arverne", "Cambria Heights",
    "Tottenville", "Mariners Harbor", "Concord", "Borough Park", "Bayside",
    "Downtown Brooklyn", "Port Morris", "Fieldston", "Kew Gardens", "Midwood",
    "College Point", "Mount Eden", "City Island", "Glendale", "Port Richmond",
    "Red Hook", "Richmond Hill", "Bellerose", "Maspeth", "Williamsbridge",
    "Soundview", "Woodhaven", "Woodrow", "Co-op City", "Stuyvesant Town",
    "Parkchester", "North Riverdale", "Dyker Heights", "Bronxdale", "Sea Gate",
    "Riverdale", "Kew Gardens Hills", "Bay Terrace", "Norwood",
    "Claremont Village", "Whitestone", "Fordham", "Bayswater", "Navy Yard",
    "Brownsville", "Eltingville", "Fresh Meadows", "Mount Hope",
    "Lighthouse Hill", "Springfield Gardens", "Howard Beach", "Belle Harbor",
    "Jamaica Estates", "Van Nest", "Morris Park", "West Brighton",
    "Far Rockaway", "South Ozone Park", "Tremont", "Corona", "Great Kills",
    "Manhattan Beach", "Marble Hill", "Dongan Hills", "Castleton Corners",
    "East Morrisania", "Hunts Point", "Neponsit", "Pelham Bay", "Randall Manor",
    "Throgs Neck", "Todt Hill", "West Farms", "Silver Lake", "Morrisania",
    "Laurelton", "Grymes Hill", "Holliswood", "Pelham Gardens", "Belmont",
    "Rosedale", "Edgemere", "New Brighton", "Midland Beach", "Baychester",
    "Melrose", "Bergen Beach", "Richmondtown", "Howland Hook", "Schuylerville",
    "Coney Island", "New Dorp Beach", "Prince's Bay", "South Beach",
    "Bath Beach", "Jamaica Hills", "Oakwood", "Castle Hill", "Hollis",
    "Douglaston", "Huguenot", "Olinville", "Edenwald", "Grant City",
    "Westerleigh", "Bay Terrace, Staten Island", "Westchester Square",
    "Little Neck", "Fort Wadsworth", "Rosebank", "Unionport", "Mill Basin",
    "Arden Heights", "Bull's Head", "New Dorp", "Rossville", "Breezy Point",
    "Willowbrook"
];

const neighbourhoodSelect = document.getElementById("neighbourhood");
const form = document.getElementById("houseForm");
const button = document.getElementById("predictBtn");
const errorBox = document.getElementById("errorBox");
const resultValue = document.getElementById("resultValue");
const resultDescription = document.getElementById("resultDescription");
const resultSymbol = document.getElementById("resultSymbol");
const apiStatus = document.getElementById("apiStatus");

const descriptions = {
    "Entire home/apt": "The model classifies this listing as an entire home or apartment.",
    "Private room": "The model classifies this listing as a private room within a property.",
    "Shared room": "The model classifies this listing as a shared room.",
    "Hotel room": "The model classifies this listing as a hotel-style room."
};

function populateNeighbourhoods() {
    neighbourhoods.forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        neighbourhoodSelect.appendChild(option);
    });
}

function numberValue(id) {
    return Number(document.getElementById(id).value);
}

function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.add("show");
}

function clearError() {
    errorBox.textContent = "";
    errorBox.classList.remove("show");
}

function setLoading(isLoading) {
    button.classList.toggle("loading", isLoading);
    button.querySelector(".btn-text").textContent =
        isLoading ? "CONSULTING THE ENGINE..." : "CLASSIFY PROPERTY";
    apiStatus.textContent = isLoading ? "PROCESSING" : "READY";
}

function displayPrediction(roomType) {
    const cleanType = String(roomType).replace(/_/g, " ").trim();
    resultValue.innerHTML = cleanType || "Unknown";
    resultValue.classList.remove("revealed");

    // Restart CSS animation.
    void resultValue.offsetWidth;
    resultValue.classList.add("revealed");

    resultSymbol.textContent = cleanType ? cleanType.charAt(0).toUpperCase() : "?";
    resultDescription.textContent =
        descriptions[cleanType] ||
        `The model returned "${cleanType}" as the predicted room classification.`;
    apiStatus.textContent = "SUCCESS";
}

form.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearError();

    const payload = {
        neighbourhood_group: document.getElementById("neighbourhood_group").value,
        neighbourhood: document.getElementById("neighbourhood").value,
        latitude: numberValue("latitude"),
        longitude: numberValue("longitude"),
        price: numberValue("price"),
        minimum_nights: numberValue("minimum_nights"),
        number_of_reviews: numberValue("number_of_reviews"),
        reviews_per_month: numberValue("reviews_per_month"),
        calculated_host_listings_count: numberValue("calculated_host_listings_count"),
        availability_365: numberValue("availability_365")
    };

    // Client-side validation before the request.
    if (payload.price <= 0) {
        showError("Price must be greater than 0.");
        return;
    }

    if (payload.availability_365 < 0 || payload.availability_365 > 365) {
        showError("Availability must be between 0 and 365.");
        return;
    }

    setLoading(true);

    try {
        const response = await fetch(`${API_BASE_URL}/predict/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            let detail = `Server returned HTTP ${response.status}.`;
            try {
                const errorData = await response.json();
                if (errorData.detail) {
                    detail = Array.isArray(errorData.detail)
                        ? errorData.detail.map(x => x.msg).join(", ")
                        : errorData.detail;
                }
            } catch (_) {}
            throw new Error(detail);
        }

        const data = await response.json();

        if (!data.room_type) {
            throw new Error("The API response did not contain 'room_type'.");
        }

        displayPrediction(data.room_type);

    } catch (error) {
        apiStatus.textContent = "ERROR";
        showError(
            "Could not connect to the FastAPI backend. Make sure FastAPI is running and the API URL in script.js is correct. " +
            `Details: ${error.message}`
        );
    } finally {
        setLoading(false);
    }
});

// Create subtle floating particles.
function createParticles() {
    const container = document.getElementById("particles");

    for (let i = 0; i < 35; i++) {
        const particle = document.createElement("span");
        particle.className = "particle";
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${8 + Math.random() * 14}s`;
        particle.style.animationDelay = `${Math.random() * -15}s`;
        particle.style.opacity = `${0.15 + Math.random() * 0.5}`;
        container.appendChild(particle);
    }
}

populateNeighbourhoods();
createParticles();
