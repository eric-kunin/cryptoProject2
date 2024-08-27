$(function(){
    "use strict";

    const usdApiUrl = "https://api.coingecko.com/api/v3/coins/markets?order=market_cap_desc&vs_currency=usd";
    const ilsApiUrl = "https://api.coingecko.com/api/v3/coins/markets?order=market_cap_desc&vs_currency=ils";
    const eurApiUrl = "https://api.coingecko.com/api/v3/coins/markets?order=market_cap_desc&vs_currency=eur";
    const cacheDuration = 2 * 60 * 1000; // 2 minutes in milliseconds
    let selectedCoins = JSON.parse(localStorage.getItem('selectcoins')) || []; // Load selected coins from localStorage
    let chartsCoins = selectedCoins.map(coinId => getCoinSymbolFromId(coinId)); // Synchronize chartsCoins with selectcoins
    let searchDebounceTimer;

    $('#currentYear').text(new Date().getFullYear());

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

    loadCoins();

    $('#searchInput').on('input', function() {
        clearTimeout(searchDebounceTimer);

        if ($.trim($(this).val()) === "") {
            searchDebounceTimer = setTimeout(function() {
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

    $('.btn-outline-success').on('click', function() {
        performExactSearch();
    });

    $('#searchInput').on('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            performExactSearch();
        }
    });

    $('#searchInput').on('input', function() {
        let input = $.trim($(this).val());
        let searchResultMessage = $('#searchResultMessage');

        if (input === "") {
            searchResultMessage.text(""); // Clear message when input is empty
        }
    });

    $('#searchInput').on('input', function() {
        let input = $.trim($(this).val()).toUpperCase();
        let searchResultMessage = $('#searchResultMessage');

        if (input === "") {
            searchResultMessage.text(""); // Clear message when input is empty
            if (typeof loadCoins === 'function') {
                loadCoins();
            } else {
                console.error('loadCoins is not defined');
            }
        } else {
            performPartialSearch();
        }
    });

    function performPartialSearch() {
        let input = $.trim($('#searchInput').val()).toUpperCase();
        let searchResultMessage = $('#searchResultMessage');
        if (input === "") {
            searchResultMessage.text(""); // Clear message when input is empty
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

        searchResultMessage.text(`Found ${filteredCoins.length} ${filteredCoins.length > 1 ? "coins" : "coin"}`);

        displayCoins(filteredCoins, ilsCoins, eurCoins, selectedCoins);
    }

    function performExactSearch() {
        let searchResultMessage = $('#searchResultMessage');
        let input = $.trim($('#searchInput').val()).toUpperCase();

        if (input === "") {
            if (typeof loadCoins === 'function') {
                loadCoins();
            } else {
                console.error('loadCoins is not defined');
            }
            searchResultMessage.text(""); // Clear message when input is empty
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

        searchResultMessage.text(`Found ${filteredCoins.length} ${filteredCoins.length > 1 ? "coins" : "coin"}`);

        displayCoins(filteredCoins, ilsCoins, eurCoins, selectedCoins);
    }

    function loadCoins() {
        const now = new Date().getTime();
        const cachedUsdCoins = localStorage.getItem('usdCoinsData');
        const cachedIlsCoins = localStorage.getItem('ilsCoinsData');
        const cachedEurCoins = localStorage.getItem('eurCoinsData');
        const cachedUsdTimestamp = localStorage.getItem('usdCoinsTimestamp');
        const cachedIlsTimestamp = localStorage.getItem('ilsCoinsTimestamp');
        const cachedEurTimestamp = localStorage.getItem('eurCoinsTimestamp');

        if (cachedUsdCoins && cachedIlsCoins && cachedEurCoins && now - cachedUsdTimestamp < cacheDuration && now - cachedIlsTimestamp < cacheDuration && now - cachedEurTimestamp < cacheDuration) {
            displayCoins(JSON.parse(cachedUsdCoins), JSON.parse(cachedIlsCoins), JSON.parse(cachedEurCoins));
            populateSearchDropdown(JSON.parse(cachedUsdCoins)); // Populate the dropdown with the USD coins
        } else {
            $.when(
                $.get(usdApiUrl),
                $.get(ilsApiUrl),
                $.get(eurApiUrl)
            )
            .then((usdResponse, ilsResponse, eurResponse) => {
                const usdCoinsData = usdResponse[0].slice(0, 100);
                const ilsCoinsData = ilsResponse[0].slice(0, 100);
                const eurCoinsData = eurResponse[0].slice(0, 100);

                localStorage.setItem('usdCoinsData', JSON.stringify(usdCoinsData));
                localStorage.setItem('ilsCoinsData', JSON.stringify(ilsCoinsData));
                localStorage.setItem('eurCoinsData', JSON.stringify(eurCoinsData));
                localStorage.setItem('usdCoinsTimestamp', now);
                localStorage.setItem('ilsCoinsTimestamp', now);
                localStorage.setItem('eurCoinsTimestamp', now);

                $('#errorMessage').hide();

                displayCoins(usdCoinsData, ilsCoinsData, eurCoinsData);
                populateSearchDropdown(usdCoinsData); // Populate the dropdown with the USD coins
            })
            .fail(error => {
                console.error("Error fetching coins: ", error);
                $('#errorMessage').text('Failed to load cryptocurrency data. Please try again later.').show();
            });
        }
    }

    function displayCoins(usdCoins, ilsCoins, eurCoins) {
        let coinContainer = $('.main');
        coinContainer.empty();

        let row;

        usdCoins.forEach((coin, index) => {
            if (index % 4 === 0) {
                row = $('<div class="row mt-3" id="cryptoCards"></div>');
                coinContainer.append(row);
            }

            const usdPrice = coin.current_price || 'N/A';
            const ilsPrice = ilsCoins[index]?.current_price || 'N/A';
            const eurPrice = eurCoins[index]?.current_price || 'N/A';

            const coinCard = `
                <div class="col-md-3">
                    <div class="card crypto-card h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div class="left-content d-flex align-items-center">
                                    <img class="card-img" src="${coin.image}" alt="Card image">
                                    <div class="text-wrap">
                                        <h4 class="card-title">${coin.symbol.toUpperCase()}</h4>
                                        <p class="card-text">${coin.name}</p>
                                    </div>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" class="coin-checkbox" data-coin-id="${coin.id}" data-coin-symbol="${coin.symbol}" ${selectedCoins.includes(coin.id) ? 'checked' : ''}>
                                    <span class="slider round"></span>
                                </label>
                            </div>
                            <div class="text-center mt-3">
                                <button class="btn btn-primary more-info-btn" data-coin-id="${coin.id}" data-toggle="collapse">
                                    More Info
                                </button>
                                <div class="more-info-content mt-3 collapse"></div>
                            </div>
                        </div>
                    </div>
                </div>`;
            row.append(coinCard);
        });

        attachMoreInfoListeners();
        attachCheckboxListeners();
    }

    function populateSearchDropdown(coinsData) {
        let dropdown = $('#searchDropdown');
        dropdown.empty();

        coinsData.forEach(coin => {
            let div = $('<div></div>').text(`${coin.symbol.toUpperCase()} - ${coin.name}`);
            div.attr('data-value', coin.symbol.toUpperCase());
            dropdown.append(div);
        });

        attachSearchDropdownListeners();
    }

    function attachSearchDropdownListeners() {
        let searchInput = $('#searchInput');
        let dropdown = $('#searchDropdown');

        searchInput.on('input', function() {
            let filter = $(this).val().toUpperCase();
            let options = dropdown.children();
            let hasVisibleOptions = false;

            options.each(function() {
                if ($(this).text().toUpperCase().includes(filter)) {
                    $(this).show();
                    hasVisibleOptions = true;
                } else {
                    $(this).hide();
                }
            });

            if (hasVisibleOptions && $(this).val().length > 0) {
                dropdown.show();
            } else {
                dropdown.hide();
            }
        });

        dropdown.on('mousedown', function(event) {
            event.preventDefault();
        });

        dropdown.on('click', function(event) {
            if ($(event.target).attr('data-value')) {
                searchInput.val($(event.target).attr('data-value'));
                dropdown.hide();
                performExactSearch();
            }
        });

        $(document).on('click', function(event) {
            if (!searchInput.is(event.target) && !dropdown.is(event.target)) {
                dropdown.hide();
            }
        });

        searchInput.on('focus', function() {
            let filter = $(this).val().toUpperCase();
            let options = dropdown.children();
            let hasVisibleOptions = false;

            options.each(function() {
                if ($(this).text().toUpperCase().includes(filter)) {
                    hasVisibleOptions = true;
                }
            });

            if ($(this).val().length > 0 && hasVisibleOptions) {
                dropdown.show();
            }
        });
    }

    function attachMoreInfoListeners() {
        $('.more-info-btn').on('click', function() {
            let coinId = $(this).data('coin-id');
            let infoContent = $(this).next('.more-info-content');

            if (infoContent.is(':visible')) {
                infoContent.slideUp();
                $(this).text('More Info');
            } else {
                $(this).html('More Info <span class="spinner-border spinner-border-sm"></span>');

                setTimeout(() => {
                    let usdCoinsData = JSON.parse(localStorage.getItem('usdCoinsData'));
                    let ilsCoinsData = JSON.parse(localStorage.getItem('ilsCoinsData'));
                    let eurCoinsData = JSON.parse(localStorage.getItem('eurCoinsData'));

                    let usdData = usdCoinsData.find(c => c.id === coinId);
                    let ilsData = ilsCoinsData.find(c => c.id === coinId);
                    let eurData = eurCoinsData.find(c => c.id === coinId);

                    let coinDetails = {
                        usd: usdData.current_price,
                        ils: ilsData.current_price,
                        eur: eurData.current_price,
                        image: usdData.image,
                        name: usdData.name
                    };

                    displayCoinDetails(infoContent, coinDetails);

                    infoContent.slideDown();
                    $(this).text('Less Info');
                }, 500);
            }
        });
    }

    function displayCoinDetails(infoContent, coinDetails) {
        const usdPrice = coinDetails.usd ? `$${coinDetails.usd.toLocaleString()}` : 'N/A';
        const eurPrice = coinDetails.eur ? `€${coinDetails.eur.toLocaleString()}` : 'N/A';
        const ilsPrice = coinDetails.ils ? `₪${coinDetails.ils.toLocaleString()}` : 'N/A';

        const detailsHtml = `
            <div class="coin-details">
                <p><strong>USD:</strong> ${usdPrice}</p>
                <p><strong>EUR:</strong> ${eurPrice}</p>
                <p><strong>ILS:</strong> ${ilsPrice}</p>
            </div>
        `;

        infoContent.html(detailsHtml);
    }

    function attachCheckboxListeners() {
        $('.coin-checkbox').on('change', function() {
            let coinId = $(this).data('coin-id');
            let coinSymbol = $(this).data('coin-symbol');
    
            if ($(this).is(':checked')) {
                selectedCoins.push(coinId);
                chartsCoins.push(coinSymbol);
    
                if (selectedCoins.length > 5) {
                    populateModalWithSelectedCoins();
                    $('#maxCoinsModal').modal('show');
                } else {
                    updateLocalStorage();
                }
            } else {
                selectedCoins = selectedCoins.filter(id => id !== coinId);
                chartsCoins = chartsCoins.filter(symbol => symbol !== coinSymbol);
                updateLocalStorage();
            }
        });
    }
    
    function populateModalWithSelectedCoins() {
        let selectedCoinsList = $('#selectedCoinsContainer');
        selectedCoinsList.empty();
    
        let usdCoinsData = JSON.parse(localStorage.getItem('usdCoinsData'));
    
        selectedCoins.forEach(coinId => {
            let coinData = usdCoinsData.find(coin => coin.id === coinId);
            if (coinData) {
                let coinItem = `
                    <div class="card mb-2">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="left-content d-flex align-items-center">
                                    <img class="card-img" src="${coinData.image}" alt="Card image">
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
    
        attachModalCheckboxListeners();
    }
    
    function attachModalCheckboxListeners() {
        $('.modal-coin-checkbox').on('change', function() {
            let coinId = $(this).data('coin-id');
            let coinSymbol = $(this).data('coin-symbol');
            
            if (!$(this).is(':checked')) {
                // Remove the coin from selectedCoins and chartsCoins
                selectedCoins = selectedCoins.filter(id => id !== coinId);
                chartsCoins = chartsCoins.filter(symbol => symbol !== coinSymbol);
                $(`.coin-checkbox[data-coin-id="${coinId}"]`).prop('checked', false);
    
                updateLocalStorage();
            } else {
                // Add the coin to selectedCoins and chartsCoins
                if (selectedCoins.length < 5) {
                    selectedCoins.push(coinId);
                    chartsCoins.push(coinSymbol);
                    $(`.coin-checkbox[data-coin-id="${coinId}"]`).prop('checked', true);
    
                    updateLocalStorage();
                }
            }
        });
    
        // Handle the modal okay button click
        $('#modalFooterBtn').on('click', function() {
            if (selectedCoins.length > 5) {
                // Automatically uncheck the 6th coin if the user does not deselect one
                let extraCoinId = selectedCoins[selectedCoins.length - 1];
                let extraCoinSymbol = chartsCoins[chartsCoins.length - 1];
    
                // Slice the arrays to only keep the first 5 coins
                selectedCoins = selectedCoins.slice(0, 5);
                chartsCoins = chartsCoins.slice(0, 5);
    
                // Uncheck the extra coin in the main UI
                $(`.coin-checkbox[data-coin-id="${extraCoinId}"]`).prop('checked', false);
    
                updateLocalStorage();
            }
    
            $('#maxCoinsModal').modal('hide');
        });
    }

    function updateLocalStorage() {
        // Ensure chartsCoins is synchronized with selectedCoins
        chartsCoins = selectedCoins.map(coinId => getCoinSymbolFromId(coinId));
        localStorage.setItem('selectcoins', JSON.stringify(selectedCoins));
        localStorage.setItem('chartscoins', JSON.stringify(chartsCoins));
    }

    function getCoinSymbolFromId(coinId) {
        // Retrieve the coin symbol based on the coin ID from the stored data
        let usdCoinsData = JSON.parse(localStorage.getItem('usdCoinsData'));
        let coinData = usdCoinsData.find(coin => coin.id === coinId);
        return coinData ? coinData.symbol : '';
    }

    loadCoins();

    selectedCoins.forEach(coinId => {
        $(`.coin-checkbox[data-coin-id="${coinId}"]`).prop('checked', true);
    });
});
