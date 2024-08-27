$(function() {
    "use strict";

    $(window).on('scroll', function() {
        let navbar = $('#navbar');
        if ($(this).scrollTop() > 50) {
            navbar.addClass('navbar-scrolled');
        } else {
            navbar.removeClass('navbar-scrolled');
        }
    });

    $(window).on('scroll', function() {
        let video = $('#myVideo');
        let scrollPosition = $(this).scrollTop();
        video.css('transform', `translate3d(-50%, -50%, 0) translateY(${scrollPosition * 0.5}px)`);
    });
    
    $('#currentYear').text(new Date().getFullYear());

    function updateMarketTrends() {
        let marketTrendsContainer = $('#market-trends');
        
        if (marketTrendsContainer.length === 0) {
            console.error("Element 'market-trends' not found in the DOM");
            return;
        }
    
        marketTrendsContainer.empty(); // Clear any existing content
    
        let usdCoins = JSON.parse(localStorage.getItem('usdCoinsData')) || [];
    
        if (usdCoins.length === 0) {
            marketTrendsContainer.html('<p>No market data available.</p>');
            return;
        }
    
        let trendsToShow = usdCoins.slice(0, 3); // Select the top 3 coins to display
    
        trendsToShow.forEach((coin) => {
            let usdPrice = formatPrice(coin.current_price);
            let priceChange24h = coin.price_change_percentage_24h 
                ? `${coin.price_change_percentage_24h.toFixed(2)}%` 
                : 'N/A';
    
            let trendCard = `
                <div class="col-md-4">
                    <h3>${coin.name} (${coin.symbol.toUpperCase()})</h3>
                    <p>Current Price: $${usdPrice}</p>
                    <p>24h Change: ${priceChange24h}</p>
                </div>
            `;
            marketTrendsContainer.append(trendCard);
        });
    }
    
    function formatPrice(price) {
        if (!price) return 'N/A';
        return price.toLocaleString(undefined, { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        });
    }
    
    updateMarketTrends();
    
    setInterval(updateMarketTrends, 5000);
});
