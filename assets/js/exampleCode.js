$(document).ready(function () {
    let chartsCoins = JSON.parse(localStorage.getItem('chartscoins')) || []; // Load charts coins from localStorage
    const dataPoints = {};

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
        yValueFormatString: "#,##0",
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
            shared: true
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

    function fetchData() {
        if (chartsCoins.length > 0) {
            $.getJSON(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${chartsCoins.join(',').toUpperCase()}&tsyms=USD`, function (data) {
                const time = new Date();
                chartsCoins.forEach(coin => {
                    dataPoints[coin].push({ x: time, y: data[coin.toUpperCase()].USD });
                    if (dataPoints[coin].length > 10) {
                        dataPoints[coin].shift();
                    }
                });
                chart.render();
            });
        }
    }

    fetchData();  // Fetch initial data
    setInterval(fetchData, 2000);  // Fetch data every 2 seconds
});
