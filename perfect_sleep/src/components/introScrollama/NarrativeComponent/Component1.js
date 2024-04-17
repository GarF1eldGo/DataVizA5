import React, {useState, useEffect} from "react";
import './Component1.css';
import {ReactComponent as SleepSvg} from './tmpSleepGirl.svg';

const Component1 = ({avgSleep}) => {
    const [jsonData, setJsonData] = useState(null);
    const [betterPercent, setBetterPercent] = useState(0);

    const fetchData = async () => {
        // Please note the path to the data file is 'perfect_sleep/public/data/Apple_Watch_Sleep.json'
        await fetch('./data/avgSleepMap.json',{
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

    useEffect(() => {
        if (!jsonData) return;

        var tmpSum = 0;
        jsonData.records.forEach(d => {
            console.log(d.hour, avgSleep);
            if (d.hour < avgSleep){
                tmpSum += d.percent;
            }
        });
        tmpSum = tmpSum*100;
        setBetterPercent(tmpSum.toFixed(1));
    }, [jsonData, avgSleep]);

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="component1Container">
            <div className="imgContainer">
            <h1 id="girlNarrative">You sleep better than {betterPercent}% United States Citizens!</h1>
                <SleepSvg className="sleepSvg"/>
            </div>
        </div>
    );
}

export default Component1;