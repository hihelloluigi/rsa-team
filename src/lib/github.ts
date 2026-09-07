// Reads and writes a single file in the repo through the GitHub Contents API,
// using the token of whoever signed in. The admin edits content by committing,
// so every change keeps the same review trail as a hand edit: it shows in the
// history, CI runs on it, and Vercel redeploys from it.
const REPO = process.env.ADMIN_GITHUB_REPO ?? "hihelloluigi/rsa-team";
const BRANCH = process.env.ADMIN_GITHUB_BRANCH ?? "main";
const API = "https://api.github.com";

const headers = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
});

export async function readFileFromRepo(
  token: string,
  path: string,
): Promise<{ text: string; sha: string }> {
  const res = await fetch(`${API}/repos/${REPO}/contents/${path}?ref=${BRANCH}`, {
    headers: headers(token),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`);
  const body = await res.json();
  return { text: Buffer.from(body.content, "base64").toString("utf8"), sha: body.sha };
}

export async function commitFileToRepo(
  token: string,
  { path, text, sha, message }: { path: string; text: string; sha: string; message: string },
): Promise<string> {
  const res = await fetch(`${API}/repos/${REPO}/contents/${path}`, {
    method: "PUT",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(text, "utf8").toString("base64"),
      // Passing the sha we read makes this a compare-and-swap: if the file moved
      // on underneath us the write is rejected rather than silently reverting
      // whatever changed in between.
      sha,
      branch: BRANCH,
    }),
  });
  if (res.status === 409) {
    throw new Error("The file changed on GitHub since this page loaded. Reload and try again.");
  }
  if (!res.ok) throw new Error(`GitHub write failed: ${res.status}`);
  const body = await res.json();
  return body.commit?.html_url ?? "";
}
