import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import './NationalBarChart.css';

const BarChart = () => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [jsonData, setJsonData] = useState(null);
  const [avgSleep, setAvgSleep] = useState(sessionStorage.getItem("avgSleep"));
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

  const handleStorageChange = () => {
    var val = sessionStorage.getItem("avgSleep");
    val = parseFloat(val);

    if (val) {
      setAvgSleep(Math.round(val*2)/2);
    }
  }

  const animateD3 = () => {
    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    
    if (!jsonData) return;

    svg.selectAll(".mybar")
      .remove();

    const x = d3.scaleBand()
      .domain(jsonData.map(d => d.hour))
      .range([margin.left, width - margin.right])
      .padding(0.1);
    const y = d3.scaleLinear()
      .domain([0, d3.max(jsonData, d => d.percent)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.selectAll(".mybar")
      .data(jsonData)
      .enter()
      .append("rect")
      .attr("class", "mybar")
      .attr("x", d => x(d.hour))
      .attr("width", x.bandwidth())
      .attr("fill", "#69b3a2")
      // no bar at the beginning thus:
      .attr('height', d => 0)
      .attr('y', d => y(0))

    // highlight the bar with the average sleep
    if (avgSleep) {
      svg.selectAll(".mybar")
        .attr("fill", "#69b3a2")
        .filter(d => d.hour === avgSleep)
        .attr("fill", "orange");
    }

    svg.selectAll(".mybar")
      .transition()
      .duration(500)
      .attr('height', d => y(0) - y(d.percent))
      .attr('y', d => y(d.percent))
      .delay((d,i) => i*100);
  }

  useEffect(() => {
    fetchData();
    window.addEventListener('storage', handleStorageChange);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateD3();
          // observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 }); 

    observer.observe(containerRef.current);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    if (!jsonData) return;

    svg.selectAll(".mybar")
      .remove();

    const formatPercent = d3.format(".0%");
    const x = d3.scaleBand()
      .domain(jsonData.map(d => d.hour))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(jsonData, d => d.percent)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .style("color", "white");

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat(formatPercent))
      .style("color", "white");

    svg.selectAll("mybar")
      .data(jsonData)
      .enter()
      .append("rect")
      .attr("class", "mybar")
      .attr("x", d => x(d.hour))
      .attr("width", x.bandwidth())
      .attr("fill", "#8ae0fc")
      // no bar at the beginning thus:
      .attr('height', d => 0)
      .attr('y', d => y(0))

    // highlight the bar with the average sleep
    if (avgSleep) {
      svg.selectAll(".mybar")
        .attr("fill", "#8ae0fc")
        .filter(d => d.hour === avgSleep)
        .attr("fill", "#ffd04a");
    }

    // animation
    svg.selectAll(".mybar")
      .transition()
      .duration(500)
      .attr('height', d => y(0) - y(d.percent))
      .attr('y', d => y(d.percent))
      .delay((d,i) => i*100);

  }, [jsonData, avgSleep]);

  return (
    <div className="nationalContainer" ref={containerRef}>
      <svg id="nationalSvg" ref={svgRef} width={width} height={height}></svg>
    </div>
  );
};

export default BarChart;
