import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  // Get API key from environment variable (set in Vercel dashboard)
  const API_KEY = process.env.ROBOFLOW_API_KEY;
  const WORKSPACE = 'muffet';
  const PROJECT = 'urbandrawai';
  const API_URL = `https://serverless.roboflow.com/${WORKSPACE}/workflows/${PROJECT}`;

  if (!API_KEY) {
    return response.status(500).json({ error: 'API key not configured' });
  }

  try {
    // Get the request body from the client
    const { inputs } = request.body;

    if (!inputs) {
      return response.status(400).json({ error: 'Missing inputs in request body' });
    }

    // Forward the request to Roboflow API with the server-side API key
    const roboflowResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        api_key: API_KEY,
        inputs,
      }),
    });

    if (!roboflowResponse.ok) {
      const errorText = await roboflowResponse.text();
      return response.status(roboflowResponse.status).json({
        error: `Roboflow API error: ${errorText}`,
        status: roboflowResponse.status,
      });
    }

    const result = await roboflowResponse.json();
    
    // Return the result to the client
    return response.status(200).json(result);
  } catch (error) {
    console.error('Proxy error:', error);
    return response.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
