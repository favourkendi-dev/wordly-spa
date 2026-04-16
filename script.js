// Selecting DOM elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultDisplay = document.getElementById('result-display');
const historyList = document.getElementById('history-list');
const welcomeContent = document.getElementById('welcome-content'); // New

// The Event Listener
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const word = searchInput.value.trim();
    if (!word) return;

    // Am hiding the welcome content and showingthe results
    if (welcomeContent) welcomeContent.style.display = 'none';
    resultDisplay.style.display = 'block';
    resultDisplay.innerHTML = "<p>Searching Wordly database...</p>";

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        
        if (!response.ok) throw new Error("Word not found. Try another search!");

        const data = await response.json();
        
        // Am building the UI
        renderWord(data[0]);
        
        // Updating Sidebar History
        addToHistory(word);
        
        // Updating css using Javascript
        applySuccessStyles();

    } catch (error) {
        resultDisplay.innerHTML = `<p style="color: #ef4444; font-weight: bold; text-align: center;">${error.message}</p>`;
    }
});

function renderWord(data) {
    const audioData = data.phonetics.find(p => p.audio !== "");
    
    let htmlContent = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <h2 class="word-title">${data.word}</h2>
            <button class="save-btn" onclick="saveToFavorites('${data.word}')">Save</button>
        </div>
        <p class="phonetic">${data.phonetic || ''}</p>
        ${audioData ? `<button class="audio-btn" onclick="new Audio('${audioData.audio}').play()">Play Pronunciation 🔊</button>` : ''}
    `;

    // i added word origin 
    if (data.origin) {
        htmlContent += `
            <div class="origin-box" style="background: #f8fafc; padding: 15px; border-radius: 10px; margin: 15px 0; border-left: 4px solid #cbd5e1;">
                <p style="margin: 0; font-size: 0.85rem; color: #64748b;"><strong>ORIGIN:</strong> ${data.origin}</p>
            </div>
        `;
    }

    data.meanings.forEach(meaning => {
        htmlContent += `
            <div class="meaning-block">
                <span class="pos">${meaning.partOfSpeech}</span>
                <p class="definition">${meaning.definitions[0].definition}</p>
            </div>
        `;
    });

    // share bar
    htmlContent += `
        <div class="share-bar" style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; display: flex; align-items: center; gap: 15px;">
            <span style="font-size: 0.8rem; color: #94a3b8;">Share word:</span>
            <span style="cursor: pointer; opacity: 0.6;"></span>
            <span style="cursor: pointer; opacity: 0.6;"></span>
            <span style="cursor: pointer; opacity: 0.6;"></span>
        </div>
    `;

    resultDisplay.innerHTML = htmlContent;
}
// the helper function

// Added word to Recent History
function addToHistory(word) {
    const li = document.createElement('li');
    li.textContent = word;
    li.style.textTransform = "capitalize";
    historyList.prepend(li);
    
    if (historyList.children.length > 5) {
        historyList.lastElementChild.remove();
    }
}

// Saved word to Favorites Card
function saveToFavorites(word) {
    const favList = document.getElementById('favorites-list');
    
    // Prevent duplicates
    const existing = Array.from(favList.children).map(item => item.textContent.toLowerCase());
    if (existing.includes(word.toLowerCase())) return;

    const li = document.createElement('li');
    li.textContent = word;
    
    // updating style
    li.style.color = "var(--primary-color)";
    li.style.fontWeight = "bold";
    li.style.padding = "10px";
    li.style.borderBottom = "1px solid #eee";
    
    favList.prepend(li);
}

// Function for the "Trending" 
function quickSearch(word) {
    searchInput.value = word;
    //  triggering the form submission
    searchForm.dispatchEvent(new Event('submit'));
}

//Styling Function
function applySuccessStyles() {
    resultDisplay.style.borderTop = "6px solid var(--primary-color)";
    resultDisplay.style.backgroundColor = "#ffffff";
    
    // Animating the progress bar
    const bar = document.getElementById('progress-bar');
    if (bar) bar.style.width = "85%";
}