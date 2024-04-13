import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import './NationalBarChart.css';

const BarChart = () => {
  const svgRef = useRef();
  const [jsonData, setJsonData] = useState(null);
  const width = 800;
  const height = 350;

  const fetchData = async () => {
    // Please note the path to the data file is 'perfect_sleep/public/data/avgSleepMap.json'
    await fetch('./data/avgSleepMap.json',{
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
      setJsonData(data.records)
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    if (!jsonData) return;
    
    const x = d3.scaleBand()
      .domain(jsonData.map(d => d.hour))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(jsonData, d => d.count)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg.selectAll("mybar")
      .data(jsonData)
      .enter()
      .append("rect")
      .attr("x", d => x(d.hour))
      .attr("width", x.bandwidth())
      .attr("fill", "#69b3a2")
      // no bar at the beginning thus:
      .attr('height', d => 0)
      .attr('y', d => y(0))

    // animation
    svg.selectAll("rect")
      .transition()
      .duration(500)
      .attr('height', d => y(0) - y(d.count))
      .attr('y', d => y(d.count))
      .delay((d,i) => i*100);

  }, [jsonData]);

  return (
    <div className="nationalContainer">
      <svg className="nationalSvg" ref={svgRef} width={width} height={height}></svg>
    </div>
  );
};

export default BarChart;
