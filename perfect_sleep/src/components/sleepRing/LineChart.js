import React, {useEffect, useState, useRef} from "react";
import * as d3 from "d3";
import { timeFormat } from "d3";
import './LineChart.css';

const LineChart = (props) => {
    const svgRef = useRef();
    const svgRefHeatmap = useRef();
    const svgLegendRef = useRef();
    const [jsonData, setJsonData] = useState(null);
    // const [curDateIdx, setCurDateIdx] = useState(null);
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
        
        var curDateIdx = props.curDateIdx;
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
        svg.selectAll("text").remove();
        
        var x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return parseDate(d.date); }))
            .range([ margin.left, width-margin.right ]);

        var y = d3.scaleLinear()
            .domain([0, 10])
            .range([ height-margin.bottom, margin.top ]);
        
        // draw axis
        const customTimeFormat = timeFormat('%m-%d');
        if (curDate) {
            svg.append("g")
                .attr("transform", `translate(0, ${height - margin.bottom + 15})`)
                .call(d3.axisBottom(x).ticks(d3.timeDay).tickFormat(customTimeFormat));
            svg.append("g")
                .attr("transform", `translate(${margin.left - 10}, 0)`)
                .call(d3.axisLeft(y).tickValues([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
        }else{
            svg.append("g")
                .attr("transform", `translate(0, ${height - margin.bottom + 15})`)
                .call(d3.axisBottom(x).ticks(3).tickFormat(customTimeFormat));
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

        // draw line
        const t = svg.transition()
            .duration(750);

        const path = svg.selectAll(".line")
            .data([data]);

        path.enter()
            .append("path")
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "#72aae9")
            .attr("stroke-width", 1.5)
            .merge(path) 
            .transition() 
            .duration(750)
            .attr("d", d3.line()
                .x(function(d) { return x(parseDate(d.date)) })
                .y(function(d) { return y(+d.stress) })
            );

        path.exit()
            .transition()
            .duration(0)
            .attr("d", null) 
            .remove(); 
        
        // draw circles
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
                    .attr("r", 5),
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
            )
            .on("click", function(event, d) {
                var index = data.indexOf(d);
                props.onClick(index); // pass the date to
            })
            .on("mouseover", function(event, d) {
                var index = data.indexOf(d);
                d3.select(this).attr("r", 8);
                props.onMouseOver(index); // pass the date to the parent component
            })
            .on("mouseout", function(event, d) {
                d3.select(this).attr("r", 5);
                props.onMouseOver(null); // pass null to the parent component
            });

        // bring the circles to the front
        svg.selectAll(".myCircles").raise();
    }

    const drawHeatMap = () => {
        var curDateIdx = props.curDateIdx;
        const svg = d3.select(svgRefHeatmap.current);
        const curDate = curDateIdx ? parseDate(jsonData[curDateIdx].date) : null;
        var data=null;

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
            .domain([0,1])
        const myColor2 = d3.scaleLinear()
            .range(["white", "#69b3a2"])
            .domain([0,1])

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

        svg.selectAll(".heatmap")
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
                        .attr("opacity", 1)
                    ),
                exit => exit
                    .call(exit => exit.transition(t)
                        .attr("opacity", 0) 
                        .remove()
                    ));

        svg.selectAll(".heatmapAlcohol")
            .data(data, d => d.date)
            .join(
                enter => enter.append("rect")
                    .attr("class", "heatmapAlcohol")
                    .attr("x", d => x(parseDate(d.date))-bandwidth/2)
                    .attr("y", bandwidth+20)
                    .attr("width", bandwidth)
                    .attr("height", bandwidth)
                    .style("fill", d => myColor2(d.alcohol))
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
                        .attr("opacity", 1)
                    ),
                exit => exit
                    .call(exit => exit.transition(t)
                        .attr("opacity", 0) 
                        .remove()
                    ));
    }

    const drawLegend = () => {
        const svg = d3.select(svgLegendRef.current);
        svg.selectAll('.legend').remove();

        var colorDomain = ['Yes', 'No'];
        var colorScale = d3.scaleOrdinal()
            .domain(colorDomain)
            .range(["#69b3a2", "white"]);

        for(var i=0; i<colorDomain.length; i++) {
            var tgrp = svg.append('g')
                .attr("class", "legend")
                .attr('transform', `translate(${0+30},${0 + i*20})`);
            tgrp.append('rect')
                .attr('width', 10)
                .attr('height', 10)
                .attr('fill', colorScale(colorDomain[i]));

            tgrp.append('text')
                .attr('x', 15)
                .attr('y', 10)
                .text(colorDomain[i])
                .attr('fill', 'white');
        }
    }

    useEffect(() => {
        fetchData();
    }, []);


    useEffect(() => {
        if (jsonData) {
            drawLineChart();
            drawHeatMap();
            // drawLegend();
        }
    }, [jsonData, props.curDateIdx]);

    return (
        <div className="lineChartContainer">
            <div className="lineChart">
                <svg ref={svgRef} width={width} height={height}></svg>
                <svg ref={svgRefHeatmap} width={width} height={height-200}></svg>
            </div>
            <div className='heatmapLegend'>
                <svg className='heatmapLegendSvg' ref={svgLegendRef} width={100} height={100}></svg>
            </div>
        </div>
    );
}

export default LineChart;