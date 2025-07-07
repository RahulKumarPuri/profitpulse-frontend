const BASE_URL = "https://profitpulse-nbo4.onrender.com";

// 🔐 Register User
async function registerUser() {
  const name = document.getElementById("name").value;
  const mobile = document.getElementById("mobile").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, mobile, email, password })
  });

  if (res.ok) {
    alert("✅ Registered successfully");
    window.location.href = "index.html";
  } else {
    alert("❌ Registration failed");
  }
}

// 🔑 Login User
async function loginUser() {
  const mobile = document.getElementById("mobile").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, password })
  });

  if (res.status !== 200) return alert("❌ Invalid login");

  const data = await res.json();
  localStorage.setItem("token", data.token);
  alert("✅ Login successful");
  window.location.href = "home.html";
}

// 💸 Select Stock & Redirect to Payment
function selectStock(stock, amount) {
  localStorage.setItem("stock", stock);
  localStorage.setItem("amount", amount);
  window.location.href = "payment.html";
}

// 📤 Submit TXN ID
async function submitPayment() {
  const txnId = document.getElementById("txnId").value;
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/buy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({
      stock: localStorage.getItem("stock"),
      amount: localStorage.getItem("amount"),
      txnId
    })
  });

  if (res.ok) {
    document.getElementById("popup").style.display = "block";
  } else {
    alert("❌ Payment submission failed");
  }
}

// 🔍 Admin Panel - Load Transactions
async function loadTransactions() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/admin/transactions`, {
    headers: { Authorization: token }
  });

  if (res.status !== 200) return alert("❌ Access Denied");

  const data = await res.json();
  const list = document.getElementById("txnList");
  list.innerHTML = "";

  data.forEach(txn => {
    const li = document.createElement("li");
    li.innerHTML = `
      <b>${txn.user}</b> bought ${txn.stock} ₹${txn.amount} — TXN ID: ${txn.txnId} [${txn.status}]
      ${txn.status === "pending" ? `<button onclick="markPaid('${txn.txnId}')">Mark Paid</button>` : ""}
    `;
    list.appendChild(li);
  });
}

// ✅ Mark TXN as Paid (Admin Only)
async function markPaid(txnId) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/admin/mark-paid`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({ txnId })
  });

  if (res.ok) {
    alert("✅ Transaction marked as paid");
    loadTransactions();
  } else {
    alert("❌ Error updating status");
  }
}
