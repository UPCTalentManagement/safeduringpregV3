// script.js
let allDrugs = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('drugs.json')
        .then(response => response.json())
        .then(data => {
            allDrugs = data;
            initCategories();
            performSearch();
        });

    document.getElementById('searchInput').addEventListener('input', performSearch);
});

function initCategories() {
    const categories = [...new Set(allDrugs.map(drug => drug.category))];
    const grid = document.getElementById('categoryGrid');
    
    categories.forEach(category => {
        if (countOTCByCategory(category) === 0) return;
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <h3>${category}</h3>
            <p>${countOTCByCategory(category)} OTC Options</p>
        `;
        card.addEventListener('click', () => {
            window.location.href = `category.html?category=${encodeURIComponent(category)}`;
        });
        grid.appendChild(card);
    });
}

function countOTCByCategory(category) {
    return allDrugs.filter(drug => 
        drug.category === category && drug.otc
    ).length;
}

function performSearch() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const results = allDrugs.filter(drug => {
        const searchFields = [
            drug.generic,
            ...drug.tradeNames,
            drug.category
        ].join(' ').toLowerCase();
        
        return term.split(' ').every(part => 
            searchFields.includes(part)
        );
    });

    displayResults(results);
}

function displayResults(results) {
    const container = document.getElementById('searchResults');
    container.innerHTML = '';

    if (results.length === 0) {
        container.innerHTML = `<p class="no-results">No medications found. Try different terms or check spelling.</p>`;
        return;
    }

    results.forEach(drug => {
        const card = document.createElement('div');
        card.className = 'drug-card';
        card.innerHTML = `
            ${drug.otc ? '<div class="otc-tag">OTC</div>' : '<div class="rx-tag">Rx Only</div>'}
            ${drug.contra ? '<div class="contraindicated">Contraindicated</div>' : ''}
            <h3>${drug.generic}</h3>
            <p><strong>Brands:</strong> ${drug.tradeNames.join(', ')}</p>
            <p><strong>Pregnancy Safety:</strong> ${drug.pregnancySafety}</p>
            <p><strong>Lactation Safety:</strong> ${drug.Lactation}</p>
        `;
        container.appendChild(card);
    });
}