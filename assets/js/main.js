 $(document).ready(function () {
    const apiUrl = "https://api.coingecko.com/api/v3/coins/markets?order=market_cap_desc&vs_currency=usd";
    const coinDetailUrl = "https://api.coingecko.com/api/v3/coins/";
    const cacheDuration = 2 * 60 * 1000; // 2 minutes in milliseconds
    let selectedCoins = []; // Array to keep track of selected coins

    // Function to fetch and display coins
    function loadCoins() {
        const now = new Date().getTime();
        const cachedCoins = localStorage.getItem('coinsData');
        const cachedTimestamp = localStorage.getItem('coinsTimestamp');

        if (cachedCoins && cachedTimestamp && now - cachedTimestamp < cacheDuration) {
            displayCoins(JSON.parse(cachedCoins)); // Use cached data
        } else {
            axios.get(apiUrl)
                .then(response => {
                    const coinsData = response.data.slice(0, 100);
                    localStorage.setItem('coinsData', JSON.stringify(coinsData));
                    localStorage.setItem('coinsTimestamp', now);
                    displayCoins(coinsData); // Only display the first 100 coins
                })
                .catch(error => {
                    console.error("Error fetching coins: ", error);
                });
        }
    }

    // Function to display coins in the UI
    function displayCoins(coins) {
        const coinContainer = $('.main');
        coinContainer.empty(); // Clear existing content

        let row; // Variable to hold the current row

        coins.forEach((coin, index) => {
            // Create a new row for every 4 coins
            if (index % 4 === 0) {
                row = $('<div class="row mt-3" id="cryptoCards"></div>');
                coinContainer.append(row); // Append the new row to the main container
            }

            const coinCard = `
                <div class="col-md-3">
                    <div class="card crypto-card h-100" style="width:100%;height:100%;">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="left-content d-flex align-items-center">
                                    <img class="card-img" src="${coin.image}" alt="Card image" style="width: 50px;margin-right: 10px;">
                                    <div style="width:120px;word-wrap:break-word !important;">
                                        <h4 class="card-title" style="font-weight: bold; font-size: 1.25rem; line-height: 1.3;">${coin.symbol.toUpperCase()}</h4>
                                        <p class="card-text" style="line-height: 1.3;">${coin.name}</p>
                                    </div>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" class="coin-checkbox" data-coin-id="${coin.id}" ${selectedCoins.includes(coin.id) ? 'checked' : ''}>
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

    // Function to attach listeners to "More Info" buttons
    function attachMoreInfoListeners() {
        $('.more-info-btn').on('click', function () {
            const coinId = $(this).data('coin-id');
            const infoContent = $(this).next('.more-info-content');
            const cachedData = localStorage.getItem(coinId);
            const now = new Date().getTime();

            // Check if data is cached and still valid
            if (cachedData) {
                const cachedObject = JSON.parse(cachedData);
                if (now - cachedObject.timestamp < cacheDuration) {
                    displayCoinDetails(infoContent, cachedObject.data);
                    return;
                }
            }

            // If no valid cache, fetch from API
            $(this).html(`More Info <span class="spinner-border spinner-border-sm"></span>`);

            axios.get(`${coinDetailUrl}${coinId}`)
                .then(response => {
                    const coinDetails = {
                        timestamp: now,
                        data: response.data
                    };
                    localStorage.setItem(coinId, JSON.stringify(coinDetails));
                    displayCoinDetails(infoContent, response.data);
                    $(`[data-coin-id="${coinId}"]`).html('More Info');
                })
                .catch(error => {
                    console.error("Error fetching coin details: ", error);
                    $(this).html('More Info'); // Reset button text on error
                });
        });
    }

    // Function to attach listeners to checkboxes
    function attachCheckboxListeners() {
        $('.coin-checkbox').on('change', function () {
            const coinId = $(this).data('coin-id');
            if ($(this).is(':checked')) {
                if (selectedCoins.length >= 5) {
                    $(this).prop('checked', false);
                    $('#maxCoinsModal').modal('show'); // Show modal if more than 5 coins are selected
                } else {
                    selectedCoins.push(coinId);
                }
            } else {
                selectedCoins = selectedCoins.filter(id => id !== coinId);
            }
        });
    }

    // Function to display coin details
    function displayCoinDetails(element, data) {
        const usdPrice = data.market_data?.current_price?.usd || 'N/A';
        const eurPrice = data.market_data?.current_price?.eur || 'N/A';
        const ilsPrice = data.market_data?.current_price?.ils || 'N/A';

        const detailsHtml = `
            <p><strong>USD:</strong> $${usdPrice}</p>
            <p><strong>EUR:</strong> €${eurPrice}</p>
            <p><strong>ILS:</strong> ₪${ilsPrice}</p>
            <img src="${data.image.large}" alt="${data.name} image" style="width:100px;">
        `;
        element.html(detailsHtml);
    }

    // Initial load of coins
    loadCoins();

    // Optionally, set an interval to refresh coins list every 2 minutes
    setInterval(loadCoins, cacheDuration);
});
