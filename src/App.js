import React, { useState, useEffect } from 'react';
import './index.css';
import TransactionsTable from './TransactionsTable';
import BubbleChartContainer from './BubbleChartContainer';
import TokenInfo from './TokenInfo';
import DEXToolsWidget from './DEXToolsWidget';

function App() {
    const [selectedToken, setSelectedToken] = useState(null);
    const [allTransactions, setAllTransactions] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [tokenInfo, setTokenInfo] = useState({});
    const [dextoolsLink, setDextoolsLink] = useState('');

    const maxTransactions = 1000; 
    const timeWindow = 10 * 60 * 1000; 

    const filterOldTransactions = (transactions) => {
        const now = Date.now();
        return transactions.filter(tx => (now - new Date(tx.timestamp).getTime()) < timeWindow)
                           .slice(0, maxTransactions);
    };

    // Fetch all transactions once and store them
	useEffect(() => {
	    const fetchAllTransactions = async () => {
	        try {
	            const response = await fetch(`${process.env.REACT_APP_API_URL}/transactions`);
	            const data = await response.json();
	            setAllTransactions(filterOldTransactions(data));
	        } catch (error) {
	            console.error('Error fetching all transactions:', error);
	        }
	    };

	    fetchAllTransactions();
	}, []);

	// Fetch recent transactions once and store them
	useEffect(() => {
	    const fetchRecentTransactions = async () => {
	        try {
	            const response = await fetch(`${process.env.REACT_APP_API_URL}/get_recent_transactions`);
	            const data = await response.json();
	            setRecentTransactions(filterOldTransactions(data));
	        } catch (error) {
	            console.error('Error fetching recent transactions:', error);
	        }
	    };

	    fetchRecentTransactions();
	}, []);



    useEffect(() => {
	    if (selectedToken) {
	        const filteredAllTransactions = allTransactions.filter(tx => tx.token === selectedToken);
	        const filteredRecentTransactions = recentTransactions.filter(tx => tx.token === selectedToken);
	        
	        const allTimeEth = filteredAllTransactions.reduce((acc, tx) => acc + tx.eth_balance, 0);
	        const allTimeTransactions = filteredAllTransactions.length;
	        const tenMinEth = filteredRecentTransactions.reduce((acc, tx) => acc + tx.eth_balance, 0);
	        const tenMinTransactions = filteredRecentTransactions.length;

	        // Find a transaction with the selected token to get the Dextools link
	        const tokenTransaction = allTransactions.find(tx => tx.token === selectedToken);
	        const newDextoolsLink = tokenTransaction ? tokenTransaction.dextools_link : '';

	        setTokenInfo({
	            contract: selectedToken,
	            allTimeEth: allTimeEth.toFixed(2),
	            allTimeTransactions,
	            tenMinEth: tenMinEth.toFixed(2),
	            tenMinTransactions,
	            dextoolsLink: newDextoolsLink // Include the Dextools link here
	        });

	        setDextoolsLink(newDextoolsLink); // Update Dextools link
	    }
	}, [selectedToken, allTransactions, recentTransactions]);


    return (
        <div className="App">
            <div className="top-section" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '50%', height: '550px' }}> {/* Set a fixed height */}
                    <BubbleChartContainer onTokenSelect={setSelectedToken} />
                </div>
                <div style={{ width: '50%', height: '550px' }}> {/* Set a fixed height */}
                    <DEXToolsWidget dextoolsLink={dextoolsLink} />
                </div>
            </div>
            <TokenInfo tokenData={tokenInfo} />
            <TransactionsTable transactions={allTransactions} />
        </div>
    );
}


export default App;
