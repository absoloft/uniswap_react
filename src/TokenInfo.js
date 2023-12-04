import React, { useState } from 'react';

function TokenInfo({ tokenData }) {
    const [copyButtonText, setCopyButtonText] = useState('Copy Dextools Link');

    const handleCopy = () => {
        if (tokenData.dextoolsLink) {
            navigator.clipboard.writeText(tokenData.dextoolsLink)
                .then(() => {
                    setCopyButtonText('Copied!');
                    setTimeout(() => setCopyButtonText('Copy Dextools Link'), 2000);
                })
                .catch(() => alert('Failed to copy!'));
        } else {
            alert('No Dextools link available to copy.');
        }
    };

    return (
        <div className="container" id="token-info">
            <p>Token Contract: <strong>{tokenData.contract || 'Not selected'}</strong></p>
            <hr />
            <p>All time ETH: <strong>{tokenData.allTimeEth || '0.00'} ETH</strong></p>
            <p>All time Transactions: <strong>{tokenData.allTimeTransactions || '0'} Transactions</strong></p>
            <hr />
            <p>Last 10 minutes ETH: <strong>{tokenData.tenMinEth || '0.00'} ETH</strong></p>
            <p>Last 10 minutes Transactions: <strong>{tokenData.tenMinTransactions || '0'} Transactions</strong></p>
            <hr />
            {tokenData.contract && (
                <button 
                    className="copy-btn" 
                    onClick={handleCopy}
                >
                    {copyButtonText}
                </button>
            )}
        </div>
    );
}

export default TokenInfo;
