import React, {useEffect, useState, useRef} from "react";
import * as d3 from "d3";
import './LineChart.css';

const LineChart = () => {
    const svgRef = useRef();
    const svgRefHeatmap = useRef();
    const svgRefHeatmapConsumption = useRef();
    const [jsonData, setJsonData] = useState(null);
    const [curDateIdx, setCurDateIdx] = useState(null);
    const width = 690;
    const height = 350;
    const margin = {top: 20, right: 80, bottom: 50, left: 140};

    const fetchData = async () => {
        // Please note the path to the data file is 'perfect_sleep/public/data/Apple_Watch_Sleep.json'
        await fetch('./data/mockData.json',{
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
          setJsonData(data)
        })
        .catch(error => console.error('There has been a problem with your fetch operation:', error));
    };

    const parseDate = (dateStr) => {
        return d3.timeParse("%Y-%m-%d")(dateStr);
    }

    
    const drawLineChart = () => {
        if (!jsonData) return;
        
        const svg = d3.select(svgRef.current);
        const curDate = curDateIdx ? parseDate(jsonData[curDateIdx].date) : null;
        var data = null; // deep copy

        // Time Complexity: O(n)!!!. Could be optimized to O(1) by storing the data in a map
        if (curDate) {
            // set the data to only include 7 days before the current date and the current date
            data = jsonData.filter(d => parseDate(d.date) <= curDate && parseDate(d.date) >= d3.timeDay.offset(curDate, -7));
        } else {
            data = jsonData.slice(-30); // only show the last 30 days
            svg.selectAll("path").remove();
        }

        // remove existing svg elements
        svg.selectAll("g").remove();
        
        var x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return parseDate(d.date); }))
            .range([ margin.left, width-margin.right ]);

        var y = d3.scaleLinear()
            .domain([0, 10])
            .range([ height-margin.bottom, margin.top ]);
        
        // draw axis
        if (curDate) {
            svg.append("g")
                .attr("transform", `translate(0, ${height - margin.bottom + 15})`)
                .call(d3.axisBottom(x).ticks(d3.timeDay));
            svg.append("g")
                .attr("transform", `translate(${margin.left - 10}, 0)`)
                .call(d3.axisLeft(y).tickValues([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
        }else{
            svg.append("g")
                .attr("transform", `translate(0, ${height - margin.bottom + 15})`)
                .call(d3.axisBottom(x));
            svg.append("g")
                .attr("transform", `translate(${margin.left - 10}, 0)`)
                .call(d3.axisLeft(y));
        }

        // draw labels
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width-margin.right+30 )
            .attr("y", height-margin.bottom+15)
            .attr("fill", "white")
            .text("Date");

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr('x', -(height-margin.top-margin.bottom) / 2 -15)
            .attr('y', margin.left-40)
            .attr("fill", "white")
            .text("Stress Level");

        const t = svg.transition()
            .duration(750);

        const path = svg.selectAll(".line")
            .data([data]);

        path.enter()
            .append("path")
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .merge(path) 
            .transition() 
            .duration(500)
            .attr("d", d3.line()
                .x(function(d) { return x(parseDate(d.date)) })
                .y(function(d) { return y(+d.stress) })
            );

        path.exit()
            .transition()
            .duration(0)
            .attr("d", null) 
            .remove(); 
    
        svg.selectAll(".myCircles")
            .data(data, d=>d.date)
            .join(
                enter => enter.append("circle")
                    .attr("fill", function(d) { 
                        if (!curDate) return "orange";
                        return parseDate(d.date).getDate() === curDate.getDate() ? "#d7191c" : "orange" }
                    )
                    .attr("class", "myCircles")
                    .attr("stroke", "none")
                    .attr("cx", -30)
                    .attr("cy", function(d) { return y(+d.stress) }))
                  .call(enter => enter.transition(t)
                    .attr("cx", function(d) { return x(parseDate(d.date)) })
                    .attr("r", 3),
                update => update
                    .attr("cy", function(d) { return y(+d.stress) }))
                  .call(update => update.transition(t)
                    .attr("fill", function(d) { 
                        if (!curDate) return "orange";
                        return parseDate(d.date).getDate() === curDate.getDate() ? "#d7191c" : "orange" }
                    )
                    .attr("cx", function(d) { return x(parseDate(d.date)) }),
                    
                exit => exit
                  .call(exit => exit.transition(t)
                    .remove())
            );
    }

    const drawHeatMap = () => {
        const svg = d3.select(svgRefHeatmap.current);
        const curDate = curDateIdx ? parseDate(jsonData[curDateIdx].date) : null;
        var data = null;

        // Time Complexity: O(n)!!!. Could be optimized to O(1) by storing the data in a map
        if (curDate) {
            // set the data to only include 7 days before the current date and the current date
            data = jsonData.filter(d => parseDate(d.date) <= curDate && parseDate(d.date) >= d3.timeDay.offset(curDate, -7));
        } else {
            data = jsonData.slice(-30); // only show the last 30 days
        }
        
        const x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return parseDate(d.date); }))
            .range([ margin.left, width-margin.right ]);

        const myColor = d3.scaleLinear()
            .range(["white", "#69b3a2"])
            .domain([0,3])

        const bandwidth = (width - margin.left - margin.right) / data.length;

        // draw heatmap labels
        var fontSize = 12;
        if (bandwidth > 20) {
            fontSize = 16;
        }
        svg.selectAll(".heatmapLabel").remove();
        svg.append("text")
            .attr("class", "heatmapLabel")
            .attr("text-anchor", "end")
            .attr("x", margin.left-bandwidth/2-10)
            .attr("y", bandwidth/2+fontSize/2-2)
            .attr("fill", "white")
            .attr("font-size", fontSize)
            .text("Phone Usage");

        svg.append("text")
            .attr("class", "heatmapLabel")
            .attr("text-anchor", "end")
            .attr("x", margin.left-bandwidth/2-10)
            .attr("y", bandwidth+20+bandwidth/2+fontSize/2-2)
            .attr("fill", "white")
            .attr("font-size", fontSize)
            .text("Alcohol");

        const t = svg.transition()
            .duration(750);
        const heatMapPhone = svg.selectAll(".heatmap")
            .data(data, d => d.date)
            .join(
                enter => enter.append("rect")
                    .attr("class", "heatmap")
                    .attr("x", d => x(parseDate(d.date))-bandwidth/2)
                    .attr("y", 0)
                    .attr("width", bandwidth)
                    .attr("height", bandwidth)
                    .style("fill", d => myColor(d.phone))
                    .attr("opacity", 1)
                    .call(enter => enter.transition(t)
                        .attr("opacity", 1) 
                    ),
                update => update
                        .attr("width", bandwidth)
                        .attr("height", bandwidth)
                    .call(update => update.transition(t)    
                        .attr("x", d => x(parseDate(d.date))-bandwidth/2)
                    ),
                exit => exit
                    .call(exit => exit.transition(t)
                        .attr("opacity", 0) 
                        .remove()
                    ));
        const heatMapAlcohol = svg.selectAll(".heatmapAlcohol")
            .data(data, d => d.date)
            .join(
                enter => enter.append("rect")
                    .attr("class", "heatmapAlcohol")
                    .attr("x", d => x(parseDate(d.date))-bandwidth/2)
                    .attr("y", bandwidth+20)
                    .attr("width", bandwidth)
                    .attr("height", bandwidth)
                    .style("fill", d => myColor(d.alcohol))
                    .attr("opacity", 1)
                    .call(enter => enter.transition(t)
                        .attr("opacity", 1) 
                    ),
                update => update
                        .attr("y", bandwidth+20)
                        .attr("width", bandwidth)
                        .attr("height", bandwidth)
                    .call(update => update.transition(t)
                        .attr("x", d => x(parseDate(d.date))-bandwidth/2)
                    ),
                exit => exit
                    .call(exit => exit.transition(t)
                        .attr("opacity", 0) 
                        .remove()
                    ));
    }

    const handleStorageChange = () => {
        var idx = sessionStorage.getItem("curDateIdx");
        if (idx) {
            setCurDateIdx(parseInt(idx));
            sessionStorage.removeItem("curDateIdx");
        } else  {
            setCurDateIdx(null);
        }
    };

    useEffect(() => {
        fetchData();

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        }
    }, []);

    useEffect(() => {
        if (jsonData) {
            drawLineChart();
            drawHeatMap();
        }
    }, [jsonData, curDateIdx]);

    return (
        <div className="lineChart">
            <svg ref={svgRef} width={width} height={height}></svg>
            <svg ref={svgRefHeatmap} width={width} height={height-200}></svg>
        </div>
    );
}

export default LineChart;