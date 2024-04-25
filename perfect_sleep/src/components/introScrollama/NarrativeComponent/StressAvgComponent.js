import React from "react";
import './Component.css';

const StressAvgComponent = () => {
    return (
        <div className="componentContainer">
            <div className="textBlock">
                <p className="text">
                    Condensing all the data points into the average and introducing a linear regression line further illuminates this relationship: stress is negatively correlated with sleep duration and quality.
                    <br></br><br></br>
                    Recognizing the significance of this relationship, we have integrated a stress tracking feature into our SlumberStats dashboard. This tool will not only heighten users' awareness of stress's effects on sleep but also encourage them to monitor and mitigate its impact on their rest.
                </p>
            </div>
        </div>
    );
}

export default StressAvgComponent;
