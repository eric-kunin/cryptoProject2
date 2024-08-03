$(document).ready(function() {
    // API URL
    const apiUrl = 'https://api.coingecko.com/api/v3/coins/list';

    // Load initial currencies
    loadCurrencies();

    // Navigation event handlers
    $('#nav-currencies').on('click', function() {
        loadCurrencies();
    });

    $('#nav-reports').on('click', function() {
        $('#content').html('<h2>Real-time Reports</h2><p>Coming soon...</p>');
    });

    $('#nav-about').on('click', function() {
        $('#content').html('<h2>About</h2><p>Information about the application...</p>');
    });
    // Search functionality
    $('#search-button').on('click', function() {
        const query = $('#search-input').val().toLowerCase();
        searchCurrency(query);
    });
    function loadCurrencies() {
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function(data) {
                displayCurrencies(data.slice(0, 100));
            },
            error: function(error) {
                console.error('Error fetching data', error);
            }
        });
    }
    function displayCurrencies(currencies) {
        $('#content').empty();
        currencies.forEach(currency => {
            const card = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${currency.name}</h5>
                        <p class="card-text">Symbol: ${currency.symbol}</p>
                    </div>
                </div>
            `;
            $('#content').append(card);
        });
    }
    function searchCurrency(query) {
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function(data) {
                const filteredData = data.filter(currency => currency.name.toLowerCase().includes(query));
                displayCurrencies(filteredData.slice(0, 100));
            },
            error: function(error) {
                console.error('Error fetching data', error);
            }
        });
    }
});