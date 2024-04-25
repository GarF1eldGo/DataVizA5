import React, {useState, useEffect} from "react";
import * as d3 from "d3";
import NationalBarChart from "../nationalBarChart/NationalBarChart";
import StressScatterPlotChart from "../stressScatterPlotChart/StressScatterPlotChart";
import StressScatterPlotAvgChart from "../stressScatterPlotChart/StressScatterPlotAvgChart";
import "./LeftVizPage.css";
import BoxPlot from "../boxPlot/BoxPlot";
import PhoneChart from "../PhoneChart/PhoneChart";
import SleepApp from "./sleepapp2.png"
import Dashboard from "./dashboard.png"

const LeftVizPage = ({value,progress}) => {
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        if (progress >= 0.85) {
            setOpacity((1-progress+0.03)/0.3);
        } else {
            setOpacity(1);
        }
    }, [progress]);

    return (
        <div className="leftVizContainer">
            {value === 0 &&
                <div style={{opacity: opacity}}>
                    <NationalBarChart/>
                </div>}
            {value === 1 && <img src={SleepApp} alt="Sleep Apps" className="sleepimg"/>}
            {value === 2 && <img src={Dashboard} alt="Dashboard" className="dashboard"/>} 
            {value === 3 && <div style={{opacity: opacity}}>
                <StressScatterPlotChart/>
            </div>}
            {value === 4 && <div style={{opacity: opacity}}>
                <StressScatterPlotAvgChart/>
            </div>}
            {value === 5 && <div style={{opacity: opacity}}>
                <BoxPlot />
            </div>}
            {value === 6 &&  <div style={{opacity: opacity}}>
                <PhoneChart />
            </div>}
        </div>
    );
}

export default LeftVizPage;
