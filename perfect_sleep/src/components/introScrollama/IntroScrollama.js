import React, {useContext} from "react";
import * as d3 from "d3";
import StickyLeftScrollama from "../scrollama/StickyLeftScrollama";
import SleepingGirl from "./SleepingGirl";
import NationalBarChart from "../nationalBarChart/NationalBarChart";

const IntroScrollama = () => {

    return (
        <div id="introScrollamaContainer">
            <StickyLeftScrollama leftComponent={NationalBarChart} rightComponent={SleepingGirl}/>
        </div>
    );
}

export default IntroScrollama;