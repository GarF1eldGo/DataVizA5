import logo from './logo.svg';
import './App.css';
import React from 'react';
import TitlePage from './components/TitlePage/TitlePage.js';
import NationalBarChart from './components/nationalBarChart/NationalBarChart.js';
import StickyScrollama from './components/scrollama/StickyScrollama.js';
import SleepRing from './components/sleepRing/SleepRing.js';

function App() {
  return (
    <div className="App">
      {/* // Header section */}
      <TitlePage />
      {/* // One section */}
      <SleepRing />
      <NationalBarChart />
      <StickyScrollama />

      {/* // One section */}

      {/* // Conclusion section */}
    </div>
  );
}

export default App;
