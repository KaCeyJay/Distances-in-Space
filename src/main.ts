/* ------------------------------------------------ */
/*               Interfaces                         */
/* ------------------------------------------------ */
/* Part 2.1: >= 1 interface for data structures     */
/* ------------------------------------------------ */
interface CelestialObject
{
    id: string;
    name: string;
    distanceFromEarthKm: number;
}

interface MeasuringUnit
{
    id: string;
    name: string;
    lengthMeters: number;
}


interface SpaceFact
{
    id: number;
    text: string;
}

/* ------------------------------------------------ */
/*                Populate Dropdowns                */
/* ------------------------------------------------ */
/* Part 2.2: >= 2 functions with params and return  */
/* ------------------------------------------------ */
function populateDropdown(dropdownId: string, items: { id: string; name: string }[]): void
{
    const dropDown = document.getElementById(dropdownId);

    if (!(dropDown instanceof HTMLSelectElement))
    {
        return;
    }

    items.forEach((item) =>
    {
        const option = document.createElement("option");

        option.value = item.id;
        option.textContent = item.name;

        dropDown.appendChild(option);
    });
}

/* ------------------------------------------------ */
/*                Calculate Distance                */
/*       between Earth and Celestial Objects        */
/* ------------------------------------------------ */
/* Part 2.2: >= 2 functions with params and return  */
/* ------------------------------------------------ */
function calculateDistance(distanceKm: number, unitLengthMeters: number): number
{
    return (distanceKm * 1000) / unitLengthMeters;
}

/* ------------------------------------------------ */
/*                Load Data                         */
/* ------------------------------------------------ */
/* Part 2.2: >= 2 functions with params and return  */
/* ------------------------------------------------ */
async function loadData<T>(path: string): Promise<T>
{
    const response = await fetch(path);

    if (!response.ok)
        throw new Error(`Could not load ${path}`);

    return response.json() as Promise<T>;
}

/* ------------------------------------------------ */
/*                   Init Home                      */                     
/* ------------------------------------------------ */
function initializeHome(): void
{
    // Get references to the "Home" link, slogan, and about section
    const homeLink = document.getElementById("home-link");
    const slogan = document.getElementById("hero-slogan");
    const about = document.getElementById("hero-about");

    if (!homeLink || !slogan || !about)
         return;

    homeLink.addEventListener("click", (): void =>
    {
        slogan.hidden = false;
        about.hidden = true;
    });
}

/* ------------------------------------------------ */
/*                   Init About                     */
/* ------------------------------------------------ */
function initializeAbout(): void
{
    // Get references to the "About" link, slogan, and about section
    const aboutLink = document.getElementById("about-link");
    const slogan = document.getElementById("hero-slogan");
    const about = document.getElementById("hero-about");

    if (!aboutLink || !slogan || !about)
         return;

    aboutLink.addEventListener("click", (): void =>
    {
        slogan.hidden = true;
        about.hidden = false;
    });
}

/* ------------------------------------------------ */
/*                Init Calculator                   */
/* ------------------------------------------------ */
async function initializeCalculator(): Promise<void>
{
    // Load data from JSON files
    const objects = await loadData<CelestialObject[]>("/data/data_distance.json");
    const units = await loadData<MeasuringUnit[]>("/data/data_units.json");
    const facts = await loadData<SpaceFact[]>("/data/data_facts.json");   

    // Populate Dropdowns with objects and units
    populateDropdown("destination", objects);
    populateDropdown("unit", units);

    // Get references to form elements
    const form = document.getElementById("distance-form");
    const destinationDropdown = document.getElementById("destination");
    const unitSelect = document.getElementById("unit");
    const result = document.getElementById("result");
    const factElement = document.getElementById("space-fact-text");

    // Display a random space fact
    if (factElement && facts.length > 0)
    {
        const randomIndex = Math.floor(Math.random() * facts.length);
        factElement.textContent = facts[randomIndex].text;
    }

    if (!(form instanceof HTMLFormElement) || !(destinationDropdown instanceof HTMLSelectElement) || !(unitSelect instanceof HTMLSelectElement) || !(result instanceof HTMLOutputElement))
        throw new Error("Calculator elements not found");

    // Add event listener for form submission
    form.addEventListener("submit", (event: SubmitEvent): void =>
    {
        event.preventDefault();

        // Get selected destination and unit
        const destination = objects.find((object) => object.id === destinationDropdown.value);
        const unit = units.find((item) => item.id === unitSelect.value);

        if (!destination || !unit || unit.lengthMeters <= 0)
        {
            result.textContent = "Please select a destination and a unit.";
            return;
        }

        // Calculate distance and format the result
        const amount = calculateDistance(destination.distanceFromEarthKm, unit.lengthMeters);
        const formattedAmount = amount.toLocaleString("en-US", {maximumFractionDigits: 2});

        // Display the result in a beautiful way
        const prefix = document.createElement("span");
        prefix.textContent = `From Earth to ${destination.name}: `;
        const value = document.createElement("span");
        value.className = "result-value";
        value.textContent = `${formattedAmount} ${unit.name}`;
        const suffix = document.createElement("span");
        suffix.textContent = "!";

        // Clear previous result and append new result
        result.replaceChildren(prefix, value, suffix);

    });

}

// Call the initializeCalculator function and handle any errors
initializeCalculator().catch(console.error);
// Call the initializeAbout function
initializeAbout();
// Call the initializeHome function
initializeHome();