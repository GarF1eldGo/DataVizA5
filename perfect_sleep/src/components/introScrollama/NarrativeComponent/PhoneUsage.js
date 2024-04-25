import React from "react";
import './Component.css';

const PhoneUsage = () => {
    return (
        <div className="componentContainer">
            <div className="textBlock">
                <h1 className="title">
                Using Phones Before Bed
                </h1>
                <p className="text">
                In our modern age, it is nearly impossible to stray away from our phones. We use phones for almost everything: to communicate with friends and family, keep up with current affairs, and provide entertainment. Many of us catch ourselves endlessly scrolling through our phones in the dark before we fall asleep each night. For some it might be a comforting nightly routine, but for others it may feel like a dooming habit. From countless studies, it is commonly known that using the phone right before bed negatively impacts our sleep quality. Specifically, bluelight emitted by smartphone screens suppresses melatonin secretion which reduces sleepiness and disrupts our sleep cycles. <br></br><br></br>
                From a survey, we found that people who use phones 30 minutes before bed have higher tiredness percentages. Hence, phone usage is a factor we will track as well.
                </p>
            </div>
        </div>
    );
}

export default PhoneUsage;