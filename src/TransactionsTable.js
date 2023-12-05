import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TransactionsTable() {
    const [transactions, setTransactions] = useState([]);
    const [copyButtonTexts, setCopyButtonTexts] = useState({});

    useEffect(() => {
    const fetchTransactions = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/transactions`);
            setTransactions(response.data);

            // Reset copy button texts
            const initialCopyTexts = response.data.reduce((acc, tx, index) => {
                acc[index] = 'Copy Dextools Link';
                return acc;
            }, {});
            setCopyButtonTexts(initialCopyTexts);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    fetchTransactions();
}, []);


    const copyToClipboard = (text, index) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopyButtonTexts(prev => ({ ...prev, [index]: 'Copied!' }));
                setTimeout(() => {
                    setCopyButtonTexts(prev => ({ ...prev, [index]: 'Copy Dextools Link' }));
                }, 2000);
            })
            .catch(() => alert('Failed to copy!'));
    }

    return (
        <div className="container">
            <div className="scrollable-table">
                <table>
                    <thead>
                        <tr>
                            <th>From</th>
                            <th>ETH Balance</th>
                            <th>Token</th>
                            <th>Dextools</th>
                            <th>Etherscan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx, index) => (
                            <tr key={index}>
                                <td>{`${tx.from_address.slice(0, 6)}...${tx.from_address.slice(-4)}`}</td>
                                <td>{`${tx.eth_balance.toFixed(2)} ETH`}</td>
                                <td>{`${tx.token.slice(0, 6)}...${tx.token.slice(-4)}`}</td>
                                <td>
                                    <button 
                                        className="copy-btn" 
                                        onClick={() => copyToClipboard(tx.dextools_link, index)}
                                    >
                                        {copyButtonTexts[index] || 'Copy'}
                                    </button>
                                </td>
                                <td>
                                    <button className="copy-btn" onClick={() => window.open(tx.etherscan_link, '_blank')}>Etherscan</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TransactionsTable;
