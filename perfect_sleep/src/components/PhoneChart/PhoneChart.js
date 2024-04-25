import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import './PhoneChart.css';

const PhoneChart = () => {

    const svgRef = useRef();
    const containerRef = useRef();
    const [data, setData] = useState(null);
  
    useEffect(() => {
        fetch('/data/SleepStudyData.csv', {
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
            setData(data);
        })
        .catch(error => console.error('There has been a problem with your fetch operation:', error));
    }, []);
    
  
    useEffect(() => {

        if (!data) return;

    const margin = { top: 60, right: 10, bottom: 90, left: 90 };
    const width = 500 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current).attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Aggregate data based on "PhoneTime" categories
    const aggregatedData = d3.rollup(
        data,
        v => d3.sum(v, d => +d['Tired']), // Sum up the "Tired" values for each category
        d => d.PhoneTime // Group by "PhoneTime" categories
    );

    console.log("Aggregated Data: ", aggregatedData);

    const x = d3.scaleBand()
        .domain(['Yes', 'No'])
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(aggregatedData.values())]) // Use the max value of aggregated data
        .nice()
        .range([height, 0]);

    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append('g')
        .call(d3.axisLeft(y));

    svg.selectAll('.mybar')
        .data(aggregatedData)
        .enter().append('rect')
        .attr('class', 'mybar')
        .attr('x', (d) => x(d[0]))
        .attr('y', (d) => y(d[1]))
        .attr('width', x.bandwidth())
        .attr('height', (d) => height - y(d[1]))
        .attr('fill', "#abd9e9");

    // Graph title
    svg.append('text')
        .attr('x', margin.left - 20)
        .attr('y', margin.top - 80)
        .attr('text-anchor', 'left')
        .style('font-size', '16px')
        .style('fill', 'white')
        .text('Surveyed Tiredness Based on Phone Usage');

    // Y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "2em")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text("Total Tiredness");

    // X axis yes or no labels
    /*
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text") 
        .style("font-size", "15px");
    */

    // X axis label
    svg.append('text')
        .attr('x', width / 2.5 + margin.left/2)
        .attr('y', height-margin.bottom+150)
        .attr('text-anchor', 'middle')
        .text('Phone Time')
        .style("fill", "white");

    // fade in effect
    svg.style('opacity', 0)
    svg.transition().duration(1000).style('opacity', 1);
      
  }, [data]);
  
    return (
        <div>
          <svg ref={svgRef} width={1000} height={1000}/>
        </div>
    );
};
  
  export default PhoneChart;
  