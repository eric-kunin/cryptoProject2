window.onload = function () {

    function generateRandomDataPoints() {
        const dataPoints = [];
        const startTime = new Date().setHours(10, 0, 0, 0); // Set the start time to 10:00 AM

        for (let i = 0; i < 10; i++) {
            const time = new Date(startTime + i * 2000); // Every 2 seconds
            const ethValue = Math.floor(Math.random() * 1000); // Random ETH value
            const btcValue = Math.floor(Math.random() * 7000); // Random BTC value
            dataPoints.push({ x: time, eth: ethValue, btc: btcValue });
        }

        return dataPoints;
    }

    const data = generateRandomDataPoints();

    var options = {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: "ETH,BTC to USD"
        },
        axisX:{
            valueFormatString: "HH:mm:ss"
        },
        axisY: {
            title: "Coin Value",
            minimum: 0
        },
        toolTip:{
            shared:true
        },  
        legend:{
            cursor:"pointer",
            verticalAlign: "bottom",
            horizontalAlign: "left",
            dockInsidePlotArea: true,
            itemclick: toogleDataSeries
        },
        data: [{
            type: "line",
            showInLegend: true,
            name: "ETH",
            markerType: "square",
            xValueFormatString: "HH:mm:ss",
            color: "#F08080",
            yValueFormatString: "#,##0",
            dataPoints: data.map(dp => ({ x: dp.x, y: dp.eth }))
        },
        {
            type: "line",
            showInLegend: true,
            name: "BTC",
            lineDashType: "square",
            yValueFormatString: "#,##0",
            dataPoints: data.map(dp => ({ x: dp.x, y: dp.btc }))
        }]
    };
    $("#chartContainer").CanvasJSChart(options);
    
    function toogleDataSeries(e){
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else{
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }
}
