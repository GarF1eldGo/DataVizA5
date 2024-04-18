import React, {useContext} from "react";
import * as d3 from "d3";
import StickyLeftScrollama from "../scrollama/StickyLeftScrollama";
import SleepingGirl from "./SleepingGirl";
import LeftVizPage from "./LeftVizPage";

const IntroScrollama = () => {

    return (
        <div id="introScrollamaContainer">
            <StickyLeftScrollama leftComponent={LeftVizPage} rightComponent={SleepingGirl}/>
        </div>
    );
}

export default IntroScrollama;