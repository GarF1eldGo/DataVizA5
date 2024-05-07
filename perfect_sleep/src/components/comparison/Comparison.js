import React, {useEffect, useState, useRef} from "react";
import * as d3 from "d3";
import "./Comparison.css";

const Comparison = () => {
    const [jsonData, setJsonData] = useState(null);
    const [jsonData2, setJsonData2] = useState(null);
    const svgRef = useRef();
    const svgRef2 = useRef();
    const dateRange = 7;
    const width = 600;
    const height = 600;

    const fetchData = async (path, option) => {
        // Please note the path to the data file is 'perfect_sleep/public/data/Apple_Watch_Sleep.json'
        await fetch(path,{
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
        .then(d => {
          if (option === 1) {
            setJsonData(d);
          }else{
            setJsonData2(d);
          }
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

    const drawRings = (svg, oneData) => {
        if(oneData === null){
            return;
        }
        // const svg = d3.select(svgRef.current);
        const colorDomain = ['HKCategoryValueSleepAnalysisAwake', 'HKCategoryValueSleepAnalysisInBed', 'HKCategoryValueSleepAnalysisAsleepREM', 
        'HKCategoryValueSleepAnalysisAsleepCore', 'HKCategoryValueSleepAnalysisAsleepDeep'];
        const angleScale = d3.scaleLinear()
            .domain([0, 24*60]) 
            .range([0, 2 * Math.PI]); 

        var colorScale = d3.scaleOrdinal()
            .domain(colorDomain)
            .range(["#d7191c","#fdae61","#72aae9","#abd9e9","#5874e9"]);

        // remove the previous rings
        svg.selectAll('path').remove();
        svg.selectAll('g').remove();
        
        const radius=50;
        const desiredRadius = 200;
        var selectedData = oneData.slice(-dateRange); // show the last x days
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
                        .attr('transform', `translate(${width / 2}, ${height / 2})`);
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
                });
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

    const drawComparison = () => {
       for (var i = 0; i < 2; i++) {
            var svg = i === 0 ? d3.select(svgRef.current) : d3.select(svgRef2.current);
            var oneData = i === 0 ? jsonData : jsonData2;
            drawRings(svg, oneData);
        }
    };

    useEffect(() => {
        fetchData('./data/Apple_Watch_Sleep.json', 1);
        fetchData('./data/Apple_Watch_Sleep_2.json', 2);
    }, []);

    useEffect(() => {
        drawComparison();
    }, [jsonData, jsonData2]);

    return (
        <div className="comparisonContainer">
            <div className="comparisonViz">
                <svg ref={svgRef} width={width} height={height}></svg>
                <svg ref={svgRef2} width={width} height={height}></svg>
            </div>
            <div className="comparisonDescription">
            On the left, it’s Chengke's sleep data in the last 7 days.<br/> on the right, it’s another user’s Apple Watch <a href="https://www.kaggle.com/datasets/aeryss/apple-health-sleep-stages-and-heart-rate/data?select=__notebook_source__.ipynb">sleep data</a> found in Kaggle.<br/><br/>
            From the left ring, it's easy to find that Chengke has difficulty in sleeping, which is reflected in more awake periods and more sporadic wake up times. <br/>
            On the right ring, this user’s sleep schedule is consistent, with short awake periods.

            </div>
        </div>
    );
}

export default Comparison;
