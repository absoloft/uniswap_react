import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './index.css';
import TransactionsTable from './TransactionsTable';
import BubbleChartContainer from './BubbleChartContainer';
import TokenInfo from './TokenInfo';
import DEXToolsWidget from './DEXToolsWidget';
import getUniswapPairAddress from './utils/getUniswapPairAddress';

function App() {
    const [selectedToken, setSelectedToken] = useState(null);
    const [allTransactions, setAllTransactions] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [tokenInfo, setTokenInfo] = useState({});
    const [dextoolsLink, setDextoolsLink] = useState('');

    const maxTransactions = 1000; 
    const timeWindow = 10 * 60 * 1000; // 10 minutes

    const filterOldTransactions = (transactions) => {
        const now = Date.now();
        return transactions.filter(tx => (now - new Date(tx.timestamp).getTime()) < timeWindow)
                           .slice(0, maxTransactions);
    };

    useEffect(() => {
        const fetchAllTransactions = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/transactions`);
                const data = await response.json();
                setAllTransactions(data);
            } catch (error) {
                console.error('Error fetching all transactions:', error);
            }
        };

        fetchAllTransactions();
    }, []);

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

    const processedTransactions = useMemo(() => {
        return allTransactions.reduce((acc, tx) => {
            const txData = acc[tx.token] || { allTimeEth: 0, allTimeTransactions: 0, dextoolsLink: '' };

            txData.allTimeEth += tx.eth_balance;
            txData.allTimeTransactions += 1;
            txData.dextoolsLink = tx.dextools_link || txData.dextoolsLink;

            acc[tx.token] = txData;
            return acc;
        }, {});
    }, [allTransactions]);

    const onTokenSelect = useCallback(async (token) => {
        setSelectedToken(token); // This is important to trigger the useEffect below
        const pairAddress = await getUniswapPairAddress(token);
        setDextoolsLink(pairAddress);
    }, []);

    useEffect(() => {
        // This useEffect is now responsible for updating tokenInfo when selectedToken changes
        if (selectedToken) {
            const allTimeData = processedTransactions[selectedToken] || { allTimeEth: 0, allTimeTransactions: 0, dextoolsLink: '' };
            const filteredRecentTransactions = recentTransactions.filter(tx => tx.token === selectedToken);
            const tenMinEth = filteredRecentTransactions.reduce((acc, tx) => acc + tx.eth_balance, 0);
            const tenMinTransactions = filteredRecentTransactions.length;

            setTokenInfo({
                contract: selectedToken,
                allTimeEth: allTimeData.allTimeEth.toFixed(2),
                allTimeTransactions: allTimeData.allTimeTransactions,
                tenMinEth: tenMinEth.toFixed(2),
                tenMinTransactions,
                dextoolsLink: allTimeData.dextoolsLink
            });
        }
    }, [selectedToken, processedTransactions, recentTransactions]);

    return (
        <div className="App">
            <div className="top-section" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '50%', height: '550px' }}> 
                    <BubbleChartContainer onTokenSelect={onTokenSelect} recentTransactions={recentTransactions} />
                </div>
                <div style={{ width: '50%', height: '550px' }}> 
                    <DEXToolsWidget key={dextoolsLink} dextoolsLink={dextoolsLink} />
                </div>
            </div>
            <TokenInfo tokenData={tokenInfo} />
            <TransactionsTable transactions={allTransactions} />
        </div>
    );
}

export default App;
