import React, { useEffect } from "react";
import "./PageTitle.css";

const PageTitle = ({ title, stone, bgImg, subheading, color }) => {
  const [glow, setGlow] = React.useState("40% 50% at 50% 50%");
  useEffect(() => {
    const width = window.innerWidth;
    if (width < 850) {
      setGlow("30% 40% at 50% 55%");
    }
    if (width < 600) {
      setGlow("30% 40% at 50% 60%");
    }
  }, []);
  const backgroundStyle = {
    
  };
  return (
    <div className="page-title-main">
      <div className="page-title-container">
        <div className="page-title-bg" style={backgroundStyle}>
         
        </div>
        <div className="page-title-content">
          <h1
            
          >
            {title}
          </h1>
          <div className="page-title-typewriter">
            <h1
              style={{
                background: `radial-gradient(circle, rgba(${color},0.4) 0%, transparent 50%)`,
                // borderRight: `.1em solid rgb(${color})`,
              }}
            >
              {stone}
            </h1>
          </div>
          <h3
            style={{
              background: `radial-gradient(circle, rgba(${color},0.8) 0%, transparent 70%)`,
            }}
          >
            {subheading}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default PageTitle;
