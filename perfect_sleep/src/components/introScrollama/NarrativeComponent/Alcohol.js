import React from "react";
import './Component.css';

const Alcohol = () => {
    return (
        <div className="componentContainer">
            <div className="textBlock">
                <h1 className="title">
                Alcohol: Restful or Wakeful?
                </h1>
                <p className="text">
                Mental well-being isn't the only factor influencing our sleep — what we ingest plays a crucial role too. While many can attest to alcohol's sedative effects (blacking out from a night out of drinking, for instance), our boxplot analysis reveal a sobering truth: alcohol may expedite slumber but it compromises its restorative value. <br></br><br></br>
                Sleep efficiency, defined as the ratio between the time a person spends asleep, and the total sleep time, stands at a restful median of 0.86 without alcohol. Introduce alcohol into the equation, and this figure plummets to a median of 0.72. This suggests that while alcohol might allow us to sleep faster, it also causes us to wake up more during sleep. Hence, our dashboard will include alcohol consumption to remind users of the link between alcohol and restless nights, offering users a clear metric to monitor and adjust their intake for better sleep health.
                </p>
            </div>
        </div>
    );
}

export default Alcohol;