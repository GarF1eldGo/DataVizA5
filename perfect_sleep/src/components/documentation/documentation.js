import React from "react";
import './documentation.css';

const Documentation = () => {

    return (
        <div className="documentation">
            <div className="title">
                <h1>Final Documentation</h1>
            </div>
            <div className="section">
                <h1>Introduction</h1>
                <p>What is one experience everyone shares? After a hectic day of work, we all turn off the lights, snuggle into our blankets, and fall into the enchantment of sleep. Yet, in the whirlwind of our daily routines, the art of perfecting sleep eludes us. While many people use sleep apps and devices to track their slumber, hoping to improve their sleep, these apps fall short in showing WHY you had a good or bad night of sleep. You are left to figure out why you woke up several times in the night, or why your REM sleep percentage was so low for one particular night. Our project, SlumberStats, aims to guide you through significant lifestyle factors that impact our sleep, while developing a personalized sleep dashboard that enables users to improve their sleep by tracking these factors.
</p>
            </div>
            <div className="section">
                <h1>Related Work</h1>
                <p>Our initial interest in sleep was inspired by a New York Times article, “The Secrets to Good Sleep.” The article visually takes the user on a journey of falling asleep, by first emphasizing why sleep is important, going into detail about sleep deficiency, explaining what makes good sleep, and finally providing simple solutions to improve sleep. Our website's smooth scrolling, graphic design, and storytelling was inspired by this article’s approach to exploring sleep. <br></br><br></br>To add onto the user experience, we included interactivity and customization to our visualizations, similar to the NYT article, “Sleep Better at Every Age.” This article gives recommendations for sleep based on age, in order for their readers to understand different needs for sleep at different ages. The main focus for this article was to provide advice. While that article allowed for the user to click on their age range to see customized problems and solutions for sleep based on an age group, we allow our user to input their hours of sleep to compare it to the national average. <br></br><br></br>Last but not least, in the 2022 study by Yu Ikeda and Emi Morita, we learned that lifestyle factors such as smartphone usage contributes to reduced sleep efficiency (proportion of time in bed spent asleep) and is correlated with sleep duration and quality. This work inspired what data we decided to collect and represent on our website.
</p>
            </div>
            <div className="section">
                <h1>Methodology</h1>
                <p> We began the project by collecting data from various sources. 
                <ul>
                    <li>Continuous NHANES Pre-Pandemic Questionnaire Data (2017-March 2020): This dataset provided baseline information on average sleep durations across diverse demographics.</li>
                    <li> Kaggle datasets: We utilized “Sleep, Health, and Lifestyle Dataset”, “Sleep Study Data”, and “Sleep Efficiency” to understand impacts of lifestyle factors on sleep.</li>
                    <li>Personal Health Data: Apple Watch data from individuals (Chengke and an anonymous user on Kaggle) supplemented our analysis with real-time sleep tracking metrics.</li>
                </ul>
                <br></br>
                Using Python and the Pandas library, our analysis began with the calculation of Pearson’s correlation coefficients to identify relationships between various lifestyle factors and sleep metrics in Sleep, Health. and Lifestyle Data. We found significant correlations between sleep duration and stress. Furthermore, we employed regression analysis to quantify the impact of selected lifestyle factors on sleep. This helped in understanding the extent to which stress, alcohol, and phone use before bed affect sleep. <br></br><br></br>
                To visualize these findings, we created several graphs and charts, such as “Sleep Duration vs Stress Level”, “Quality of Sleep vs Stress Level”, “Average Sleep Duration vs Stress Level”, “Average Quality of Sleep vs Stress Level”, “No Alcohol Consumed and Alcohol Consumed vs Sleep Efficiency”, and “Phone Usage vs % Feeling Tired”. These visualizations were designed to be intuitive and easy-to-understand, providing users with clear insights into the factors affecting their sleep.</p>
            </div>
            <div className="section">
                <h1>Design</h1>
                <p>We wanted to base our visualization project on a night theme, with shades of blue indicating sleep and red indicating awake. We decided on a sleep ring design to reference the clock as well as to represent the cyclical nature of sleep. Finally, cross-filtering was an important interactive feature we wanted to include to show the impact of lifestyle factors on sleep.<br></br><br></br>
                At first, we wanted to focus on creating interactive and animated visualizations to show each factor's impact on sleep in general, rather than on a personalized sleep ring. However, as we refined our narrative and explored sleep, we found that sleep was a very personal and unique experience for everyone, so creating a personalized journey is more engaging and interesting for both us and viewers. Hence, we transitioned to creating an interactive and personalized sleep dashboard for our main visualization, as opposed to several fancy sleep factor visualizations.
                </p>
            </div>
            <div className="section">
                <h1>Implementation</h1>
                <p>We used the React framework to implement our website and imported d3.js to visualize our data. Material-UI component library is used to implement user input, select, and toggle functionalities in our website. We implemented the sticky scroll effect using the scrollama library. <br></br><br></br>
                We preprocessed Chengke's Apple Watch sleep data by cleaning extraneous data records and aggregating his daily sleep data. Then we converted the data into JSON format to load it effectively for the website.</p>
            </div>
            <div className="section">
                <h1>Discussion</h1>
                <p>The final visual encoding and interaction design of SlumberStats has been largely successful, as evidenced by the positive feedback and virtual claps we received during our final presentation. The narrative scroll and storytelling as well as the use of interactive rings to represent each day in the user’s sleep journey has been particularly well-received, with users appreciating the ability to click on a ring and see their stress levels, alcohol consumption, and phone usage for the past week. <br></br><br></br>
                However, originally many users were confused about the visual encoding of the sleep ring, particularly regarding the colors of the sleep ring and what each ring meant. To address this, we added a label above the graph detailing this information, such as the outer ring being the most recent day. This clarification has significantly improved user understanding and interaction with the graph.<br></br><br></br>
                The insights provided by SlumberStats have been valuable for both the intended audience and the general audience. We love showing the website to family and friends and seeing them explore the world of sleep. For us, the project has not only highlighted the importance of data visualization in making complex information accessible and understandable, but also underscored the significance of sleep and its direct correlation with our lifestyle habits. It has reinforced the understanding that the quality of our sleep is largely in our own hands, influenced by the habits we cultivate.</p>
            </div>
            <div className="section">
                <h1>Future Work</h1>
                <p>We would love to extend the comparison analysis section to include both more users and more date ranges. For instance, many people were interested in seeing Chengke’s sleep during finals week contrasted with that of a working adult or a teenager. <br></br><br></br>
                For the sleep dashboard itself, we want to add headings to the labels or add some way to separate the labels for clearer UI. We would also like to add a hover function for the right scatterplot, so that hovering or clicking on a dot would change the sleep ring to show the impact of stress on sleep. This cross filtering would be even more effective with real rather than mock stress / alcohol / phone usage data. <br></br><br></br>
                Last but not least, we hope to add a moon box plot that shows today’s sleep and how it compares to the user’s overall sleep. Lines would extend out of the moon with each night’s sleep hour, with the bottom of the moon being 0 hrs of sleep and the top of the moon being the max hours of sleep the user has gotten.
</p>
            </div>
            <div className="section">
                <h1>Acknowledgements</h1>
                <p>We would like to thank our Professor, Christian Swinehart for providing so much amazing feedback and encouraging this project even amidst the difficult times on campus. We would also like to thank guest critics Matthew Conlen, Asad Pervaiz, and Klara Auerbach for providing invaluable feedback for our project. Thank you Intro to Data Visualization class for a wonderful time!</p>
            </div>
        </div>
    )
}

export default Documentation;