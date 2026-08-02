/**
 * Cloudflare Worker to proxy Roboflow API requests
 * This keeps your API key secure on the server-side
 */

export interface Env {
  ROBOFLOW_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    if (request.method === 'GET') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          service: 'UrbanDrawAI Roboflow proxy',
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Get API key from environment variable
    const API_KEY = env.ROBOFLOW_API_KEY;
    const WORKSPACE = 'muffet';
    const PROJECT = 'urbandrawai';
    const API_URL = `https://serverless.roboflow.com/${WORKSPACE}/workflows/${PROJECT}`;

    if (!API_KEY) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    try {
      // Get the request body from the client
      const contentLength = Number(request.headers.get('Content-Length') || 0);
      if (contentLength > 28 * 1024 * 1024) {
        return new Response(
          JSON.stringify({ error: 'Request body is too large' }),
          {
            status: 413,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      const body = await request.json() as {
        inputs?: Record<string, unknown>;
      };
      const { inputs } = body;

      if (!inputs) {
        return new Response(
          JSON.stringify({ error: 'Missing inputs in request body' }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
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
        return new Response(
          JSON.stringify({
            error: `Roboflow API error: ${errorText}`,
            status: roboflowResponse.status,
          }),
          {
            status: roboflowResponse.status,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      const result = await roboflowResponse.json();

      // Return the result to the client
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      console.error('Proxy error:', error);
      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  },
};
