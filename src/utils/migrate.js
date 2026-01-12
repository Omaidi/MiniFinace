export const migrateDataToFirebase = async (db, userId) => {
    // Check if data is already migrated
    const migrated = localStorage.getItem('firebase_migrated');
    if (migrated) return;

    try {
        const localWorkspaces = JSON.parse(localStorage.getItem('minichat_workspaces') || '[]');
        const localTransactions = JSON.parse(localStorage.getItem('minichat_transactions') || '[]');

        // Migrate Workspaces
        for (const ws of localWorkspaces) {
            await setDoc(doc(db, `users/${userId}/workspaces/${ws.id}`), ws);
        }

        // Migrate Transactions
        for (const tx of localTransactions) {
            await setDoc(doc(db, `users/${userId}/transactions/${tx.id}`), tx);
        }

        localStorage.setItem('firebase_migrated', 'true');
        console.log("Migration complete!");
    } catch (error) {
        console.error("Migration failed:", error);
    }
};
