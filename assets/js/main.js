document.addEventListener('DOMContentLoaded', () => {
    const coinContainer = document.getElementById('coin-container');
    const cache = {};
    
    fetch('https://api.coingecko.com/api/v3/coins/list')
        .then(response => response.json())
        .then(data => {
            const coins = data.slice(0, 100);
            coins.forEach(coin => {
                const coinCard = createCoinCard(coin);
                coinContainer.appendChild(coinCard);
            });
        })
        .catch(error => console.error('Error fetching coin list:', error));

    function createCoinCard(coin) {
        const col = document.createElement('div');
        col.classList.add('col-md-4');
        
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3');
        
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        
        const cardTitle = document.createElement('h4');
        cardTitle.classList.add('card-title');
        cardTitle.innerText = coin.symbol.toUpperCase();
        
        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.innerText = coin.name;
        
        const moreInfoButton = document.createElement('button');
        moreInfoButton.classList.add('btn', 'btn-primary');
        moreInfoButton.innerText = 'More info';
        moreInfoButton.addEventListener('click', () => toggleMoreInfo(coin.id, card));
        
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(moreInfoButton);
        
        card.appendChild(cardBody);
        col.appendChild(card);
        
        return col;
    }

    function toggleMoreInfo(coinId, card) {
        if (cache[coinId] && (Date.now() - cache[coinId].timestamp < 2 * 60 * 1000)) {
            displayMoreInfo(card, cache[coinId].data);
        } else {
            const progressBar = document.createElement('div');
            progressBar.classList.add('progress');
            const progressBarInner = document.createElement('div');
            progressBarInner.classList.add('progress-bar', 'progress-bar-striped', 'progress-bar-animated');
            progressBarInner.setAttribute('role', 'progressbar');
            progressBarInner.style.width = '100%';
            progressBar.appendChild(progressBarInner);
            card.appendChild(progressBar);
            
            fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`)
                .then(response => response.json())
                .then(data => {
                    cache[coinId] = { data, timestamp: Date.now() };
                    displayMoreInfo(card, data);
                    card.removeChild(progressBar);
                })
                .catch(error => console.error('Error fetching coin data:', error));
        }
    }

    function displayMoreInfo(card, data) {
        const existingInfo = card.querySelector('.more-info');
        if (existingInfo) {
            existingInfo.remove();
        } else {
            const moreInfo = document.createElement('div');
            moreInfo.classList.add('more-info');
            
            const image = document.createElement('img');
            image.src = data.image.small;
            image.alt = data.name;
            image.classList.add('mb-3');
            
            const usdPrice = document.createElement('p');
            usdPrice.innerText = `USD: $${data.market_data.current_price.usd}`;
            
            const eurPrice = document.createElement('p');
            eurPrice.innerText = `EUR: €${data.market_data.current_price.eur}`;
            
            const ilsPrice = document.createElement('p');
            ilsPrice.innerText = `ILS: ₪${data.market_data.current_price.ils}`;
            
            moreInfo.appendChild(image);
            moreInfo.appendChild(usdPrice);
            moreInfo.appendChild(eurPrice);
            moreInfo.appendChild(ilsPrice);
            
            card.appendChild(moreInfo);
        }
    }
});
