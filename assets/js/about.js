$(document).ready(function () {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    function updateMarketTrends() {
        const marketTrendsContainer = document.getElementById('market-trends');
        
        // Check if the container exists
        if (!marketTrendsContainer) {
            console.error("Element 'market-trends' not found in the DOM");
            return; // Exit the function if the container is not found
        }
    
        marketTrendsContainer.innerHTML = ''; // Clear any existing content
    
        // Get the usdCoins data from localStorage and check if it's available
        let usdCoins = JSON.parse(localStorage.getItem('usdCoinsData')) || [];
    
        // If there are no coins, display a message
        if (usdCoins.length === 0) {
            marketTrendsContainer.innerHTML = '<p>No market data available.</p>';
            return;
        }
    
        const trendsToShow = usdCoins.slice(0, 3); // Select the top 3 coins to display
    
        trendsToShow.forEach((coin) => {
            const usdPrice = formatPrice(coin.current_price);
            const priceChange24h = coin.price_change_percentage_24h 
                ? `${coin.price_change_percentage_24h.toFixed(2)}%` 
                : 'N/A';
    
            const trendCard = `
                <div class="col-md-4">
                    <h3>${coin.name} (${coin.symbol.toUpperCase()})</h3>
                    <p>Current Price: $${usdPrice}</p>
                    <p>24h Change: ${priceChange24h}</p>
                </div>
            `;
            marketTrendsContainer.innerHTML += trendCard;
        });
    }
    
    function formatPrice(price) {
        if (!price) return 'N/A';
        return price.toLocaleString(undefined, { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        });
    }
    
    // Call the function after the coins data is loaded and displayed
    // loadCoins();
    updateMarketTrends();
    
    // Optionally, update the market trends periodically
    setInterval(updateMarketTrends, 5000);
});
