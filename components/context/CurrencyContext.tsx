import React, { createContext, useContext, useState, useEffect } from 'react';

type CurrencyType = 'USD' | 'INR';

interface CurrencyContextType {
    currency: CurrencyType;
    setCurrency: (currency: CurrencyType) => void;
}

const CurrencyContext = createContext<CurrencyContextType>({
    currency: 'USD',
    setCurrency: () => {},
});

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currency, setCurrencyState] = useState<CurrencyType>('USD');

    useEffect(() => {
        const stored = localStorage.getItem('sh_currency');
        if (stored === 'INR' || stored === 'USD') {
            setCurrencyState(stored);
        }
    }, []);

    const setCurrency = (newCurrency: CurrencyType) => {
        setCurrencyState(newCurrency);
        localStorage.setItem('sh_currency', newCurrency);
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);
