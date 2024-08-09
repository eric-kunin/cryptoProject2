// Fetch data using axios
axios.get('https://api.coingecko.com/api/v3/coins/markets?order=market_cap_desc&vs_currency=usd')
    .then(response => {
        // Get the data from the response
        const coinsData = response.data;

        // Convert the data to a string
        const coinsString = JSON.stringify(coinsData);

        // Save the stringified data to localStorage
        localStorage.setItem('coins', coinsString);

        // Log the data to the console
        console.log('Data saved to localStorage:', coinsData);
    })
    .catch(error => {
        console.error('Error fetching the data:', error);
    });


$(document).ready(function () {
    const apiUrl = "https://api.coingecko.com/api/v3/coins/markets?order=market_cap_desc&vs_currency=usd";
    const coinDetailUrl = "https://api.coingecko.com/api/v3/coins/";
    const cacheDuration = 2 * 60 * 1000; // 2 minutes in milliseconds

    // Function to fetch and display coins
    function loadCoins() {
        $.ajax({
            url: apiUrl,
            type: 'GET',
            success: function (data) {
                displayCoins(data.slice(0, 100)); // Only display the first 100 coins
            },
            error: function (error) {
                console.error("Error fetching coins: ", error);
            }
        });
    }

    // Function to display coins in the UI
    function displayCoins(coins) {
        const coinContainer = $('.main .row');
        coinContainer.empty(); // Clear existing content
        coins.forEach(coin => {
            const coinCard = `
                <div class="col-md-3">
                    <div class="card" style="width:100%">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="left-content d-flex align-items-center">
                                    <img class="card-img" src="${coin.image}" alt="Card image" style="width: 50px; margin-right: 10px;">
                                    <div>
                                        <h4 class="card-title" style="font-weight: bold; font-size: 1.25rem; line-height: 1.3;">${coin.symbol.toUpperCase()}</h4>
                                        <p class="card-text" style="line-height: 1.3;">${coin.name}</p>
                                    </div>
                                </div>
                                <label class="switch">
                                    <input type="checkbox">
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
            coinContainer.append(coinCard);
        });

        // Attach event listeners to "More Info" buttons
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

            $.ajax({
                url: `${coinDetailUrl}${coinId}`,
                type: 'GET',
                success: function (data) {
                    const coinDetails = {
                        timestamp: now,
                        data: data
                    };
                    localStorage.setItem(coinId, JSON.stringify(coinDetails));
                    displayCoinDetails(infoContent, data);
                    $(`[data-coin-id="${coinId}"]`).text('More Info');
                },
                error: function (error) {
                    console.error("Error fetching coin details: ", error);
                }
            });
        });
    }

    // Function to display coin details
    function displayCoinDetails(element, data) {
        const usdPrice = data.market_data.current_price.usd;
        const eurPrice = data.market_data.current_price.eur;
        const ilsPrice = data.market_data.current_price.ils;

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
