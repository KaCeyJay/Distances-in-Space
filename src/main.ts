/* ------------------------------------------------ */
/*               Interfaces                         */
/* ------------------------------------------------ */
/* Part 2.1: >= 1 interface for data structures     */
/* ------------------------------------------------ */
interface CelestialObject
{
    id: string;
    en: string;
    de: string;
    distanceFromEarthKm: number;
}

interface MeasuringUnit
{
    id: string;
    en: string;
    de: string;
    lengthMeters: number;
}


interface SpaceFact
{
    id: number;
    en: string;
    de: string;
}

/* ------------------------------------------------ */
/*                Populate Dropdowns                */
/* ------------------------------------------------ */
/* Part 2.2: >= 2 functions with params and return  */
/* ------------------------------------------------ */
function populateDropdown(dropdownId: string, items: { id: string; en: string; de: string }[], language: "de" | "en"): void
{
    const dropDown = document.getElementById(dropdownId);

    if (!(dropDown instanceof HTMLSelectElement))
        return;

    const prevValue = dropDown.value;

     // Clear existing options
    dropDown.replaceChildren();

    items.forEach((item) =>
    {
        const option = document.createElement("option");

        option.value = item.id;
        option.textContent = item[language];

        dropDown.appendChild(option);
    });

    // Restore previous selection if it exists
    if (prevValue)
        dropDown.value = prevValue;
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
/*                Set Language                       */
/* ------------------------------------------------ */
/* Part 2.2: >= 2 functions with params and return  */
/* ------------------------------------------------ */
async function setLanguage(language: "de" | "en"): Promise<void>
{
    const translations = await loadData<Record<string, string>>(`/locales/${language}.json`);
    const factElement = document.getElementById("space-fact-text");
    const form = document.getElementById("distance-form");
    const result = document.getElementById("result");

    currentTranslations = translations;

    document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((element) =>
    {
        const key = element.dataset.i18n;
        if (key && translations[key])
            element.textContent = translations[key];
    });

    if (factElement && selectedFact)
        factElement.textContent = selectedFact[language];
    if (celestialObjects.length > 0)
        populateDropdown("destination", celestialObjects, language);
    if (measuringUnits.length > 0)
        populateDropdown("unit", measuringUnits, language);

    renderResult();
    document.documentElement.lang = language;
}

/* ------------------------------------------------ */
/*                Render Result                     */
/* ------------------------------------------------ */
function renderResult(): void
{
    if(!lastCalculation)
        return;

    const destination = celestialObjects.find((object) => object.id === lastCalculation.destinationId);
    const unit = measuringUnits.find((item) => item.id === lastCalculation.unitId);
    const result = document.getElementById("result");

    if (!destination || !unit || !(result instanceof HTMLOutputElement))
        return;

    const amount = calculateDistance(destination.distanceFromEarthKm, unit.lengthMeters);
    const formattedAmount = amount.toLocaleString(currentLanguage === "de" ? "de-AT" : "en-US", {maximumFractionDigits: 2});
    const prefix = document.createElement("span");
    prefix.textContent = `${currentTranslations["resultPrefix"]}${destination[currentLanguage]}: `;
    const value = document.createElement("span");
    value.className = "result-value";
    value.textContent = `${formattedAmount} ${unit[currentLanguage]}`;
    const suffix = document.createElement("span");
    suffix.textContent = `${currentTranslations["resultSuffix"]}`;

    result.replaceChildren(prefix, value, suffix);
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
    const disclosure = document.getElementById("hero-ai-disclosure");

    if (!homeLink || !slogan || !about || !disclosure)
         return;

    homeLink.addEventListener("click", (): void =>
    {
        slogan.hidden = false;
        about.hidden = true;
        disclosure.hidden = true;
    });
}

/* ------------------------------------------------ */
/*                   Init AI Disclosure             */
/* ------------------------------------------------ */
function initializeAIDisclosure(): void
{
    // Get references to the "AI Disclosure" link, slogan, about section, and disclosure section
    const link = document.getElementById("ai-disclosure-link");
    const slogan = document.getElementById("hero-slogan");
    const about = document.getElementById("hero-about");
    const disclosure = document.getElementById("hero-ai-disclosure");

    if (!link || !slogan || !about || !disclosure)
         return;

    link.addEventListener("click", (): void =>
    {
        slogan.hidden = true;
        about.hidden = true;
        disclosure.hidden = false;
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
    const disclosure = document.getElementById("hero-ai-disclosure");

    if (!aboutLink || !slogan || !about || !disclosure)
         return;

    aboutLink.addEventListener("click", (): void =>
    {
        slogan.hidden = true;
        about.hidden = false;
        disclosure.hidden = true;
    });
}

/* ------------------------------------------------ */
/*                Init Calculator                   */
/* ------------------------------------------------ */
async function initializeCalculator(): Promise<void>
{
    // Load data from JSON files
    celestialObjects = await loadData<CelestialObject[]>("/data/data_distance.json");
    measuringUnits = await loadData<MeasuringUnit[]>("/data/data_units.json");
    const facts = await loadData<SpaceFact[]>("/data/data_facts.json");   

    // Populate Dropdowns with objects and units
    populateDropdown("destination", celestialObjects, currentLanguage);
    populateDropdown("unit", measuringUnits, currentLanguage);

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
        selectedFact = facts[randomIndex];
        factElement.textContent = selectedFact[currentLanguage];
    }

    if (!(form instanceof HTMLFormElement) || !(destinationDropdown instanceof HTMLSelectElement) || !(unitSelect instanceof HTMLSelectElement) || !(result instanceof HTMLOutputElement))
        throw new Error("Calculator elements not found");

    // Add event listener for form submission
    form.addEventListener("submit", (event: SubmitEvent): void =>
    {
        event.preventDefault();

        // Get selected destination and unit
        const destination = celestialObjects.find((object) => object.id === destinationDropdown.value);
        const unit = measuringUnits.find((item) => item.id === unitSelect.value);

        if (!destination || !unit || unit.lengthMeters <= 0)
        {
            result.textContent = "Please select a destination and a unit.";
            return;
        }
        lastCalculation = { destinationId: destination.id, unitId: unit.id };
        renderResult();
    });
}

/* ------------------------------------------------ */
/*                  MAIN EXECUTION                  */
/* ------------------------------------------------ */

// Global variables to hold celestial objects and measuring units
let celestialObjects: CelestialObject[] = [];
// Global variable to hold measuring units
let measuringUnits: MeasuringUnit[] = [];
// SpaceFact variable to hold the selected fact
let selectedFact: SpaceFact | null = null;
// Initialize the language toggle functionality
let currentLanguage: "de" | "en" = "en";
const languageToggle = document.getElementById("language-toggle");
languageToggle?.addEventListener("click", async (): Promise<void> =>
{
    currentLanguage = currentLanguage === "de" ? "en" : "de";
    await setLanguage(currentLanguage);
    languageToggle.textContent = currentLanguage === "de" ? "EN" : "DE";
});
let currentTranslations: Record<string, string> = {};
// Global variable to hold the last calculation
let lastCalculation: { destinationId: string; unitId: string};

// Call the initializeCalculator function and handle any errors
initializeCalculator().catch(console.error);
// Call the initializeAbout function
initializeAbout();
// Call the initializeHome function
initializeHome();
// Call the initializeAIDisclosure function
initializeAIDisclosure();
// Set the default language to English and handle any errors
setLanguage("en").catch(console.error);