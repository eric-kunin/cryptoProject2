$(function() {
    "use strict";

    // Navbar scroll effect
    $(window).on('scroll', function() {
        let navbar = $('#navbar');
        if ($(this).scrollTop() > 50) {
            navbar.addClass('navbar-scrolled');
        } else {
            navbar.removeClass('navbar-scrolled');
        }
    });

    // Video scroll effect
    $(window).on('scroll', function() {
        let video = $('#myVideo');
        let scrollPosition = $(this).scrollTop();
        video.css('transform', `translate3d(-50%, -50%, 0) translateY(${scrollPosition * 0.5}px)`);
    });

    // Set current year
    $('#currentYear').text(new Date().getFullYear());

    let chartsCoins = JSON.parse(localStorage.getItem('chartscoins')) || [];
    const dataPoints = {};

    // Display message if no coins are selected
    if (chartsCoins.length === 0) {
        $("#chartContainer").html("<h3 style='text-align:center; margin-top: 150px;color:white;'>Please select coins</h3>");
        return;
    }

    // Initialize dataPoints for each selected coin
    chartsCoins.forEach(coin => {
        dataPoints[coin] = [];
    });

    // Create data series for the chart
    const dataSeries = chartsCoins.map(coin => ({
        type: "line",
        showInLegend: true,
        name: coin.toUpperCase(),
        markerType: "square",
        xValueFormatString: "HH:mm:ss",
        yValueFormatString: "#,##0.0000",
        dataPoints: dataPoints[coin]
    }));

    // Initialize the chart
    const chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: chartsCoins.map(coin => coin.toUpperCase()).join(', ') + " to USD"
        },
        axisX: {
            valueFormatString: "HH:mm:ss"
        },
        axisY: {
            title: "Coin Value",
            minimum: 0,
            includeZero: false
        },
        toolTip: {
            shared: true,
            content: "{name}: {y}"
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            horizontalAlign: "center",
            dockInsidePlotArea: true,
            itemclick: toggleDataSeries
        },
        data: dataSeries
    });

    chart.render();

    // Toggle data series visibility
    function toggleDataSeries(event) {
        event.dataSeries.visible = typeof event.dataSeries.visible === "undefined" || event.dataSeries.visible;
        event.dataSeries.visible = !event.dataSeries.visible;
        chart.render();
    }

    // Fetch data from the API and update the chart
    async function fetchData() {
        if (chartsCoins.length > 0) {
            try {
                const response = await axios.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${chartsCoins.join(',').toUpperCase()}&tsyms=USD`);
                const data = response.data;
                const time = new Date();

                chartsCoins.forEach(coin => {
                    const coinData = data[coin.toUpperCase()];
                    
                    if (coinData && coinData.USD !== undefined) {
                        const price = coinData.USD;
                        const formattedPrice = price.toFixed(4);

                        dataPoints[coin].push({ x: time, y: parseFloat(formattedPrice) });
                        if (dataPoints[coin].length > 10) {
                            dataPoints[coin].shift();
                        }
                    } else {
                        console.error(`No data available for ${coin.toUpperCase()}`);
                    }
                });

                chart.render();
            } catch (error) {
                console.error("Error fetching data: ", error);
                $("#chartContainer").html("<h3 style='text-align:center; margin-top: 150px;color:red;'>Failed to load data. Please try again later.</h3>");
            }
        }
    }

    fetchData(); // Fetch initial data
    setInterval(fetchData, 2000); // Fetch data every 2 seconds
});
