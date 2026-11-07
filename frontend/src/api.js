const API_URL = process.env.REACT_APP_API_URL;

export async function api(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // some responses have no body
  }

  if (!res.ok) {
    let message = 'Something went wrong. Please try again.';
    if (data && data.error && !data.timestamp) message = data.error;
    else if (res.status === 400) message = 'Please check the details you entered.';
    else if (res.status === 401) message = 'Please sign in again.';
    else if (res.status === 403) message = 'You are not allowed to do that.';
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return data;
}