const API_URL = "http://localhost:8000";

/* Submit complaint (User) */
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

/* Fetch all complaints (Admin) */
export async function fetchComplaints() {
  const res = await fetch(`${API_URL}/complaint`);
  return res.json();
}
