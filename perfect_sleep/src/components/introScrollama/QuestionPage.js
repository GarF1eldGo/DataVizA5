import React, {useEffect, useState} from "react";
import * as d3 from "d3";
import StickyLeftScrollama from "../scrollama/StickyLeftScrollama";
import NationalBarChart from "../nationalBarChart/NationalBarChart";
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import "./QuestionPage.css";


const QuestionPage = () => {
    const [avgSleep, setAvgSleep] = useState(8);
    const [error, setError] = useState(false);

    const handleChange = (event) => {
        setError(false);// reset error
    }

    const handleSubmit = (event) => {
        var inputVal = event.target.value;
        if (event.key === 'Enter') {
            // check if the input is numeric
            if (isNaN(inputVal)) {
                setError(true);
            } else if (inputVal < 2 || inputVal > 14) {// check if the input is within the range
                setError(true);
            } else {
                setAvgSleep(inputVal);
                sessionStorage.setItem("avgSleep", (inputVal).toString());
                window.dispatchEvent(new Event('storage'));
                document.getElementById("introScrollamaContainer").scrollIntoView({behavior: "smooth"}); // scroll to the next section
            }
        }
    }

    const drawTextField = () => {
        return <TextField 
            className="standardTextField" 
            label="" 
            variant="standard" 
            onChange={handleChange}
            onKeyUp={handleSubmit}
            inputProps={{ style: { textAlign: 'center' }}}
            sx={{
                input: {
                    color: "antiquewhite",
                },
                '& .MuiInput-underline:before': {
                    borderBottomColor: 'white'
                },
                '& .MuiInput-underline:after': {
                    borderBottomColor: 'white'
                },
                '& .MuiInputBase-input': {
                    fontSize: '30px'
                },
                '&:hover .MuiInput-underline:before': {
                    borderBottomColor: 'white' 
                },
                '&:hover .MuiInput-underline:after': {
                    borderBottomColor: 'white' 
                }
                }}
            error={error}
            helperText={error ? "Please enter a positive integer less than 12" : ""}
        />
    }

    useEffect(() => {
        drawTextField();
    }, [error, avgSleep]);

    return (
        <div className="introContainer">
            <div className="questionDiv">
                <h1>How many hours do you sleep every night?</h1>
            </div>
            <div className="textContainer">
                {drawTextField()}    
                <h1>Hour</h1>   
            </div>
            {/* <div className="sliderContainer">
                <Slider
                    className="slider"
                    aria-label="sleep-hours"
                    defaultValue={8}
                    valueLabelDisplay="auto"
                    shiftStep={1} 
                    step={1}
                    marks
                    min={1}
                    max={11}
                />
            </div> */}
            {/* <StickyLeftScrollama component={NationalBarChart} /> */}
        </div>
    );
}

export default QuestionPage;