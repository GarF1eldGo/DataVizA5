import React, {useState, useEffect, useRef } from "react";
import * as d3 from "d3";

const SankeyChart = () => {
    const svgRef = useRef();
    const [data, setData] = useState(null);

    // Function to generate sigmoid curve
    function sigmoid(x_from, x_to, y_from, y_to, scale = 5, n = 100) {
        var x_values = d3.range(-scale, scale, scale * 2 / n);
        var y_values = x_values.map(function(x) {
          return Math.exp(x) / (Math.exp(x) + 1);
        });
      
        var x_scaled = x_values.map(function(x) {
          return (x + scale) / (scale * 2) * (x_to - x_from) + x_from;
        });
      
        var y_scaled = y_values.map(function(y) {
          return y * (y_to - y_from) + y_from;
        });
      
        var result = [];
        for (var i = 0; i < n; i++) {
          result.push({x: x_scaled[i], y: y_scaled[i]});
        }
        return result;
    }

    const fetchData = async () => {
        // Please note the path to the data file is 'perfect_sleep/public/data/Apple_Watch_Sleep.json'
        await fetch('./data/personSleepInfo.json',{
          headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
           }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setData(data)
        })
        .catch(error => console.error('There has been a problem with your fetch operation:', error));
    };

    const drawSankey = () => {
        const svg = d3.select(svgRef.current);
        const width = 800;
        const height = 800;

        const xScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0, width]);
        
        const yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0, height]);

        // TODO: Implement the sankey diagram
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        drawSankey();
    }, [data]);

    return (
        <svg ref={svgRef} />
    );
}

export default SankeyChart;