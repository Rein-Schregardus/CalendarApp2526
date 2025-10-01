export async function fetchHelper(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`https://localhost:7223${endpoint}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    credentials: "include" // sends cookies automatically
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}