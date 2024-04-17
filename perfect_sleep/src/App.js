import logo from './logo.svg';
import './App.css';
import React from 'react';
import TitlePage from './components/TitlePage/TitlePage.js';
import NationalBarChart from './components/nationalBarChart/NationalBarChart.js';
import StickyScrollama from './components/scrollama/StickyScrollama.js';
import StickyLeftScrollama from './components/scrollama/StickyLeftScrollama.js';
import SleepRing from './components/sleepRing/SleepRing.js';
import QuestionPage from './components/introScrollama/QuestionPage.js';
import IntroScrollama from './components/introScrollama/IntroScrollama.js';
import SnapScroll from './components/scrollama/SnapScroll.js';

function App() {
  return (
    <div className="App">
      {/* // Introduction */}

      <SnapScroll components={[TitlePage, QuestionPage]} />
      <IntroScrollama />


      {/* // Sleep Apps Intro */}

      {/* // Factors that Affect Sleep */}

      {/* // Sleep Apps Intro */}

      {/* // Stress */}

      {/* // Consumption */}

      {/* // Phone Usage */}

      {/* // Interactive Dashboard */}

      {/* // Working*/}
      <SleepRing />
      <StickyScrollama />

      {/* // Conclusion */}
    </div>
  );
}

export default App;
