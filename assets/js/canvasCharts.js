$(document).ready(function () {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    let chartsCoins = JSON.parse(localStorage.getItem('chartscoins')) || []; // Load charts coins from localStorage
    const dataPoints = {};

    if (chartsCoins.length === 0) {
        $("#chartContainer").html("<h3 style='text-align:center; margin-top: 150px;color:white;'>Please select coins</h3>");
        return;
    }

    // Initialize dataPoints for each selected coin
    chartsCoins.forEach(coin => {
        dataPoints[coin] = [];
    });

    const dataSeries = chartsCoins.map(coin => ({
        type: "line",
        showInLegend: true,
        name: coin.toUpperCase(),
        markerType: "square",
        xValueFormatString: "HH:mm:ss",
        yValueFormatString: "#,##0.0000", // Format for 4 decimal places
        dataPoints: dataPoints[coin]
    }));

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
            includeZero: false,
        },
        toolTip: {
            shared: true,
            content: "{name}: {y}"
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top", // Position the legend at the top
            horizontalAlign: "center", // Center the legend
            dockInsidePlotArea: true,
            itemclick: toggleDataSeries
        },
        data: dataSeries
    });

    chart.render();

    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        chart.render();
    }

    async function fetchData() {
        if (chartsCoins.length > 0) {
            try {
                const response = await axios.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${chartsCoins.join(',').toUpperCase()}&tsyms=USD`);
                const data = response.data;
                const time = new Date();

                chartsCoins.forEach(coin => {
                    const price = data[coin.toUpperCase()].USD;

                    // Format the price to 4 decimal places
                    const formattedPrice = price.toFixed(4);

                    dataPoints[coin].push({ x: time, y: parseFloat(formattedPrice) });
                    if (dataPoints[coin].length > 10) {
                        dataPoints[coin].shift();
                    }
                });

                chart.render();
            } catch (error) {
                console.error("Error fetching data: ", error);
                $("#chartContainer").html("<h3 style='text-align:center; margin-top: 150px;color:red;'>Failed to load data. Please try again later.</h3>");
            }
        }
    }

    fetchData();  // Fetch initial data
    setInterval(fetchData, 2000);  // Fetch data every 2 seconds
});
