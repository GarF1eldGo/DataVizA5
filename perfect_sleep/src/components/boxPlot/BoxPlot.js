import React, {useState, useEffect, useRef} from "react";
import * as d3 from "d3";
import "./BoxPlot.css";

const BoxPlot = () => {
    const [data, setData] = useState(null);
    const svgRef = useRef();
    const width = 500;
    const height = 500;

    const fetchData = async () => {
        // Please note the path to the data file is 'perfect_sleep/public/data/Apple_Watch_Sleep.json'
        await fetch('./data/Sleep_Efficiency.csv',{
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
            // split the data into two parts
            const firstPart = data.filter(d => d['Alcohol consumption'] === "0");
            const secondPart = data.filter(d => parseInt(d['Alcohol consumption']) > 0);

            const calculate = (boxData, key) => {
                var tmpDict = {};
                const q1 = d3.quantile(boxData.map(d => d['Sleep efficiency']).sort(d3.ascending), 0.25);
                const median = d3.quantile(boxData.map(d => d['Sleep efficiency']).sort(d3.ascending), 0.5);
                const q3 = d3.quantile(boxData.map(d => d['Sleep efficiency']).sort(d3.ascending), 0.75);
                const iqr = q3 - q1;
                const min = q1 - 1.5 * iqr;
                const max = q3 + 1.5 * iqr;
                tmpDict['q1'] = q1;
                tmpDict['median'] = median;
                tmpDict['q3'] = q3;
                tmpDict['min'] = Math.max(min, d3.min(boxData.map(d => d['Sleep efficiency'])));
                tmpDict['max'] = Math.min(max, d3.max(boxData.map(d => d['Sleep efficiency'])));
                tmpDict['key'] = key;

                // min outliers
                const minOutliers = boxData.filter(d => d['Sleep efficiency'] < tmpDict['min']);
                const maxOutliers = boxData.filter(d => d['Sleep efficiency'] > tmpDict['max']);

                tmpDict['minOutliers'] = minOutliers;
                tmpDict['maxOutliers'] = maxOutliers;

                return tmpDict;
            }


            setData([calculate(firstPart, "No drink"), calculate(secondPart, "Drink")]);
        })
        .catch(error => console.error('There has been a problem with your fetch operation:', error));
    };

    const drawBoxPlot = () => {
        const svg = d3.select(svgRef.current);
        const margin = { top: 20, right: 20, bottom: 40, left: 80 };

        if (!data) return;
        svg.selectAll("*").remove();

        // Show the X scale
        var x = d3.scaleBand()
            .range([ margin.left, width-margin.bottom ])
            .domain(["No drink", "Drink"])
            .paddingInner(1)
            .paddingOuter(.5)

        // Show the Y scale
        var y = d3.scaleLinear()
            .domain([0.45,1])
            .range([height-margin.bottom, margin.top])

        svg.append("g")
            .attr("transform", `translate(0, ${height-margin.bottom})`)
            .call(d3.axisBottom(x))
            .selectAll("text") 
            .style("font-size", "15px"); 

        svg.append("g").call(d3.axisLeft(y))
            .attr("transform", "translate(" + margin.left + ",0)")

        // Draw label for y-axis
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', margin.left-50)
            .attr('text-anchor', 'middle')
            .attr("fill", "white")
            .text('Sleep Efficiency')


        // Show the main vertical line
        svg.selectAll(".vertLines")
            .data(data)
            .enter()
            .append("line")
            .attr("class", "vertLines")
            .attr("x1", d => x(d.key) )
            .attr("x2", d => x(d.key) )
            .attr("y1", d => y(d.max))
            .attr("y2", d => y(d.min))
            .attr("stroke", "white")
            .style("width", 40);

        // Show the horizontal line
        svg.selectAll(".boxes")
            .data(data)
            .enter()
            .append("line")
            .attr("x1", d => x(d.key) - 20)
            .attr("x2", d => x(d.key) + 20)
            .attr("y1", d => y(d.max))
            .attr("y2", d => y(d.max))
            .attr("stroke", "white")
            .style("width", 80);

        svg.selectAll(".boxes")
            .data(data)
            .enter()
            .append("line")
            .attr("x1", d => x(d.key) - 20)
            .attr("x2", d => x(d.key) + 20)
            .attr("y1", d => y(d.min))
            .attr("y2", d => y(d.min))
            .attr("stroke", "white")
            .style("width", 80);

        // Rectangle for the main box
        var boxWidth = 100
        svg.selectAll(".boxes")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => x(d.key) - boxWidth/2)
            .attr("y", d => y(d.q3))
            .attr("height", d => y(d.q1) - y(d.q3))
            .attr("width", boxWidth )
            .attr("stroke", "white")
            .style("fill", "#abd9e9")

        // Show the median
        svg.selectAll(".medianLines")
            .data(data)
            .enter()
            .append("line")
            .attr("x1", d => x(d.key) - boxWidth/2)
            .attr("x2", d => x(d.key) + boxWidth/2)
            .attr("y1", d => y(d.median))
            .attr("y2", d => y(d.median))
            .attr("stroke", "white")
            .style("width", 80);

        // Draw outliers
        for(var i=0; i<data.length; i++){
            var minOutliers = data[i].minOutliers;
            var maxOutliers = data[i].maxOutliers;
            svg.selectAll(".minOutliers")
                .data(minOutliers)
                .enter()
                .append("circle")
                .attr("cx", d => x(data[i].key))
                .attr("cy", d => y(d['Sleep efficiency']))
                .attr("r", 3)
                .attr("fill", "white")
                .attr("stroke", "white");
            svg.selectAll(".maxOutliers")
                .data(maxOutliers)
                .enter()
                .append("circle")
                .attr("cx", d => x(data[i].key))
                .attr("cy", d => y(d['Sleep efficiency']))
                .attr("r", 3)
                .attr("fill", "white")
                .attr("stroke", "white");
        }

        // fade in effect
        svg.style("opacity", 0);
        svg.transition().duration(1000).style("opacity", 1);
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        drawBoxPlot();
    }, [data]);

    return (
        <div className="boxPlotContainer">
            <svg ref={svgRef} className="boxPlotSvg" width={width} height={height}></svg>
        </div>
    );
}

export default BoxPlot;