import { useEffect } from 'react';
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
import StressScatterPlotChart from './components/stressScatterPlotChart/StressScatterPlotChart.js';
import PhoneChart from './components/PhoneChart/PhoneChart.js';
import Introduction from './components/Introduction/Introduction.js'
import Comparison from './components/comparison/Comparison.js';

function App() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('avgSleep');
    };

    // remove the stored data when the user leaves the page
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []); 

  return (
    <div className="App">
      {/* // Introduction */}
      <SnapScroll components={[TitlePage, QuestionPage]} />
      <IntroScrollama />
      <Introduction />

      {/* // Working*/}
      {/* <StickyScrollama /> */}
      <SleepRing />
      <Comparison />

      {/* // Conclusion */}
    </div>
  );
}

export default App;
