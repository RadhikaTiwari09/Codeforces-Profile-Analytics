const getColor = (i) => {
    const palette = [
        "#ff6384", "#36a2eb", "#cc65fe", "#ffce56",
        "#4bc0c0", "#9966ff", "#ff9f40", "#66bb6a",
        "#f06292", "#ba68c8", "#7986cb", "#4db6ac",
        "#9575cd", "#e57373", "#f44336"
    ];
    return palette[i % palette.length];
};

const renderChart = (canvasId, label, labels, data, color, isBar) => {
    if (typeof isBar !== "boolean") isBar = false;

    const ctx = document.getElementById(canvasId).getContext("2d");

    if (window[canvasId + "_chart"]) window[canvasId + "_chart"].destroy();

    let backgroundColors;
    if (isBar) backgroundColors = labels.map((_, i) => getColor(i));
    else backgroundColors = color;

    let showXTicks;
    if (isBar) showXTicks = true;
    else showXTicks = false;

    const config = {
        type: isBar ? "bar" : "line",
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: backgroundColors,
                borderColor: color,
                borderWidth: 2,
                fill: false,
                tension: 0.3,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }
            },
            scales: {
                x: {
                    ticks: {
                        display: showXTicks
                    }
                },
                y: {
                    beginAtZero: false
                }
            }
        }
    };

    window[canvasId + "_chart"] = new Chart(ctx, config);
};
