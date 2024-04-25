import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';

const StressScatterPlotAvgChart = () => {
  const svgRef1 = useRef();
  const svgRef2 = useRef();
  const [data, setData] = useState(null);

  function calculateLinearRegression(data, key) {
    const n = data.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    data.forEach(d => {
      sumX += +d['Stress Level'];
      sumY += d[key];
      sumXY += (+d['Stress Level']) * d[key];
      sumXX += (+d['Stress Level']) * (+d['Stress Level']);
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  }

  useEffect(() => {
    fetch('./data/Sleep_health_and_lifestyle_dataset.csv', {
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
          // Group data by stress level
          const groupedData = d3.group(data, d => d['Stress Level']);
          // Calculate the averages of "Quality of Sleep" and "Sleep Duration" for each stress level
          const averagedData = Array.from(groupedData, ([key, value]) => ({
            'Stress Level': key,
            avgQuality: d3.mean(value, d => +d['Quality of Sleep']),
            avgDuration: d3.mean(value, d => +d['Sleep Duration'])
          }));

          setData(averagedData);
        })
        .catch(error => console.error('There has been a problem with your fetch operation:', error));
  }, []);

  useEffect(() => {
    if (!data) return;

    const margin = { top: 10, right: 10, bottom: 40, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d['Stress Level'])])
        .range([0, width]);

    const y1 = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.avgDuration)])
        .range([height, 0]);

    const y2 = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.avgQuality)])
        .range([height, 0]);

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

    const linearRegression1 = calculateLinearRegression(data, 'avgDuration');
    const linearRegression2 = calculateLinearRegression(data, 'avgQuality');

    g1.append("line")
        .attr("x1", x(0))
        .attr("y1", y1(linearRegression1.intercept))
        .attr("x2", x(d3.max(data, d => +d['Stress Level'])))
        .attr("y2", y1(linearRegression1.slope * d3.max(data, d => +d['Stress Level']) + linearRegression1.intercept))
        .attr("stroke", "red");

    g2.append("line")
        .attr("x1", x(0))
        .attr("y1", y2(linearRegression2.intercept))
        .attr("x2", x(d3.max(data, d => +d['Stress Level'])))
        .attr("y2", y2(linearRegression2.slope * d3.max(data, d => +d['Stress Level']) + linearRegression2.intercept))
        .attr("stroke", "red");

    g1.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d['Stress Level']))
        .attr("cy", d => y1(d.avgDuration))
        .attr("r", 5)
        .style("fill", "#abd9e9");

    g2.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d['Stress Level']))
        .attr("cy", d => y2(d.avgQuality))
        .attr("r", 5)
        .style("fill", "#abd9e9");

    [g1, g2].forEach(g => {
      g.append("text")
          .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
          .style("text-anchor", "middle")
          .style("fill", "white")
          .text("Stress Level");
    });

    g1.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text("Average Sleep Duration");

    g2.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text("Average Quality of Sleep");
  }, [data]);

  return (
      <div style={{width: '550px'}}>
        <svg ref={svgRef1} />
        <svg ref={svgRef2} />
      </div>
  );
};

export default StressScatterPlotAvgChart;
