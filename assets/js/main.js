$(document).ready(function () {
    const usdApiUrl = "https://api.coingecko.com/api/v3/coins/markets?order=market_cap_desc&vs_currency=usd";
    const ilsApiUrl = "https://api.coingecko.com/api/v3/coins/markets?order=market_cap_desc&vs_currency=ils";
    const eurApiUrl = "https://api.coingecko.com/api/v3/coins/markets?order=market_cap_desc&vs_currency=eur";
    const cacheDuration = 2 * 60 * 1000; // 2 minutes in milliseconds
    let selectedCoins = JSON.parse(localStorage.getItem('selectcoins')) || []; // Load selected coins from localStorage
    let chartsCoins = JSON.parse(localStorage.getItem('chartscoins')) || []; // Load charts coins from localStorage

    // this is search bar full code script!!
    let searchTimer;

    document.getElementById('searchInput').addEventListener('input', function() {
        clearTimeout(searchTimer);

        if (this.value.trim() === "") {
            searchTimer = setTimeout(function() {
                if (typeof loadCoins === 'function') {
                    loadCoins();
                } else {
                    console.error('loadCoins is not defined');
                }
            }, 500);
        } else {
            performPartialSearch();
        }
    });

    document.querySelector('.btn-outline-success').addEventListener('click', function() {
        performExactSearch();
    });

    document.getElementById('searchInput').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            performExactSearch();
        }
    });

    function performPartialSearch() {
        let input = document.getElementById('searchInput').value.trim().toUpperCase();
        if (input === "") {
            if (typeof loadCoins === 'function') {
                loadCoins();
            } else {
                console.error('loadCoins is not defined');
            }
            return;
        }

        let usdCoins = JSON.parse(localStorage.getItem('usdCoinsData')) || [];
        let ilsCoins = JSON.parse(localStorage.getItem('ilsCoinsData')) || [];
        let eurCoins = JSON.parse(localStorage.getItem('eurCoinsData')) || [];
        let selectedCoins = JSON.parse(localStorage.getItem('selectcoins')) || [];
        let filteredCoins = usdCoins.filter(coin => 
            coin.name.toUpperCase().includes(input) || 
            coin.symbol.toUpperCase().includes(input)
        );

        displayCoins(filteredCoins, ilsCoins, eurCoins, selectedCoins);
    }

    function performExactSearch() {
        let input = document.getElementById('searchInput').value.trim().toUpperCase();
        if (input === "") {
            if (typeof loadCoins === 'function') {
                loadCoins();
            } else {
                console.error('loadCoins is not defined');
            }
            return;
        }

        let usdCoins = JSON.parse(localStorage.getItem('usdCoinsData')) || [];
        let ilsCoins = JSON.parse(localStorage.getItem('ilsCoinsData')) || [];
        let eurCoins = JSON.parse(localStorage.getItem('eurCoinsData')) || [];
        let selectedCoins = JSON.parse(localStorage.getItem('selectcoins')) || [];
        let filteredCoins = usdCoins.filter(coin => 
            coin.name.toUpperCase() === input || 
            coin.symbol.toUpperCase() === input
        );

        displayCoins(filteredCoins, ilsCoins, eurCoins, selectedCoins);
    }

    function displayCoins(filteredCoins, ilsCoins, eurCoins, selectedCoins) {
        let cryptoCardsContainer = document.querySelector('.main');
        cryptoCardsContainer.innerHTML = '';

        if (filteredCoins.length === 0) {
            cryptoCardsContainer.innerHTML = '';
        } else {
            let row = document.createElement('div');
            row.className = 'row mt-3';
            cryptoCardsContainer.appendChild(row);

            filteredCoins.forEach((coin, index) => {
                if (index % 4 === 0 && index !== 0) {
                    row = document.createElement('div');
                    row.className = 'row mt-3';
                    cryptoCardsContainer.appendChild(row);
                }

                const usdPrice = coin.current_price || 'N/A';
                const ilsPrice = ilsCoins[index]?.current_price || 'N/A';
                const eurPrice = eurCoins[index]?.current_price || 'N/A';

                const coinCard = `
                    <div class="col-md-3">
                        <div class="card crypto-card h-100" style="width:100%;height:100%;">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <div class="left-content d-flex align-items-center">
                                        <img class="card-img" src="${coin.image}" alt="Card image" style="width: 50px;margin-right: 10px;">
                                        <div style="width:120px;word-wrap:break-word !important;">
                                            <h4 class="card-title" style="font-weight: bold; font-size: 1.25rem; line-height: 1.3;">${coin.symbol.toUpperCase()}</h4>
                                            <p class="card-text" style="line-height: 1.3;">${coin.name}</p>
                                        </div>
                                    </div>
                                    <label class="switch">
                                        <input type="checkbox" class="coin-checkbox" data-coin-id="${coin.id}" data-coin-symbol="${coin.symbol}" ${selectedCoins.includes(coin.id) ? 'checked' : ''}>
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                <div class="text-center mt-3">
                                    <button class="btn btn-primary more-info-btn" data-coin-id="${coin.id}">
                                        More Info
                                    </button>
                                    <div class="more-info-content mt-3"></div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                row.appendChild(document.createRange().createContextualFragment(coinCard));
            });

            attachMoreInfoListeners();
            attachCheckboxListeners();
        }
    }

    function attachMoreInfoListeners() {
        document.querySelectorAll('.more-info-btn').forEach(button => {
            button.addEventListener('click', function() {
                const coinId = this.getAttribute('data-coin-id');
                const infoContent = this.nextElementSibling;

                if (infoContent.style.display === 'block') {
                    infoContent.style.display = 'none';
                    this.textContent = 'More Info';
                } else {
                    this.textContent = 'Less Info';
                    infoContent.innerHTML = `<p>Loading additional info for ${coinId}...</p>`;
                    setTimeout(() => {
                        infoContent.innerHTML = `<p>Details about ${coinId}</p>`;
                        infoContent.style.display = 'block';
                    }, 500);
                }
            });
        });
    }

    function attachCheckboxListeners() {
        document.querySelectorAll('.coin-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const coinId = this.getAttribute('data-coin-id');
                let selectedCoins = JSON.parse(localStorage.getItem('selectcoins')) || [];

                if (this.checked) {
                    selectedCoins.push(coinId);
                } else {
                    selectedCoins = selectedCoins.filter(id => id !== coinId);
                }

                localStorage.setItem('selectcoins', JSON.stringify(selectedCoins));
            });
        });
    } 
    // end code of search bar

    // Function to load and display coins
    function loadCoins() {
        const now = new Date().getTime();
        const cachedUsdCoins = localStorage.getItem('usdCoinsData');
        const cachedIlsCoins = localStorage.getItem('ilsCoinsData');
        const cachedEurCoins = localStorage.getItem('eurCoinsData');
        const cachedUsdTimestamp = localStorage.getItem('usdCoinsTimestamp');
        const cachedIlsTimestamp = localStorage.getItem('ilsCoinsTimestamp');
        const cachedEurTimestamp = localStorage.getItem('eurCoinsTimestamp');

        // Check if the data is still valid (within the cache duration)
        if (cachedUsdCoins && cachedIlsCoins && cachedEurCoins && now - cachedUsdTimestamp < cacheDuration && now - cachedIlsTimestamp < cacheDuration && now - cachedEurTimestamp < cacheDuration) {
            displayCoins(JSON.parse(cachedUsdCoins), JSON.parse(cachedIlsCoins), JSON.parse(cachedEurCoins));
        } else {
            // Fetch data from all three APIs
            Promise.all([
                axios.get(usdApiUrl),
                axios.get(ilsApiUrl),
                axios.get(eurApiUrl)
            ])
            .then(responses => {
                const usdCoinsData = responses[0].data.slice(0, 100);
                const ilsCoinsData = responses[1].data.slice(0, 100);
                const eurCoinsData = responses[2].data.slice(0, 100);

                // Save data to local storage
                localStorage.setItem('usdCoinsData', JSON.stringify(usdCoinsData));
                localStorage.setItem('ilsCoinsData', JSON.stringify(ilsCoinsData));
                localStorage.setItem('eurCoinsData', JSON.stringify(eurCoinsData));
                localStorage.setItem('usdCoinsTimestamp', now);
                localStorage.setItem('ilsCoinsTimestamp', now);
                localStorage.setItem('eurCoinsTimestamp', now);

                // Clear any previous error message
                $('#errorMessage').hide();

                displayCoins(usdCoinsData, ilsCoinsData, eurCoinsData);
                populateSearchDropdown(usdCoinsData); // Populate the dropdown with the USD coins
            })
            .catch(error => {
                console.error("Error fetching coins: ", error);

                // Display error message to the user
                $('#errorMessage').text('Failed to load cryptocurrency data. Please try again later.').show();
            });
        }
    }

    // Function to display coins in the UI
    function displayCoins(usdCoins, ilsCoins, eurCoins) {
        const coinContainer = $('.main');
        coinContainer.empty(); // Clear existing content

        let row; // Variable to hold the current row

        usdCoins.forEach((coin, index) => {
            // Create a new row for every 4 coins
            if (index % 4 === 0) {
                row = $('<div class="row mt-3" id="cryptoCards"></div>');
                coinContainer.append(row); // Append the new row to the main container
            }

            const usdPrice = coin.current_price || 'N/A';
            const ilsPrice = ilsCoins[index]?.current_price || 'N/A';
            const eurPrice = eurCoins[index]?.current_price || 'N/A';

            const coinCard = `
                <div class="col-md-3">
                    <div class="card crypto-card h-100" style="width:100%;height:100%;">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div class="left-content d-flex align-items-center">
                                    <img class="card-img" src="${coin.image}" alt="Card image" style="width: 50px;margin-right: 10px;">
                                    <div style="width:120px;word-wrap:break-word !important;">
                                        <h4 class="card-title" style="font-weight: bold; font-size: 1.25rem; line-height: 1.3;">${coin.symbol.toUpperCase()}</h4>
                                        <p class="card-text" style="line-height: 1.3;">${coin.name}</p>
                                    </div>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" class="coin-checkbox" data-coin-id="${coin.id}" data-coin-symbol="${coin.symbol}" ${selectedCoins.includes(coin.id) ? 'checked' : ''}>
                                    <span class="slider round"></span>
                                </label>
                            </div>
                            <div class="text-center mt-3">
                                <button class="btn btn-primary more-info-btn" data-coin-id="${coin.id}">
                                    More Info
                                </button>
                                <div class="more-info-content mt-3"></div>
                            </div>
                        </div>
                    </div>
                </div>`;
            row.append(coinCard); // Append the coin card to the current row
        });

        // Attach event listeners to "More Info" buttons
        attachMoreInfoListeners();

        // Attach event listeners to the checkboxes
        attachCheckboxListeners();
    }

    function populateSearchDropdown(coinsData) {
        const dropdown = document.getElementById('searchDropdown');
        dropdown.innerHTML = ''; // Clear existing options
    
        coinsData.forEach(coin => {
            const div = document.createElement('div');
            div.textContent = `${coin.symbol.toUpperCase()} - ${coin.name}`;
            div.setAttribute('data-value', coin.symbol.toUpperCase());
            dropdown.appendChild(div);
        });
    
        attachSearchDropdownListeners();
    }
    
    function attachSearchDropdownListeners() {
        const searchInput = document.getElementById('searchInput');
        const dropdown = document.getElementById('searchDropdown');
    
        searchInput.addEventListener('input', function () {
            const filter = this.value.toUpperCase();
            const options = dropdown.childNodes;
            let hasVisibleOptions = false;
    
            options.forEach(option => {
                if (option.textContent.toUpperCase().includes(filter)) {
                    option.style.display = '';
                    hasVisibleOptions = true;
                } else {
                    option.style.display = 'none';
                }
            });
    
            dropdown.style.display = hasVisibleOptions && this.value.length > 0 ? 'block' : 'none';
        });
    
        dropdown.addEventListener('click', function (e) {
            if (e.target.hasAttribute('data-value')) {
                searchInput.value = e.target.getAttribute('data-value');
                dropdown.style.display = 'none';
                performExactSearch(); // Perform the search based on the selected value
            }
        });
    
        document.addEventListener('click', function (e) {
            if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    
        searchInput.addEventListener('focus', function () {
            if (this.value.length > 0) {
                dropdown.style.display = 'block';
            }
        });
    }
    

    // Function to attach listeners to "More Info" buttons
    function attachMoreInfoListeners() {
        $('.more-info-btn').on('click', function () {
            const coinId = $(this).data('coin-id');
            const infoContent = $(this).next('.more-info-content');
            
            // Toggle the visibility of the info content
            if (infoContent.is(':visible')) {
                infoContent.slideUp();
                $(this).html('More Info');
            } else {
                // Show the spinner loader while data is being fetched
                $(this).html(`More Info <span class="spinner-border spinner-border-sm"></span>`);
                
                // Simulate an asynchronous operation for fetching the data from localStorage
                setTimeout(() => {
                    // Load data from localStorage
                    const usdCoinsData = JSON.parse(localStorage.getItem('usdCoinsData'));
                    const ilsCoinsData = JSON.parse(localStorage.getItem('ilsCoinsData'));
                    const eurCoinsData = JSON.parse(localStorage.getItem('eurCoinsData'));
                    
                    const usdData = usdCoinsData.find(c => c.id === coinId);
                    const ilsData = ilsCoinsData.find(c => c.id === coinId);
                    const eurData = eurCoinsData.find(c => c.id === coinId);
                    
                    const coinDetails = {
                        usd: usdData.current_price,
                        ils: ilsData.current_price,
                        eur: eurData.current_price,
                        image: usdData.image,
                        name: usdData.name
                    };
                    
                    displayCoinDetails(infoContent, coinDetails);
                    
                    // Show the info content
                    infoContent.slideDown();
                    
                    // Reset button text after loading data
                    $(this).html('Less Info');
                }, 500); // Simulated delay to show the spinner (0.5 seconds)
            }
        });
    }

    // Function to attach listeners to checkboxes
    function attachCheckboxListeners() {
        $('.coin-checkbox').on('change', function () {
            const coinId = $(this).data('coin-id');
            const coinSymbol = $(this).data('coin-symbol');
            if ($(this).is(':checked')) {
                if (selectedCoins.length >= 5) {
                    $(this).prop('checked', false);
                    populateModalWithSelectedCoins(); // Populate modal with selected coins
                    $('#maxCoinsModal').modal('show'); // Show modal if more than 5 coins are selected
                } else {
                    selectedCoins.push(coinId);
                    chartsCoins.push(coinSymbol);
                    localStorage.setItem('selectcoins', JSON.stringify(selectedCoins)); // Save selected coins to localStorage
                    localStorage.setItem('chartscoins', JSON.stringify(chartsCoins)); // Save selected coin symbols to localStorage
                }
            } else {
                selectedCoins = selectedCoins.filter(id => id !== coinId);
                chartsCoins = chartsCoins.filter(symbol => symbol !== coinSymbol);
                localStorage.setItem('selectcoins', JSON.stringify(selectedCoins)); // Save updated selected coins to localStorage
                localStorage.setItem('chartscoins', JSON.stringify(chartsCoins)); // Save updated coin symbols to localStorage
            }
        });
    }

    // Function to display coin details
    function displayCoinDetails(element, data) {
        const usdPrice = data.usd || 'N/A';
        const eurPrice = data.eur || 'N/A';
        const ilsPrice = data.ils || 'N/A';

        const detailsHtml = `
            <p><strong>USD:</strong> $${usdPrice}</p>
            <p><strong>EUR:</strong> €${eurPrice}</p>
            <p><strong>ILS:</strong> ₪${ilsPrice}</p>
        `;
        element.html(detailsHtml);
    }

    // Function to populate the modal with selected coins
    function populateModalWithSelectedCoins() {
        const selectedCoinsList = $('#selectedCoinsContainer');
        selectedCoinsList.empty();

        const usdCoinsData = JSON.parse(localStorage.getItem('usdCoinsData'));

        selectedCoins.forEach(coinId => {
            const coinData = usdCoinsData.find(coin => coin.id === coinId);
            if (coinData) {
                const coinItem = `
                    <div class="card mb-2">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="left-content d-flex align-items-center">
                                    <img class="card-img" src="${coinData.image}" alt="Card image" style="width: 50px;margin-right: 10px;">
                                    <div>
                                        <h4 class="card-title">${coinData.symbol.toUpperCase()}</h4>
                                        <p class="card-text">${coinData.name}</p>
                                    </div>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" class="modal-coin-checkbox" data-coin-id="${coinData.id}" checked>
                                    <span class="slider round"></span>
                                </label>
                            </div>
                        </div>
                    </div>`;
                selectedCoinsList.append(coinItem);
            }
        });

        // Attach listeners to modal checkboxes for deselection
        attachModalCheckboxListeners();
    }

    // Function to attach listeners to modal checkboxes
    function attachModalCheckboxListeners() {
        $('.modal-coin-checkbox').on('change', function () {
            const coinId = $(this).data('coin-id');
            const coinSymbol = $(this).data('coin-symbol');
            if (!$(this).is(':checked')) {
                // Remove coin from selected coins
                selectedCoins = selectedCoins.filter(id => id !== coinId);
                chartsCoins = chartsCoins.filter(symbol => symbol !== coinSymbol);

                // Uncheck the corresponding checkbox in the main list
                $('.coin-checkbox[data-coin-id="' + coinId + '"]').prop('checked', false);

                // Save updated selected coins to localStorage
                localStorage.setItem('selectcoins', JSON.stringify(selectedCoins));
                localStorage.setItem('chartscoins', JSON.stringify(chartsCoins));
            } else {
                // Re-select the coin if the switch is checked again
                if (!selectedCoins.includes(coinId)) {
                    selectedCoins.push(coinId);
                    chartsCoins.push(coinSymbol);
                    $('.coin-checkbox[data-coin-id="' + coinId + '"]').prop('checked', true);

                    // Save updated selected coins to localStorage
                    localStorage.setItem('selectcoins', JSON.stringify(selectedCoins));
                    localStorage.setItem('chartscoins', JSON.stringify(chartsCoins));
                }
            }
        });
    }

    // Initial load of coins
    loadCoins();

    // Optionally, set an interval to refresh coins list every 2 minutes
    setInterval(loadCoins, cacheDuration);
    
    // On page load, check checkboxes for selected coins
    selectedCoins.forEach(coinId => {
        $(`.coin-checkbox[data-coin-id="${coinId}"]`).prop('checked', true);
    });
    
    
});
