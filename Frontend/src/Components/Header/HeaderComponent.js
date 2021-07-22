import React, { useState } from 'react';
// import { Button } from 'react-bootstrap';

import './index.css';
import brandLogo from '../../Images/brandLogo.png';

function Header() {
  const [ isToggled, setIsToggled ] = useState(false);

  return (
    <header id="Header">
      <nav expand="lg" className="navbar">
        <a href="#home" className="left_side">
          <strong>Bookworm</strong>
          
          <img
            alt="brand logo"
            src={brandLogo}
            className="d-inline-block align-top"
          />
        </a>

        <button
          className={`hamburger ${isToggled ? "active" : ""}`} 
          onClick={() => setIsToggled(!isToggled)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <div className={`right_side ${isToggled ? "show" : ""}`}>
          <a href="#home" className={`signup ${isToggled ? "show" : ""}`}>Sign up</a>
          <a href="#home" className={`login ${isToggled ? "show" : ""}`}>Login</a>
        </div>
      </nav>
    </header>
  )
}

export default Header;
