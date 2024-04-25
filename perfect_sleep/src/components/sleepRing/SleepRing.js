import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { createTheme, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import LineChart from './LineChart';

import './SleepRing.css';

const SleepRing = () => {
    const svgRef = useRef();
    const svgLegendRef = useRef();
    const [jsonData, setJsonData] = useState(null);
    const [checked, setChecked] = useState(true);
    const [dateRange, setDateRange] = useState(7);
    var selectedIdx = null;
    const width=600;
    const height=500;

    const handleChange = (event) => {
        setDateRange(event.target.value);
        selectedIdx = null;
        sessionStorage.removeItem("curDateIdx");
        window.dispatchEvent(new Event('storage'));
    };

    const handleCheckChange = (event) => {
        setChecked(event.target.checked);
        selectedIdx = null;
        sessionStorage.removeItem("curDateIdx");
        window.dispatchEvent(new Event('storage'));
    };

    const fetchData = async () => {
        // Please note the path to the data file is 'perfect_sleep/public/data/Apple_Watch_Sleep.json'
        await fetch('./data/Apple_Watch_Sleep.json',{
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

    const isWorkday = (tmpStr) => {
        var date = new Date(tmpStr);
        var day = date.getDay();
        if (day === 6 || day === 5) {// Used sleep at Friday or Saturday (Because next day is weekend)
            return false;
        } else {
            return true;
        }
    };

    const drawRings = () => {
        const svg = d3.select(svgRef.current);
        const colorDomain = ['HKCategoryValueSleepAnalysisAwake', 'HKCategoryValueSleepAnalysisInBed', 'HKCategoryValueSleepAnalysisAsleepREM', 
        'HKCategoryValueSleepAnalysisAsleepCore', 'HKCategoryValueSleepAnalysisAsleepDeep'];
        const angleScale = d3.scaleLinear()
            .domain([0, 24*60]) 
            .range([0, 2 * Math.PI]); 

        var colorScale = d3.scaleOrdinal()
            .domain(colorDomain)
            .range(["#d7191c","#fdae61","#ffffbf","#abd9e9","#2c7bb6"]);

        if (!checked) {
            colorScale = d3.scaleOrdinal()
                .domain(colorDomain)
                .range(["#d7191c","#d7191c","#2c7bb6","#2c7bb6","#2c7bb6"]);
        }

        // remove the previous rings
        svg.selectAll('path').remove();
        svg.selectAll('g').remove();
        
        const radius=50;
        const desiredRadius = 200;
        var selectedData = jsonData.slice(-dateRange); // show the last x days
        var ratio = 0;
        var length = selectedData.length-1;

        ratio = (desiredRadius - radius) / length;

        // draw the rings
        selectedData.forEach((oneDay, i) => {
            var innerRadius = radius + (i-1)*ratio;
            var outerRadius = radius + (i)*ratio;

            if (length === 0) {
                innerRadius = radius;
                outerRadius = desiredRadius;
            }

            // draw background ring
            var workday = isWorkday(oneDay[0].startdate);
            var backgroundColor = workday ? "#ffcdb2" : "#ffb4a2";
            const backgroundArc = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius)
                .startAngle(0)
                .endAngle(2 * Math.PI);
            svg.append('path')
                .attr('d', backgroundArc)
                .attr('fill', backgroundColor)
                .attr('transform', `translate(${width / 2}, ${height / 2})`);

            // entire sleep ring
            var sAngle = angleScale(oneDay[0].starttime);
            var eAngle = angleScale(oneDay[oneDay.length-1].endtime);
            if (sAngle > eAngle) {
                eAngle += 2 * Math.PI;
            }
            const entireArc = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius)
                .startAngle(sAngle)
                .endAngle(eAngle);

            var preEndAngle = null;
            var preValue = null;

            oneDay.forEach(record => {
                var startAngle = angleScale(record.starttime);
                var endAngle = angleScale(record.endtime);

                if (startAngle > endAngle) {
                    endAngle += 2 * Math.PI;
                }

                if (preEndAngle !== null) {
                    preEndAngle -= 0.01;
                    var tmpStart = startAngle+0.01;
                    if (preEndAngle > startAngle+0.01) {
                        tmpStart += 2 * Math.PI;
                    }
                    const preArc = d3.arc()
                        .innerRadius(innerRadius)
                        .outerRadius(outerRadius)
                        .startAngle(preEndAngle)
                        .endAngle(tmpStart);

                    svg.append('path')
                        .attr('d', preArc)
                        .attr('fill', colorScale(preValue))
                        .attr('transform', `translate(${width / 2}, ${height / 2})`)
                        .on("click", function() {
                            if (selectedIdx === i) {
                                svg.selectAll('.highlightRing').remove();// remove the highlight effect
                                selectedIdx = null;
                                sessionStorage.removeItem("curDateIdx");
                                window.dispatchEvent(new Event('storage'));
                            } else {
                                sessionStorage.setItem("curDateIdx", i+jsonData.length-dateRange+3);// My data missing 3 days sleep data
                                window.dispatchEvent(new Event('storage'));
                                selectedIdx = i;
                                // highlight effect
                                svg.selectAll('.highlightRing').remove();
                                svg.append('path')
                                    .attr("class", "highlightRing")
                                    .attr('d', entireArc)
                                    .attr('fill', 'none')
                                    .attr('stroke', '#003566')
                                    .attr('stroke-width', 3)
                                    .attr('transform', `translate(${width / 2}, ${height / 2})`);
                            }                        
                        });
                }
                preEndAngle = endAngle;
                preValue = record.value;

                const arc = d3.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(outerRadius)
                    .startAngle(startAngle)
                    .endAngle(endAngle);
                    
                svg.append('path')
                    .attr('d', arc)
                    .attr('fill', colorScale(record.value))
                    .attr('transform', `translate(${width / 2}, ${height / 2})`) // move the center of the circle to the center of the svg
                    .on("click", function() {
                        if (selectedIdx === i) {
                            svg.selectAll('.highlightRing').remove();// remove the highlight effect
                            selectedIdx = null;
                            sessionStorage.removeItem("curDateIdx");
                            window.dispatchEvent(new Event('storage'));
                        } else {
                            sessionStorage.setItem("curDateIdx", i+jsonData.length-dateRange+3);
                            window.dispatchEvent(new Event('storage'));
                            selectedIdx = i;
                            // highlight effect
                            svg.selectAll('.highlightRing').remove();
                            svg.append('path')
                                .attr("class", "highlightRing")
                                .attr('d', entireArc)
                                .attr('fill', 'none')
                                .attr('stroke', '#003566')
                                .attr('stroke-width', 3)
                                .attr('transform', `translate(${width / 2}, ${height / 2})`);
                        }                        
                    });
                })
            // if (!checked) {
            //     var firstStartTime = oneDay[0].starttime;
            //     var lastEndTime = oneDay[oneDay.length-1].endtime;
            //     var startAngle = angleScale(lastEndTime);
            //     var endAngle = angleScale(firstStartTime);

            //     if (startAngle > endAngle) {
            //         endAngle += 2 * Math.PI;
            //     }

            //     const arc = d3.arc()
            //         .innerRadius(radius-ratio + i*ratio)
            //         .outerRadius(radius + i*ratio)
            //         .startAngle(startAngle)
            //         .endAngle(endAngle);
            //     svg.append('path')
            //         .attr('d', arc)
            //         .attr('fill', '#fdae61')
            //         .attr('transform', `translate(${width / 2}, ${height / 2})`);
            // }
        });
        
        const indexMap = {0:0, 1:6, 2:12, 3:18};
        const twentySacle = d3.scaleLinear()
            .domain([0, 24])    
            .range([0, 360]);
        const radians = Math.PI / 180;

        // draw the clock
        var clockRadius = desiredRadius + 10;
        var clockScaleRadius = clockRadius* 1.1;
        var clockFace = svg.append('g')
            .attr('transform', `translate(${width/2}, ${height/2})`);
        clockFace.append('circle')
            .attr('r', clockRadius)
            .attr('fill', 'none')
            .attr('stroke', 'white')
            .attr("opacity", 0.8)
            .attr('stroke-width', 1);
        clockFace.selectAll(".hour-label")
            .data(['12am','6am','12pm','6pm'])
            .enter()
            .append("text")
            .attr("class", "hour-label")
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .attr("opacity", 0.8)
            .attr("x", (d,i) => clockScaleRadius * Math.sin(twentySacle(indexMap[i]) * radians))
            .attr(
                "y",
                (d,i) => -clockScaleRadius * Math.cos(twentySacle(indexMap[i]) * radians) + 6
            )
            .text(d => d);  
    };

    const colorLegend = () => {
        const svg = d3.select(svgLegendRef.current);

        // remove the previous legend
        svg.selectAll('g').remove();

        var colorDomain = ['Awake', 'REM',
            'Core', 'Deep'];
        var colorScale = d3.scaleOrdinal()
            .domain(colorDomain)
            .range(["#d7191c", "#ffffbf", "#abd9e9", "#2c7bb6"]);
        if (!checked) {
            colorDomain = ['Awake', 'Asleep'];
            colorScale = d3.scaleOrdinal()
                .domain(colorDomain)
                .range(["#d7191c","#2c7bb6","#2c7bb6","#2c7bb6"]);
        }
        var y=0;
        var x=0;
        for(var i=0; i<colorDomain.length; i++) {
            var tgrp = svg.append('g')
                .attr('transform', `translate(${x},${y + i*20})`);
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
        y=0;
        x=80;
        colorDomain=["Weekday", "Weekend"];
        colorScale = d3.scaleOrdinal()
            .domain(colorDomain)
            .range(["#ffcdb2", "#ffb4a2"]);

        for(var i=0; i<colorDomain.length; i++) {
            var tgrp = svg.append('g')
                .attr('transform', `translate(${x},${y + i*20})`);
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

        x=180;
        y=0
        colorDomain = ['Yes', 'No'];
        colorScale = d3.scaleOrdinal()
            .domain(colorDomain)
            .range(["#69b3a2", "white"]);

        for(var i=0; i<colorDomain.length; i++) {
            var tgrp = svg.append('g')
                .attr('transform', `translate(${x},${y + i*20})`);
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

    const darkTheme = createTheme({
        palette: {
          mode: 'dark', // start dark mode
        },
      });
    
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (jsonData) {
            drawRings();
            colorLegend();
        }
    }, [jsonData, dateRange, checked]);

    return (
        <div className='dashboardContainer'>
            <div className="barGradient"></div>
            <div className="sleepRingContainer">
                <div className="sleepRingPart">
                    <div className="controllerContainer">
                        <ThemeProvider theme={darkTheme}>
                            <CssBaseline />
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch checked={checked} onChange={handleCheckChange} name="gilad" />
                                    }
                                    label="Sleep Status"
                                    />
                            </FormGroup>
                            <Box sx={{ minWidth: 100}} className="selectBox" borderColor={"white"}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label" sx={{color:"white"}}>Select date range</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={dateRange}
                                    label="Recent Sleep Data"
                                    onChange={handleChange}
                                    >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={7}>7</MenuItem>
                                    <MenuItem value={14}>14</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </ThemeProvider>
                    </div>
                    <div className='sleepRingLegend'>
                        <svg className='sleepRingLegendSvg' ref={svgLegendRef} width={250} height={100}></svg>
                    </div>
                    <svg className="sleepRingSvg" ref={svgRef} width={width} height={height}></svg>
                </div>
                <LineChart />
            </div>
        </div>
    );

};

export default SleepRing;