// Data for different years
const energyData = {
    2023: {
        labels: ['Solar', 'Wind', 'Hydro', 'Biomass', 'Geothermal'],
        data: [720, 837, 1360, 143, 16]
    },
    2020: {
        labels: ['Solar', 'Wind', 'Hydro', 'Biomass', 'Geothermal'],
        data: [580, 698, 1310, 130, 14]
    },
    2015: {
        labels: ['Solar', 'Wind', 'Hydro', 'Biomass', 'Geothermal'],
        data: [227, 432, 1207, 106, 12]
    },
    2010: {
        labels: ['Solar', 'Wind', 'Hydro', 'Biomass', 'Geothermal'],
        data: [40, 198, 1025, 85, 10]
    }
};

// Initialize chart with error handling
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log("DOM loaded, initializing chart...");
        
        // Check if Chart is defined
        if (typeof Chart === 'undefined') {
            console.error("Chart.js library not loaded!");
            document.querySelector('.chart-container').innerHTML = 
                '<div style="color: red; text-align: center; padding: 20px;">Error: Chart.js library not loaded. Please check console for details.</div>';
            return;
        }
        
        // Check if canvas exists
        const canvas = document.getElementById('energyChart');
        if (!canvas) {
            console.error("Canvas element not found!");
            return;
        }
        
        console.log("Creating chart...");
        const ctx = canvas.getContext('2d');
        
        window.currentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: energyData[2023].labels,
                datasets: [{
                    label: 'Capacity (GW)',
                    data: energyData[2023].data,
                    backgroundColor: [
                        '#FDB813', // Solar - yellow/gold
                        '#00A0DC', // Wind - light blue
                        '#2196F3', // Hydro - blue
                        '#4CAF50', // Biomass - green
                        '#FF5722'  // Geothermal - orange
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Renewable Energy Capacity (GW) by Source'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Capacity (GW)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Energy Source'
                        }
                    }
                },
                animation: {
                    duration: 1000
                }
            }
        });
        
        console.log("Chart created successfully!");
    } catch (error) {
        console.error("Error creating chart:", error);
        document.querySelector('.chart-container').innerHTML = 
            '<div style="color: red; text-align: center; padding: 20px;">Error creating chart. Please check console for details.</div>';
    }

    // Year selection handling
    document.querySelectorAll('.control-btn').forEach(button => {
        button.addEventListener('click', function() {
            try {
                const year = this.dataset.year;
                document.querySelectorAll('.control-btn').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                updateChart(year);
            } catch (error) {
                console.error("Error updating chart:", error);
            }
        });
    });

    function updateChart(year) {
        if (!window.currentChart) {
            console.error("Chart not initialized!");
            return;
        }
        
        window.currentChart.data.labels = energyData[year].labels;
        window.currentChart.data.datasets[0].data = energyData[year].data;
        window.currentChart.options.plugins.title.text = `Renewable Energy Capacity (GW) by Source - ${year}`;
        window.currentChart.update();
    }

    // Tooltip handling
    const tooltip = document.getElementById('tooltip');
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mouseover', function(e) {
            const tooltipText = this.dataset.tooltip;
            tooltip.textContent = tooltipText;
            tooltip.style.display = 'block';
            tooltip.style.left = e.pageX + 10 + 'px';
            tooltip.style.top = e.pageY + 10 + 'px';
        });
        
        card.addEventListener('mouseout', function() {
            tooltip.style.display = 'none';
        });
        
        card.addEventListener('mousemove', function(e) {
            tooltip.style.left = e.pageX + 10 + 'px';
            tooltip.style.top = e.pageY + 10 + 'px';
        });
    });
});

// Add an event listener to detect Window load issues
window.addEventListener('load', function() {
    console.log("Window fully loaded");
    if (!window.currentChart) {
        console.log("Chart wasn't initialized during DOMContentLoaded, attempting again...");
        const chartContainer = document.querySelector('.chart-container');
        if (chartContainer) {
            if (chartContainer.querySelector('canvas').getContext) {
                try {
                    const event = new Event('DOMContentLoaded');
                    document.dispatchEvent(event);
                } catch (error) {
                    console.error("Error on retry:", error);
                }
            }
        }
    }
});
