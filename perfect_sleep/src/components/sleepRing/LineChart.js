import React, {useEffect, useState, useRef} from "react";
import * as d3 from "d3";
import './LineChart.css';

const LineChart = () => {
    const svgRef = useRef();
    const [jsonData, setJsonData] = useState(null);
    const [curDateIdx, setCurDateIdx] = useState(null);
    const width = 800;
    const height = 400;

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
        const margin = {top: 20, right: 20, bottom: 50, left: 50};
        const curDate = curDateIdx ? parseDate(jsonData[curDateIdx].date) : null;
        var data = JSON.parse(JSON.stringify(jsonData)); // deep copy

        // Time Complexity: O(n)!!!. Could be optimized to O(1) by storing the data in a map
        if (curDate) {
            // set the data to only include 7 days before the current date and the current date
            data = jsonData.filter(d => parseDate(d.date) <= curDate && parseDate(d.date) >= d3.timeDay.offset(curDate, -7));
        }

        // remove existing svg elements
        svg.selectAll("*").remove();
        
        var x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return parseDate(d.date); }))
            .range([ margin.left, width-margin.right ]);

        var y = d3.scaleLinear()
            .domain([0, 10])
            .range([ height-margin.bottom, margin.top ]);
        
        // draw axis
        if (curDate) {
            svg.append("g")
                .attr("transform", `translate(0, ${height - margin.bottom + 10})`)
                .call(d3.axisBottom(x).ticks(d3.timeDay));
            svg.append("g")
                .attr("transform", `translate(${margin.left - 10}, 0)`)
                .call(d3.axisLeft(y).tickValues([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
        }else{
            svg.append("g")
                .attr("transform", `translate(0, ${height - margin.bottom + 10})`)
                .call(d3.axisBottom(x));
            svg.append("g")
                .attr("transform", `translate(${margin.left - 10}, 0)`)
                .call(d3.axisLeft(y));
        }
        
        // Add the line
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return x(parseDate(d.date)) })
                .y(function(d) { return y(+d.stress) })
            );

        // add circles for each data point
        svg.selectAll(".myCircles")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "myCircles")
            .attr("fill", "orange")
            .attr("stroke", "none")
            .attr("cx", function(d) { return x(parseDate(d.date)) })
            .attr("cy", function(d) { return y(+d.stress) })
            .attr("r", 3);

        // change the last circle to red
        if (curDate) {
            svg.selectAll(".myCircles")
                .attr("fill", "orange")
                .filter(function(d) { return parseDate(d.date).getDate() === curDate.getDate() })
                .attr("fill", "#d7191c")
                .attr("r", 5);// make the circle bigger
        }
    }

    const handleStorageChange = () => {
        var idx = sessionStorage.getItem("curDateIdx");
        if (idx) {
            setCurDateIdx(parseInt(idx));
            sessionStorage.removeItem("curDateIdx");
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
        }
    }, [jsonData, curDateIdx]);

    return (
        <div className="LineChart">
            <svg ref={svgRef} width={width} height={height}></svg>
        </div>
    );
}

export default LineChart;