import React, {useState, useEffect} from "react";
import * as d3 from "d3";
import NationalBarChart from "../nationalBarChart/NationalBarChart";
import tmpImage from "./tmpImage.png";
import "./LeftVizPage.css";

const LeftVizPage = ({value,progress}) => {
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        if (progress >= 0.7) {
            setOpacity((1-progress)/0.3);
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
            {value === 1 && <img src={tmpImage} alt="SlumberStats" className="tmpImage"/>}
        </div>
    );
}

export default LeftVizPage;