import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import './PhoneChart.css';

const PhoneChart = () => {

    const svgRef1 = useRef();
    const svgRef2 = useRef();
    const containerRef = useRef();
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('./data/SleepStudyData.csv', {
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
            // Check if data is empty
            if (data.length === 0) {
                throw new Error('No data fetched');
            }
            // Calculate the counts of each "Quality of Sleep" and "Sleep Duration" value
            const countPhoneTime = d3.rollups(data, v => v.length, d => d['PhoneTime']);
            const countPhoneReach = d3.rollups(data, v => v.length, d => d['PhoneReach']);
            const countMapTime = new Map(countPhoneTime);
            const countMapReach = new Map(countPhoneReach);

            // Add a new property to each data point for the count
            data.forEach(d => {
                d.countPhoneTime = countMapTime.get(d['PhoneTime']);
                d.countPhoneReach = countMapReach.get(d['PhoneReach']);
            });
            setData(data);
        })
        .catch(error => console.error('There has been a problem with your fetch operation:', error));
    }, []);


    useEffect(() => {

    if (!data) return;

    const margin = { top: 60, right: 10, bottom: 90, left: 250 };
    const width = 650 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg1 = d3.select(svgRef1.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const svg2 = d3.select(svgRef2.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Aggregate data based on "PhoneTime" categories
    const totalTiredness = d3.sum(data, d => +d['Tired']); // Total tiredness across all categories
    const aggregatedData1 = d3.rollup(
        data,
        v => (d3.sum(v, d => +d['Tired']) / totalTiredness) * 100, // Calculate percentage of tiredness
        d => d.PhoneTime // Group by "PhoneTime" categories
    );

    // Aggregate data based on "PhoneReach" categories
    const aggregatedData2 = d3.rollup(
        data,
        v => (d3.sum(v, d => +d['Tired']) / totalTiredness) * 100, // Calculate percentage of tiredness
        d => d.PhoneReach // Group by "PhoneReach" categories
    );

    // console.log("Aggregated Data: ", aggregatedData1);

    const x = d3.scaleBand()
        .domain(['Yes', 'No'])
        .range([0, width])
        .padding(0.1);

    const y1 = d3.scaleLinear()
        .domain([0, d3.max(aggregatedData1.values())]) // Use the max value of aggregated data
        .nice()
        .range([height, 0]);

    const y2 = d3.scaleLinear()
        .domain([0, d3.max(aggregatedData2.values())]) // Use the max value of aggregated data
        .nice()
        .range([height, 0]);

    svg1.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg1.append('g')
        .call(d3.axisLeft(y1));

    svg1.selectAll('.mybar')
        .data(aggregatedData1)
        .enter().append('rect')
        .attr('class', 'mybar')
        .attr('x', (d) => x(d[0]))
        .attr('y', (d) => y1(d[1]))
        .attr('width', x.bandwidth())
        .attr('height', (d) => height - y1(d[1]))
        .attr('fill', "#abd9e9");

    // Graph title
    svg1.append('text')
        .attr('x', margin.left - 225)
        .attr('y', margin.top - 80)
        .attr('text-anchor', 'left')
        .style('font-size', '16px')
        .style('fill', 'white')
        .text('Surveyed Tiredness Based on Phone Usage');

    // Y axis label
    svg1.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "12em")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text("% Feeling Tired");

    // X axis yes or no labels
    /*
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("font-size", "15px");
    */

    // X axis label
    svg1.append('text')
        .attr('x', width / 6 + margin.left/2)
        .attr('y', height-margin.bottom+150)
        .attr('text-anchor', 'middle')
        .text('Phone Usage')
        .style("fill", "white");

    // fade in effect
    svg1.style('opacity', 0)
    svg1.transition().duration(1000).style('opacity', 1);

    svg2.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg2.append('g')
        .call(d3.axisLeft(y2));

    svg2.selectAll('.mybar')
        .data(aggregatedData2)
        .enter().append('rect')
        .attr('class', 'mybar')
        .attr('x', (d) => x(d[0]))
        .attr('y', (d) => y2(d[1]))
        .attr('width', x.bandwidth())
        .attr('height', (d) => height - y2(d[1]))
        .attr('fill', "#abd9e9");

    // Graph title
    svg2.append('text')
        .attr('x', margin.left - 225)
        .attr('y', margin.top - 80)
        .attr('text-anchor', 'left')
        .style('font-size', '16px')
        .style('fill', 'white')
        .text('Surveyed Tiredness Based on Phone Reach');

    // Y axis label
    svg2.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "12em")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text("Total Tiredness");

    // X axis label
    svg2.append('text')
        .attr('x', width / 6 + margin.left/2)
        .attr('y', height-margin.bottom+150)
        .attr('text-anchor', 'middle')
        .text('Phone Reach')
        .style("fill", "white");

    // fade in effect
    svg2.style('opacity', 0)
    svg2.transition().duration(1000).style('opacity', 1);

  }, [data]);

    return (
        <div>
          <svg ref={svgRef1} width={1500} height={1000}/>
        </div>
    );
};

  export default PhoneChart;
