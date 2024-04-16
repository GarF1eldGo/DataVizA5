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
import './SleepRing.css';

const SleepRing = () => {
    const svgRef = useRef();
    const [jsonData, setJsonData] = useState(null);
    const [checked, setChecked] = React.useState(true);
    const width=800;
    const height=800;

    const [dateRange, setDateRange] = React.useState(30);

    const handleChange = (event) => {
        setDateRange(event.target.value);
    };

    const handleCheckChange = (event) => {
        setChecked(event.target.checked);
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
                .range(["#fdae61","#fdae61","#abd9e9","#abd9e9","#abd9e9"]);
        }

        // remove the previous rings
        svg.selectAll('path').remove();
        svg.selectAll('g').remove();

        var selectedData = jsonData.slice(-dateRange); // show the last x days
        var ratio = 0;
        const radius=50;
        const length = selectedData.length-1;
        const desiredRadius = 200;
        ratio = (desiredRadius - radius) / length;

        selectedData.forEach((oneDay, i) => {
            oneDay.forEach(record => {
                var startAngle = angleScale(record.starttime);
                var endAngle = angleScale(record.endtime);

                if (startAngle > endAngle) {
                    endAngle += 2 * Math.PI;
                }

                const arc = d3.arc()
                    .innerRadius(radius-ratio + i*ratio)
                    .outerRadius(radius + i*ratio)
                    .startAngle(startAngle)
                    .endAngle(endAngle);
                    
                svg.append('path')
                    .attr('d', arc)
                    .attr('fill', colorScale(record.value))
                    .attr('transform', `translate(${width / 2}, ${height / 2})`); // move the center of the circle to the center of the svg
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

        const twentySacle = d3.scaleLinear()
            .range([0, 360])
            .domain([0, 24]);
        const radians = Math.PI / 180;

        // draw the clock
        var clockRadius = desiredRadius + 10;
        var clockScaleRadius = clockRadius* 1.1;
        var clockFace = svg.append('g')
            .attr('transform', `translate(${width/2}, ${height/2})`);
        clockFace.append('circle')
            .attr('r', clockRadius)
            .attr('fill', 'none')
            .attr('stroke', 'gray')
            .attr('stroke-width', 1);
        clockFace.selectAll(".hour-label")
            .data(d3.range(0, 24, 6))
            .enter()
            .append("text")
            .attr("class", "hour-label")
            .attr("text-anchor", "middle")
            .attr("fill", "gray")
            .attr("x", d => clockScaleRadius * Math.sin(twentySacle(d) * radians))
            .attr(
                "y",
                d => -clockScaleRadius * Math.cos(twentySacle(d) * radians) + 6
            )
            .text(d => d);  

    };
    
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (jsonData) {
            drawRings();
        }
    }, [jsonData, dateRange, checked]);

    return (
        <div className="sleepRingContainer">
            <div className="controllerContainer">
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch checked={checked} onChange={handleCheckChange} name="gilad" />
                        }
                        label="Sleep Status"
                        />
                </FormGroup>
                <Box sx={{ minWidth: 120 }} className="selectBox">
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Select date range</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={dateRange}
                        label="Recent Sleep Data"
                        onChange={handleChange}
                        >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                        <MenuItem value={60}>60</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </div>
            <svg className="sleepRingSvg" ref={svgRef} width={width} height={height}></svg>
        </div>
    );

};

export default SleepRing;