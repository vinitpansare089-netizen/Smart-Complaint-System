// const API_URL = import.meta.env.VITE_API_URL;

// /* Submit */
// export async function submitComplaint(formData) {
//   const res = await fetch(`${API_URL}/complaint`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(formData),
//   });

//   if (!res.ok) {
//     throw new Error("Submit failed");
//   }

//   return res.json();
// }

// /* Fetch */
// export async function fetchComplaints() {
//   const res = await fetch(`${API_URL}/complaints`);

//   if (!res.ok) {
//     throw new Error("Fetch failed");
//   }

//   return res.json();
// }

// /* Update Status */
// export async function updateStatus(id, status) {
//   const res = await fetch(`${API_URL}/complaints/${id}`, {
//     method: "PATCH", // ✅ MATCH BACKEND
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       status: status,
//     }),
//   });

//   if (!res.ok) {
//     throw new Error("Update failed");
//   }

//   return res.json();
// }

// /* Admin Login */
// export async function adminLogin(email, password) {
//   const res = await fetch(`${API_URL}/admin/login`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       email,
//       password,
//     }),
//   });

//   if (!res.ok) {
//     throw new Error("Login failed");
//   }

//   return res.json();
// }
const API_URL = import.meta.env.VITE_API_URL;

/* =========================
   HELPERS
========================= */
function getAdminHeaders() {
  const token = localStorage.getItem("adminToken");

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

/* =========================
   STUDENT APIs
========================= */

/* Submit Complaint */
export async function submitComplaint(formData) {
  const res = await fetch(`${API_URL}/complaint`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Submit failed");
  }

  return res.json();
}

/* =========================
   ADMIN APIs
========================= */

/* Fetch Complaints (Admin) */
export async function fetchComplaints() {
  const res = await fetch(`${API_URL}/complaints`, {
    headers: getAdminHeaders(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Fetch failed");
  }

  return res.json();
}

/* Update Complaint Status (Admin) */
export async function updateStatus(id, status) {
  const res = await fetch(`${API_URL}/complaints/${id}`, {
    method: "PATCH", // ✅ backend matched
    headers: getAdminHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Update failed");
  }

  return res.json();
}

/* =========================
   AUTH APIs
========================= */

/* Admin Login */
export async function adminLogin(email, password) {
  const res = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Login failed");
  }

  return res.json();
}
