import React from 'react';
import './TitlePage.css';
import titlePage from './TitlePage.jpg';

const TitlePage = () => {
  return (
    <div className="title-page">
      <img src={titlePage} alt="SlumberStats - Plotting Your Path to Quality Sleep" className="background-image"/>
      <div className="white-bar"></div>
    </div>

  );
};

export default TitlePage;