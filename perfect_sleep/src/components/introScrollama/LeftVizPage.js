import React, {useState, useEffect} from "react";
import * as d3 from "d3";
import NationalBarChart from "../nationalBarChart/NationalBarChart";
import StressScatterPlotChart from "../stressScatterPlotChart/StressScatterPlotChart";
import StressScatterPlotAvgChart from "../stressScatterPlotChart/StressScatterPlotAvgChart";
import "./LeftVizPage.css";
import BoxPlot from "../boxPlot/BoxPlot";
import PhoneChart from "../PhoneChart/PhoneChart";
import SleepApp from "./sleepapp.png"

const LeftVizPage = ({value,progress}) => {
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        if (progress >= 0.7) {
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
            {value === 1 && <img src={SleepApp} alt="Sleep Apps" style={{ display: 'flex', width: '80%', height: '90vh', justifyContent: 'center', alignItems: 'center'}} />}
            {value === 2 && null} {/* Factor correlation? */}
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
