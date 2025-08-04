// My Star Wars website for school assignment
const API_URL = 'https://swapi.py4e.com/api';

// functions to switch between pages
function showHome() {
    hideAllPages();
    document.getElementById('home-page').classList.remove('hidden');
}

function hideAllPages() {
    document.querySelectorAll('.page, #loading, #error').forEach(el => el.classList.add('hidden'));
}

function showLoading() {
    hideAllPages();
    document.getElementById('loading').classList.remove('hidden');
}

function showError(message = 'Something went wrong. Please try again.') {
    hideAllPages();
    const errorElement = document.getElementById('error');
    const errorText = errorElement.querySelector('p');
    if (errorText) errorText.textContent = message;
    errorElement.classList.remove('hidden');
}

// get data from star wars api
async function fetchData(category) {
    try {
        showLoading();
        let response = await fetch(`${API_URL}/${category}/`);
        
        if (!response.ok) {
            response = await fetch(`https://swapi.dev/api/${category}/`);
        }
        
        if (!response.ok) throw new Error(`Failed to fetch ${category}`);
        
        const data = await response.json();
        return data.results;
    } catch (error) {
        showError(`Failed to load ${category}. Please check your connection.`);
        return null;
    }
}

async function showCategory(category) {
    const items = getCustomCategoryData(category) || await fetchData(category);
    
    if (!items) return;
    
    hideAllPages();
    const categoryPage = document.getElementById(`${category}-page`);
    
    if (!categoryPage) {
        showError(`Page not found: ${category}`);
        return;
    }
    
    categoryPage.classList.remove('hidden');
    displayItems(category, items.slice(0, 6));
}

// display the items on page
function displayItems(category, items) {
    const container = document.querySelector(`#${category}-page .items-container`);
    if (!container) return;
    
    container.innerHTML = items.map(item => createItemCard(item)).join('');
}

function createItemCard(item) {
    const properties = getItemProperties(item);
    const propertiesHTML = Object.entries(properties)
        .map(([key, value]) => `
            <div class="item-property">
                <span class="property-label">${key}:</span>
                <span class="property-value">${value}</span>
            </div>
        `).join('');
    
    return `
        <div class="item-card">
            <div class="item-image">
                <img src="${item.image || 'assets/placeholder.jpg'}" 
                     alt="${item.title || item.name}" loading="lazy">
            </div>
            <div class="item-content">
                <h3>${item.title || item.name}</h3>
                ${propertiesHTML}
            </div>
        </div>
    `;
}

function getItemProperties(item) {
    const props = {};
    
    // Standardized properties mapping - each category has exactly 6 properties
    const propertyMap = {
        // People properties
        height: 'Height',
        mass: 'Mass', 
        hair_color: 'Hair Color',
        eye_color: 'Eye Color',
        birth_year: 'Birth Year',
        species: 'Species',
        
        // Planets properties
        diameter: 'Diameter',
        climate: 'Climate',
        terrain: 'Terrain',
        gravity: 'Gravity',
        population: 'Population',
        region: 'Region',
        
        // Vehicles properties
        model: 'Model',
        manufacturer: 'Manufacturer',
        length: 'Length',
        max_speed: 'Max Speed',
        crew: 'Crew',
        class: 'Class',
        
        // Films properties
        episode: 'Episode',
        director: 'Director',
        producer: 'Producer',
        release_date: 'Release Date',
        box_office: 'Box Office',
        trilogy: 'Trilogy'
    };
    
    Object.entries(propertyMap).forEach(([key, label]) => {
        if (item[key] && item[key] !== 'unknown' && item[key] !== 'n/a') {
            props[label] = item[key];
        }
    });
    
    return props;
}

// my custom data for the assignment instead of random api data
function getCustomCategoryData(category) {
    const customData = {
        people: [
            { name: "Obi-Wan Kenobi", height: "182 cm", mass: "77 kg", hair_color: "Auburn, White", eye_color: "Blue-Gray", birth_year: "57 BBY", species: "Human", image: "assets/obiwan.png" },
            { name: "Anakin Skywalker", height: "188 cm", mass: "84 kg", hair_color: "Blond", eye_color: "Blue", birth_year: "41.9 BBY", species: "Human", image: "assets/anakinskywalker.png" },
            { name: "Yoda", height: "66 cm", mass: "17 kg", hair_color: "White", eye_color: "Brown", birth_year: "896 BBY", species: "Unknown", image: "assets/yoda.jpg" },
            { name: "Boba Fett", height: "183 cm", mass: "78.2 kg", hair_color: "Black", eye_color: "Brown", birth_year: "31.5 BBY", species: "Human", image: "assets/bobafett.jpg" },
            { name: "Darth Maul", height: "175 cm", mass: "80 kg", hair_color: "None", eye_color: "Yellow", birth_year: "54 BBY", species: "Zabrak", image: "assets/darthmaul.jpg" },
            { name: "R2-D2", height: "96 cm", mass: "32 kg", hair_color: "N/A", eye_color: "Red", birth_year: "33 BBY", species: "Droid", image: "assets/r2d2.png" }
        ],
        planets: [
            { name: "Hoth", diameter: "7,200 km", climate: "Frozen", terrain: "Tundra, Ice Caves", gravity: "1.1 Standard", population: "Unknown", region: "Outer Rim", image: "assets/hoth.png" },
            { name: "Tatooine", diameter: "10,465 km", climate: "Arid", terrain: "Desert", gravity: "1.0 Standard", population: "200,000", region: "Outer Rim", image: "assets/tatooine.png" },
            { name: "Coruscant", diameter: "12,240 km", climate: "Temperate", terrain: "Cityscape", gravity: "1.0 Standard", population: "1 Trillion", region: "Core Worlds", image: "assets/coruscant.png" },
            { name: "Endor", diameter: "4,900 km", climate: "Temperate", terrain: "Forests, Mountains", gravity: "0.85 Standard", population: "30 Million", region: "Outer Rim", image: "assets/endor.png" },
            { name: "Naboo", diameter: "12,120 km", climate: "Temperate", terrain: "Grassy Hills, Swamps", gravity: "1.0 Standard", population: "4.5 Billion", region: "Mid Rim", image: "assets/naboo.png" },
            { name: "Geonosis", diameter: "11,370 km", climate: "Temperate, Arid", terrain: "Rock, Desert", gravity: "0.9 Standard", population: "100 Billion", region: "Outer Rim", image: "assets/geonesis.png" }
        ],
        vehicles: [
            { name: "TIE Fighter", model: "Twin Ion Engine", manufacturer: "Sienar Fleet Systems", length: "6.4 m", max_speed: "1,200 km/h", crew: "1 Pilot", class: "Starfighter", image: "assets/tiefighter.png" },
            { name: "X-wing", model: "T-65 X-wing", manufacturer: "Incom Corporation", length: "12.5 m", max_speed: "1,050 km/h", crew: "1 Pilot", class: "Starfighter", image: "assets/xwing.png" },
            { name: "Millennium Falcon", model: "YT-1300 Freighter", manufacturer: "Corellian Engineering", length: "34.37 m", max_speed: "1,050 km/h", crew: "4 Members", class: "Light Freighter", image: "assets/milleniumfalcon.png" },
            { name: "AT-AT", model: "All Terrain Armored", manufacturer: "Kuat Drive Yards", length: "20 m", max_speed: "60 km/h", crew: "5 Members", class: "Assault Walker", image: "assets/atat.png" },
            { name: "Imperial Star Destroyer", model: "Imperial I-class", manufacturer: "Kuat Drive Yards", length: "1,600 m", max_speed: "975 km/h", crew: "47,000 Members", class: "Star Destroyer", image: "assets/imperialstardestroyer.png" },
            { name: "AT-ST", model: "All Terrain Scout", manufacturer: "Kuat Drive Yards", length: "2 m", max_speed: "90 km/h", crew: "2 Members", class: "Scout Walker", image: "assets/atst.png" }
        ],
        films: [
            { title: "A New Hope", episode: "Episode IV", director: "George Lucas", producer: "Gary Kurtz", release_date: "May 25, 1977", box_office: "$775.4 Million", trilogy: "Original Trilogy", image: "assets/episode4pic.png" },
            { title: "The Empire Strikes Back", episode: "Episode V", director: "Irvin Kershner", producer: "Gary Kurtz", release_date: "May 17, 1980", box_office: "$547.9 Million", trilogy: "Original Trilogy", image: "assets/episode5pic.jpg" },
            { title: "Return of the Jedi", episode: "Episode VI", director: "Richard Marquand", producer: "Howard Kazanjian", release_date: "May 25, 1983", box_office: "$475.1 Million", trilogy: "Original Trilogy", image: "assets/episode6pic.png" },
            { title: "The Phantom Menace", episode: "Episode I", director: "George Lucas", producer: "Rick McCallum", release_date: "May 19, 1999", box_office: "$1.027 Billion", trilogy: "Prequel Trilogy", image: "assets/episode1pic.png" },
            { title: "Attack of the Clones", episode: "Episode II", director: "George Lucas", producer: "Rick McCallum", release_date: "May 16, 2002", box_office: "$653.8 Million", trilogy: "Prequel Trilogy", image: "assets/episode2pic.png" },
            { title: "Revenge of the Sith", episode: "Episode III", director: "George Lucas", producer: "Rick McCallum", release_date: "May 19, 2005", box_office: "$868.4 Million", trilogy: "Prequel Trilogy", image: "assets/episode3pic.jpg" }
        ]
    };
    
    return customData[category] || null;
}