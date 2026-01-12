import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../config/firebase';
import {
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    query,
    where,
    onSnapshot,
    setDoc,
    enableNetwork,
    disableNetwork
} from 'firebase/firestore';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';

const TransactionContext = createContext();

export const useTransactions = () => useContext(TransactionContext);

const initialWorkspaces = [
    { id: 'personal', name: 'Keuangan Pribadi', type: 'personal', themeColor: '#6366f1', currency: 'IDR' }
];

export const TransactionProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [workspaces, setWorkspaces] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);
    const [activeWorkspaceId, setActiveWorkspaceId] = useState(() => {
        return localStorage.getItem('minichat_active_workspace') || 'personal';
    });
    const [loading, setLoading] = useState(true);

    // 1. Auth & Initial Setup
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                signInAnonymously(auth).catch(err => console.error("Auth Error", err));
            }
        });
        return () => unsubscribe();
    }, []);

    // 2. Sync Workspaces
    useEffect(() => {
        if (!user) return;

        const q = query(collection(db, `users/${user.uid}/workspaces`));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                // Initialize default workspace if none exist
                const personalRef = doc(db, `users/${user.uid}/workspaces/personal`);
                setDoc(personalRef, initialWorkspaces[0]);
            } else {
                const wsData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                setWorkspaces(wsData);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [user]);

    // 3. Sync Transactions
    useEffect(() => {
        if (!user) return;

        const q = query(collection(db, `users/${user.uid}/transactions`));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const txData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setAllTransactions(txData);
        });
        return () => unsubscribe();
    }, [user]);

    // 4. Persistence for Active ID
    useEffect(() => {
        localStorage.setItem('minichat_active_workspace', activeWorkspaceId);
        const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);
        if (activeWorkspace) {
            document.documentElement.style.setProperty('--color-primary', activeWorkspace.themeColor || '#6366f1');
        }
    }, [activeWorkspaceId, workspaces]);


    // --- Derived State ---
    const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || initialWorkspaces[0];
    const transactions = allTransactions.filter(t => t.workspaceId === activeWorkspaceId);


    // --- Actions (Firestore) ---

    const addTransaction = async (transaction) => {
        if (!user) return;
        const newTx = {
            ...transaction,
            date: transaction.date, // Ensure string format YYYY-MM-DD
            workspaceId: activeWorkspaceId,
            createdAt: new Date().toISOString()
        };
        // Use addDoc for auto-generated ID, or setDoc if we managed IDs manually. 
        // Here we let Firestore gen ID, but we need to map it back. 
        // Actually for simplicity let's use collection ref.
        await addDoc(collection(db, `users/${user.uid}/transactions`), newTx);
    };

    const deleteTransaction = async (id) => {
        if (!user) return;
        await deleteDoc(doc(db, `users/${user.uid}/transactions`, id));
    };

    const editTransaction = async (id, updatedData) => {
        if (!user) return;
        await updateDoc(doc(db, `users/${user.uid}/transactions`, id), updatedData);
    };

    const addWorkspace = async (name, type = 'organization', themeColor = '#10b981') => {
        if (!user) return;
        const newWs = {
            name,
            type,
            themeColor,
            currency: 'IDR',
            createdAt: new Date().toISOString()
        };
        const docRef = await addDoc(collection(db, `users/${user.uid}/workspaces`), newWs);
        // We can rename ID if we want custom IDs, but auto-ID is fine.
        // If we want to switch immediately:
        return docRef.id;
    };

    const switchWorkspace = (id) => {
        setActiveWorkspaceId(id);
    };

    const updateActiveWorkspaceSettings = async (newSettings) => {
        if (!user) return;
        await updateDoc(doc(db, `users/${user.uid}/workspaces`, activeWorkspaceId), newSettings);
    };

    const getSummary = () => {
        const income = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
        const expense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);
        return {
            income,
            expense,
            balance: income - expense
        };
    };

    return (
        <TransactionContext.Provider value={{
            workspaces,
            activeWorkspace,
            transactions,
            addTransaction,
            deleteTransaction,
            editTransaction,
            addWorkspace,
            switchWorkspace,
            updateActiveWorkspaceSettings,
            getSummary,
            loading,
            user
        }}>
            {children}
        </TransactionContext.Provider>
    );
};
