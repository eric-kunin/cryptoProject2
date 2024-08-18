$(document).ready(function () {
    const usdApiUrl = "https://api.coingecko.com/api/v3/coins/markets?order=market_cap_desc&vs_currency=usd";
    const ilsApiUrl = "https://api.coingecko.com/api/v3/coins/markets?order=market_cap_desc&vs_currency=ils";
    const eurApiUrl = "https://api.coingecko.com/api/v3/coins/markets?order=market_cap_desc&vs_currency=eur";
    const cacheDuration = 2 * 60 * 1000; // 2 minutes in milliseconds
    let selectedCoins = []; // Array to keep track of selected coins

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

                displayCoins(usdCoinsData, ilsCoinsData, eurCoinsData);
            })
            .catch(error => {
                console.error("Error fetching coins: ", error);
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

                // Reset button text after loading data
                $(this).html('More Info');
            }, 500); // Simulated delay to show the spinner (0.5 seconds)
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
        const usdPrice = data.usd || 'N/A';
        const eurPrice = data.eur || 'N/A';
        const ilsPrice = data.ils || 'N/A';

        // I will use this code maybe later. but I don't need img because I made already logo
        // const detailsHtml = `
        //     <p><strong>USD:</strong> $${usdPrice}</p>
        //     <p><strong>EUR:</strong> €${eurPrice}</p>
        //     <p><strong>ILS:</strong> ₪${ilsPrice}</p>
        //     <img src="${data.image}" alt="${data.name} image" style="width:100px;">
        // `;
        const detailsHtml = `
            <p><strong>USD:</strong> $${usdPrice}</p>
            <p><strong>EUR:</strong> €${eurPrice}</p>
            <p><strong>ILS:</strong> ₪${ilsPrice}</p>
        `;
        element.html(detailsHtml);
    }

    // Initial load of coins
    loadCoins();

    // Optionally, set an interval to refresh coins list every 2 minutes
    setInterval(loadCoins, cacheDuration);
});
