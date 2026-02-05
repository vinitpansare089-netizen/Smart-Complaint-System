const API_URL = "https://smart-complaint-system-kiit.onrender.com";


/* Submit */
export async function submitComplaint(formData) {
  const res = await fetch(`${API_URL}/complaint`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  return res.json();
}

/* Fetch */
export async function fetchComplaints() {
  const res = await fetch(`${API_URL}/complaints`);
  return res.json();
}

/* Update Status */
export async function updateStatus(id, status) {
  await fetch(`${API_URL}/complaint/${id}/status?status=${status}`, {
    method: "PUT",
  });
}
