import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';

const StressScatterPlotChart = () => {
  const svgRef1 = useRef();
  const svgRef2 = useRef();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/data/Sleep_health_and_lifestyle_dataset.csv', {
      headers : {
        'Content-Type': 'text/csv',
        'Accept': 'text/csv'
      }
    })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        })
        .then(d3.csvParse)
        .then(data => {
          // Calculate the counts of each "Quality of Sleep" and "Sleep Duration" value
          const countsQuality = d3.rollups(data, v => v.length, d => d['Quality of Sleep']);
          const countsDuration = d3.rollups(data, v => v.length, d => d['Sleep Duration']);
          const countMapQuality = new Map(countsQuality);
          const countMapDuration = new Map(countsDuration);

          // Add a new property to each data point for the count
          data.forEach(d => {
            d.countQuality = countMapQuality.get(d['Quality of Sleep']);
            d.countDuration = countMapDuration.get(d['Sleep Duration']);
          });

          setData(data);
        })
        .catch(error => console.error('There has been a problem with your fetch operation:', error));
  }, []);

  useEffect(() => {
    if (!data) return;

    const margin = { top: 10, right: 10, bottom: 40, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d['Stress Level'])])
        .range([0, width]);

    const y1 = d3.scaleLinear()
        .domain([5, d3.max(data, d => +d['Sleep Duration'])])
        .range([height, 0]);

    const y2 = d3.scaleLinear()
        .domain([3, d3.max(data, d => +d['Quality of Sleep'])])
        .range([height, 0]);

    const sizeQuality = d3.scaleLinear()
        .domain(d3.extent(data, d => d.countQuality))
        .range([1, 5]); // scatter plot dot size

    const sizeDuration = d3.scaleLinear()
        .domain(d3.extent(data, d => d.countDuration))
        .range([1, 5]); // scatter plot dot size

    const svg1 = d3.select(svgRef1.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    const svg2 = d3.select(svgRef2.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    const g1 = svg1.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const g2 = svg2.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    g1.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    g1.append("g")
        .call(d3.axisLeft(y1));

    g2.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    g2.append("g")
        .call(d3.axisLeft(y2));

    g1.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d['Stress Level']))
        .attr("cy", d => y1(+d['Sleep Duration']))
        .attr("r", d => sizeDuration(d.countDuration))
        .style("fill", "#69b3a2");

    g2.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d['Stress Level']))
        .attr("cy", d => y2(+d['Quality of Sleep']))
        .attr("r", d => sizeQuality(d.countQuality))
        .style("fill", "#69b3a2");

    // Add x-axis label for both SVGs
    [g1, g2].forEach(g => {
      g.append("text")
          .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
          .style("text-anchor", "middle")
          .style("fill", "white")
          .text("Stress Level");
    });

    // Add y-axis label for the first SVG
    g1.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text("Sleep Duration");

    // Add y-axis label for the second SVG
    g2.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text("Quality of Sleep");
  }, [data]);

  return (
      <div>
        <svg ref={svgRef1} />
        <svg ref={svgRef2} />
      </div>
  );
};

export default StressScatterPlotChart;
