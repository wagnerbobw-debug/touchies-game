// touchies.js

let playerWallet = null;
const API_BASE_URL = "http://localhost:3000";

// =========================
// 1. MetaMask verbinden
// =========================

async function connectWallet() {
    if (!window.ethereum) {
        alert("MetaMask nicht installiert!");
        return;
    }

    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        });

        playerWallet = accounts[0];
        console.log("Wallet verbunden:", playerWallet);

        document.getElementById("walletDisplay").textContent =
            "Wallet: " + playerWallet;

        loadHistory();
    } catch (err) {
        console.error("Wallet Fehler:", err);
    }
}

// =========================
// 2. Punkte senden
// =========================

async function sendPoints(points) {
    if (!playerWallet) {
        alert("Bitte zuerst Wallet verbinden!");
        return;
    }

    const res = await fetch(`${API_BASE_URL}/api/addPoints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            wallet: playerWallet,
            points: points
        })
    });

    const data = await res.json();
    console.log("Punkte gesendet:", data);

    if (data.points !== undefined) {
        document.getElementById("pointsDisplay").textContent =
            "Gesamtpunkte: " + data.points;
    }

    loadHistory();
}

// =========================
// 3. History laden
// =========================

async function loadHistory() {
    if (!playerWallet) return;

    const res = await fetch(`${API_BASE_URL}/api/history/${playerWallet}`);
    const data = await res.json();

    document.getElementById("historyBox").textContent =
        JSON.stringify(data.history, null, 2);
}

// =========================
// 4. Touchies Gameplay Hook
// =========================

function onTouchSuccess() {
    sendPoints(1); // 1 Punkt pro Touch
}

// =========================
// 5. Auto-Setup
// =========================

window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("connectWalletBtn")
        .addEventListener("click", connectWallet);

    document.getElementById("sendTestPointsBtn")
        .addEventListener("click", () => sendPoints(10));

    document.getElementById("gameArea")
        .addEventListener("click", onTouchSuccess);
});
