import React from 'react';

function DEXToolsWidget({ dextoolsLink }) {
    return (
        <div className="dextools-widget-container">
            <iframe
                id="dextools-widget"
                title="DEXTools Trading Chart"
                src={dextoolsLink} // Use the dextoolsLink prop as the source for the iframe
                style={{ width: '100%', height: '500px', border: 'none' }}
            />
        </div>
    );
}

export default DEXToolsWidget;
