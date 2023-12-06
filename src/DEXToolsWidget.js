import React from 'react';

function DEXToolsWidget({ dextoolsLink }) {
    const dextoolsURL = `https://www.dextools.io/widget-chart/en/ether/pe-light/${dextoolsLink}?theme=light&chartType=1&chartResolution=5&drawingToolbars=false`;
    
    return (
        <div className="dextools-widget-container">
            <iframe
                id="dextools-widget"
                title="DEXTools Trading Chart"
                src={dextoolsURL}
                style={{ width: '100%', height: '500px', border: 'none' }}
            />
        </div>
    );
}


export default DEXToolsWidget;

