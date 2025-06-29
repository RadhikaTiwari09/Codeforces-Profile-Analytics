const renderTagHeatmap = (canvasId, submissions) => {
    const ratingSet = new Set();
    submissions.forEach(s => {
        if (s.verdict === "OK" && s.problem && s.problem.rating) {
            ratingSet.add(s.problem.rating);
        }
    });

    const ratings = Array.from(ratingSet).sort((a, b) => a - b);

    const tagsSet = new Set();
    submissions.forEach(s => {
        if (s.problem && s.problem.tags) {
            s.problem.tags.forEach(tag => tagsSet.add(tag));
        }
    });

    const tags = Array.from(tagsSet).sort();
    const dataMatrix = {};
    tags.forEach(tag => {
        dataMatrix[tag] = ratings.map(() => 0);
    });

    const solvedProblems = new Set();
    submissions.forEach(s => {
        if (s.verdict === "OK" && s.problem && s.problem.tags && s.problem.rating) {
            const problemKey = `${s.problem.contestId}-${s.problem.index}`;
            if (!solvedProblems.has(problemKey)) {
                solvedProblems.add(problemKey);
                const rating = s.problem.rating;
                const tagList = s.problem.tags;
                const ratingIndex = ratings.indexOf(rating);
                if (ratingIndex !== -1) {
                    tagList.forEach(tag => {
                        dataMatrix[tag][ratingIndex]++;
                    });
                }
            }
        }
    });

    const datasets = [];
    tags.forEach((tag, idx) => {
        datasets.push({
            label: tag,
            data: dataMatrix[tag],
            backgroundColor: `hsl(${(idx * 360 / tags.length) % 360}, 70%, 50%)`
        });
    });

    const ctx = document.getElementById(canvasId).getContext("2d");

    if (window.tagHeatmapChartInstance) {
        window.tagHeatmapChartInstance.destroy();
    }

    window.tagHeatmapChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ratings.map(r => r.toString()),
            datasets: datasets
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: "Solved Problems Count"
                    }
                },
                y: {
                    stacked: true,
                    reverse: true
                }
            },
            plugins: {
                legend: {
                    position: "right",
                    maxHeight: 200,
                    labels: {
                        boxWidth: 15
                    }
                },
                title: {
                    display: true,
                    text: "Tag Heatmap (solved problems by rating)"
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            return `${context.dataset.label}: ${context.parsed.x}`;
                        }
                    }
                }
            }
        }
    });
};
