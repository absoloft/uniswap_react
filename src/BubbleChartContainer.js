import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

function BubbleChartContainer({ onTokenSelect }) {
    const bubbleChartRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const createBubbles = (transactions) => {
        const tokenData = transactions.reduce((acc, tx) => {
            acc[tx.token] = (acc[tx.token] || 0) + 1;
            return acc;
        }, {});

        const sortedData = Object.entries(tokenData)
            .map(([token, count]) => ({ token, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 20);

        const width = bubbleChartRef.current.clientWidth;
        const height = 500;
        const svg = d3.select(bubbleChartRef.current).html("").append("svg").attr("width", width).attr("height", height);
        const radiusScale = d3.scaleSqrt().domain([0, d3.max(sortedData, d => d.count)]).range([20, 80]);

        const simulation = d3.forceSimulation(sortedData)
            .force("charge", d3.forceManyBody().strength(100))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide().radius(d => radiusScale(d.count)))
            .on("tick", ticked);

        function ticked() {
            const bubbles = svg.selectAll(".bubble")
                .data(sortedData)
                .join("g")
                .attr("class", "bubble")
                .attr("transform", d => `translate(${d.x}, ${d.y})`);

            bubbles.append("circle")
                .attr("r", d => radiusScale(d.count))
                .style("fill", "#4CAF50")
                .on("click", (event, d) => onTokenSelect(d.token));

            bubbles.append("text")
                .attr("class", "bubble-text")
                .style("text-anchor", "middle")
                .style("alignment-baseline", "central")
                .style("font-size", d => `${radiusScale(d.count) / 4}px`)
                .text(d => d.token.slice(0, 6) + '...' + d.token.slice(-4))
                .attr("dy", d => `-${radiusScale(d.count) / 10}px`)
                .on("click", (event, d) => onTokenSelect(d.token));
        }
    };

    const fetchAndCreateBubbles = useCallback(() => {
        setIsLoading(true); // Start loading
        axios.get(`${process.env.REACT_APP_API_URL}/get_recent_transactions`)
            .then(response => {
                createBubbles(response.data);
            })
            .catch(error => {
                console.error('Error fetching recent transactions:', error);
            })
            .finally(() => {
                // Delay setting isLoading to false for 7 seconds
                setTimeout(() => {
                    setIsLoading(false); // Stop loading after 7 seconds
                }, 7000); // 7 seconds in milliseconds
            });
    }, []);

    useEffect(() => {
        fetchAndCreateBubbles();
    }, [fetchAndCreateBubbles]);

    return (
        <div className="bubble-chart-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', position: 'relative', marginLeft: '20%' }}>
            {isLoading && (
                <div className="overlay" style={{ position: 'absolute', top: '45%', left: '45%', width: '10%', height: '10%', background: 'rgba(255, 255, 255, 0.8)', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '10' }}>
                    <div className="loading-animation"></div>
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                <button onClick={fetchAndCreateBubbles} className="copy-btn">Refresh Bubble Chart</button>
            </div>
            <div style={{ height: '500px', width: '100%', borderRadius: '5px', overflow: 'hidden', background: '#f5f4f4' }} ref={bubbleChartRef}></div>
        </div>
    );
}

export default BubbleChartContainer;
