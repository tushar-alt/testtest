# NSE Live Data Proxy

![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)
![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square)

A lightweight Vercel-deployed proxy server and web UI for fetching live data from the **National Stock Exchange of India (NSE)** API. Bypasses browser CORS restrictions by routing requests through a serverless backend.

---

## Features

- **CORS Proxy** -- Routes requests to NSE India's API through a Vercel serverless function, avoiding browser-side CORS blocks
- **Cookie Management** -- Performs a warm-up request to `nseindia.com` to obtain session cookies before making the actual API call
- **Live Web UI** -- Clean, dark-themed frontend to input any NSE API path and view formatted JSON responses
- **Configurable Endpoints** -- Change the API path dynamically from the UI to test any NSE endpoint
- **Response Caching** -- Short-lived `Cache-Control` headers (`s-maxage=10`) reduce redundant requests and lower the chance of IP blocks
- **Zero Dependencies** -- Pure Node.js serverless function with no third-party packages

---

## Project Structure

```
testtest/
├── api/
│   └── nse.js              # Vercel serverless function (CORS proxy to NSE API)
├── index.html              # Frontend UI for querying NSE data
├── Late_Night_PYQ_Marathons.min.html.gz   # Compressed archived HTML asset
├── package.json            # Project metadata
├── .gitignore              # Git ignore rules
├── LICENSE                 # MIT License
└── README.md               # Project documentation
```

---

## Prerequisites

- **Node.js** 18 or later
- A [Vercel](https://vercel.com) account (for deployment)
- [Vercel CLI](https://vercel.com/cli) (optional, for local development)

---

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tushar-alt/testtest.git
   cd testtest
   ```

2. **Install Vercel CLI** (optional, for local dev)
   ```bash
   npm install -g vercel
   ```

3. **Link to your Vercel project** (optional)
   ```bash
   vercel link
   ```

---

## Usage

### Local Development

```bash
vercel dev
```

This starts a local development server. Open `http://localhost:3000` in your browser.

### Deployment

```bash
vercel --prod
```

Deploys the application to Vercel production.

### Using the Web UI

1. Open the deployed URL or `localhost:3000`
2. The default path is pre-filled with `NextApi/apiClient?functionName=getIndexData&type=All` (fetches all index data)
3. Click **Fetch** to retrieve and display the JSON response
4. Modify the path input to query other NSE API endpoints

### API Endpoint

The proxy function is available at:

```
GET /api/nse?path=<nse-api-path>
```

**Parameters:**

| Param  | Type   | Required | Description                                      |
|--------|--------|----------|--------------------------------------------------|
| `path` | string | Yes      | The NSE API path (without the base URL prefix)   |

**Example:**

```
GET /api/nse?path=NextApi/apiClient?functionName=getIndexData&type=All
```

**Response:** Proxied JSON from NSE India, with `Access-Control-Allow-Origin: *` header.

---

## How It Works

```
Browser  -->  /api/nse?path=...  -->  Vercel Serverless Function
                                          |
                                          |--> warm-up GET nseindia.com (grab cookies)
                                          |--> GET nseindia.com/api/<path> (with cookies)
                                          |
                                     JSON response --> Browser
```

1. The browser sends a request to `/api/nse` with the desired NSE path
2. The Vercel serverless function (`api/nse.js`) first hits `https://www.nseindia.com/` to obtain session cookies
3. It then forwards the actual API request to `https://www.nseindia.com/api/<path>` with the cookies attached
4. The response is sent back to the browser with permissive CORS headers

---

## Tech Stack

| Layer      | Technology            |
|------------|-----------------------|
| Frontend   | Vanilla HTML/CSS/JS   |
| Backend    | Vercel Serverless Functions (Node.js) |
| Deployment | Vercel                |
| API Source | NSE India (nseindia.com) |

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Author

**tushar-alt** -- 2026
