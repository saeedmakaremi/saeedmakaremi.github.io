# Roboflow API Proxy - Cloudflare Worker

This Cloudflare Worker keeps your Roboflow API key secure by proxying requests server-side.

## Setup Instructions

### 1. Install Wrangler (Cloudflare CLI)

```bash
npm install -g wrangler
```

Or use npm locally:
```bash
npm install
```

### 2. Login to Cloudflare

```bash
wrangler login
```

This will open your browser to authenticate with Cloudflare.

### 3. Set Your API Key as a Secret

```bash
wrangler secret put ROBOFLOW_API_KEY
```

When prompted, enter your Roboflow API key (get it from your Roboflow dashboard).

**This keeps your API key secure and hidden from client-side code!**

### 4. Deploy the Worker

```bash
npm run deploy
```

Or:
```bash
wrangler deploy
```

### 5. Get Your Worker URL

After deployment, Wrangler will output your worker URL, which will look like:
```
https://roboflow-proxy.YOUR_SUBDOMAIN.workers.dev
```

### 6. Update Your Frontend

In your main project, set the environment variable `VITE_ROBOFLOW_PROXY_URL` to your worker URL:

**Option A: Add to `.env` file (for local development):**
```env
VITE_ROBOFLOW_PROXY_URL=https://roboflow-proxy.YOUR_SUBDOMAIN.workers.dev
```

**Option B: Set when building (for GitHub Pages deployment):**
```bash
VITE_ROBOFLOW_PROXY_URL=https://roboflow-proxy.YOUR_SUBDOMAIN.workers.dev npm run build
```

**Option C: Set in GitHub Actions (if using CI/CD):**
Add as a repository secret in GitHub Settings → Secrets, then reference in your workflow.

### 7. Rebuild and Deploy Your Frontend

```bash
npm run build
npm run deploy
```

## Security Notes

- ✅ API key is stored as a Cloudflare secret (server-side only)
- ✅ API key is never exposed to client-side JavaScript
- ✅ All requests go through the secure proxy
- ✅ CORS is enabled for your GitHub Pages domain

## Testing

After deployment, test the worker:
```bash
curl -X POST https://roboflow-proxy.YOUR_SUBDOMAIN.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"inputs": {"image": {"type": "base64", "value": "..."}}}'
```

## Troubleshooting

- **401 Unauthorized**: Make sure you set the secret correctly: `wrangler secret put ROBOFLOW_API_KEY`
- **CORS errors**: The worker should handle CORS automatically. Check browser console for specific errors.
- **Worker not found**: Make sure you deployed the worker and have the correct URL.

