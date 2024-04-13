import logo from './logo.svg';
import './App.css';
import React from 'react';
import NationalBarChart from './components/nationalBarChart/NationalBarChart.js';
import StickyScrollama from './components/scrollama/StickyScrollama.js';
import SleepRing from './components/sleepRing/SleepRing.js';

function App() {
  return (
    <div className="App">
      {/* // Header section */}

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
