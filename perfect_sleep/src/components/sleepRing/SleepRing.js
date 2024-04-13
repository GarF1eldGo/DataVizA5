import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const SleepRing = () => {
    const svgRef = useRef();
    const [jsonData, setJsonData] = useState(null);
    const width=800;
    const height=800;

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
        const colorDomain = ['HKCategoryValueSleepAnalysisInBed', 'HKCategoryValueSleepAnalysisAsleepREM', 
        'HKCategoryValueSleepAnalysisAsleepCore', 'HKCategoryValueSleepAnalysisAsleepDeep', 'HKCategoryValueSleepAnalysisAwake'];
        const angleScale = d3.scaleLinear()
            .domain([0, 24*60]) 
            .range([0, 2 * Math.PI]); 

        const colorScale = d3.scaleOrdinal()
            .domain(colorDomain)
            .range(["#d7191c","#fdae61","#ffffbf","#abd9e9","#2c7bb6"]);

        
        jsonData.forEach((oneDay, i) => {
            oneDay.forEach(record => {
                var startAngle = angleScale(record.starttime);
                var endAngle = angleScale(record.endtime);

                if (startAngle > endAngle) {
                    endAngle += 2 * Math.PI;
                }

                const arc = d3.arc()
                    .innerRadius(47 + i*2)
                    .outerRadius(50 + i*2)
                    .startAngle(startAngle)
                    .endAngle(endAngle);
                    
                svg.append('path')
                    .attr('d', arc)
                    .attr('fill', colorScale(record.value))
                    .attr('transform', `translate(${width / 2}, ${height / 2})`);
            })
        });
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (jsonData) {
            drawRings();
        }
    }, [jsonData]);

    return (
        <div className="sleepRingContainer">
            <svg className="sleepRingSvg" ref={svgRef} width={width} height={height}></svg>
        </div>
    );

};

export default SleepRing;