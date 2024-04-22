import React, {useState, useEffect, useRef } from "react";
import * as d3 from "d3";

const SankeyChart = () => {
    const svgRef = useRef();
    const [data, setData] = useState(null);
    const width = 800;
    const height = 800;

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

    // Function to generate sigmoid curve
    function sigmoid(x_from, x_to, y_from, y_to, n = 100) {
      var x_values = d3.range(0, 1, 1 / n);
      var y_values = x_values.map(function(x) {
        return Math.exp(x) / (Math.exp(x) + 1);
      });

      var x_scaled = x_values.map(function(x) {
        return x * (x_to - x_from) + x_from;
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

    function sigmoid(x, yMin, yMax) {
      var output = 1 - 1 / (1 + Math.exp(-x));
      return yMin + (output * (yMax - yMin));
    }

    const drawSankey = () => {
        if (!data) return;

      const svg = d3.select(svgRef.current);
      const margin = { top: 50, right: 50, bottom: 50, left: 50 };
      const x = d3.scaleLinear()
        .domain([-6, 6])
        .range([margin.left, width - margin.right]);

      const y = d3.scaleLinear()
        .domain([0, 1])
        .range([height - margin.bottom, margin.top]);

      // sigmoid
      const line = d3.line()
        .x(d => x(d))
        .y(d => y(sigmoid(d, 0.5, 1)));

      svg.append('path')
        .datum(d3.range(-6, 6.1, 0.1))
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', 'antiquewhite')
        .attr('stroke-width', 2);

      // 添加 x 轴和 y 轴
      svg.append('g')
        .attr('transform', `translate(0, ${height - 50})`)
        .call(d3.axisBottom(x));

      svg.append('g')
        .attr('transform', `translate(50, 0)`)
        .call(d3.axisLeft(y));
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        drawSankey();
    }, [data]);

    return (
        <div className="sankeyContainer">
          <svg ref={svgRef} width={width} height={height}/>
        </div>
    );
}

export default SankeyChart;