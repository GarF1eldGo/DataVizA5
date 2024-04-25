import React, {useState, useEffect} from "react";
import * as d3 from "d3";
import Component1 from "./NarrativeComponent/Component1";
import BoxPlot from "../boxPlot/BoxPlot";
import Component2 from "./NarrativeComponent/Component2";
import Component3 from "./NarrativeComponent/Component3";
import StressComponent from "./NarrativeComponent/StressComponent";
import StressAvgComponent from "./NarrativeComponent/StressAvgComponent";
import Alcohol from "./NarrativeComponent/Alcohol";
import PhoneUsage from "./NarrativeComponent/PhoneUsage";

const SleepingGirl = (props) => {
    const [avgSleep, setAvgSleep] = useState(0);
    const [index, setIndex] = useState(0);

    const handleStorageChange = () => {
        var val = sessionStorage.getItem("avgSleep");
        val = parseFloat(val);
        if (val) {
            setAvgSleep(Math.round(val*2)/2);
        }
    }

    useEffect(() => {
        setIndex(props.value);
    }, [props.value]);

    useEffect(() => {
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        }
    }, []);

    return (
        <div className="sleepGirlContainer">
            {index === 0 && <Component1 avgSleep={avgSleep}/>}
            {index === 1 && <Component2/>}
            {index === 2 && <Component3/>}
            {index === 3 && <StressComponent/>}
            {index === 4 && <StressAvgComponent/>}
            {index === 5 && <Alcohol/>}
            {index === 6 && <PhoneUsage/>}
        </div>
    );
}

export default SleepingGirl;
