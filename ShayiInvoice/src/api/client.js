/**
 * API Client Module
 * Base HTTP client for making API requests
 */

const API_BASE_URL = '/api/v1';

/**
 * HTTP methods enum
 */
export const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Makes an HTTP request to the API
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Request options
 * @param {string} options.method - HTTP method
 * @param {Object} options.body - Request body (will be JSON stringified)
 * @param {Object} options.params - URL query parameters
 * @param {Object} options.headers - Additional headers
 * @returns {Promise<any>} Response data
 */
export async function apiRequest(endpoint, options = {}) {
  const {
    method = HttpMethod.GET,
    body = null,
    params = null,
    headers = {},
  } = options;

  // Build URL with query parameters
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value);
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Build request config
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...headers,
    },
  };

  // Add body for non-GET requests
  if (body && method !== HttpMethod.GET) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    
    // Handle no content responses
    if (response.status === 204) {
      return null;
    }

    // Try to parse JSON response
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle error responses
    if (!response.ok) {
      throw new ApiError(
        data.message || `Request failed with status ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      error.message || 'Network error occurred',
      0,
      null
    );
  }
}

/**
 * Convenience methods for common HTTP methods
 */
export const api = {
  get: (endpoint, params) => apiRequest(endpoint, { method: HttpMethod.GET, params }),
  post: (endpoint, body) => apiRequest(endpoint, { method: HttpMethod.POST, body }),
  put: (endpoint, body) => apiRequest(endpoint, { method: HttpMethod.PUT, body }),
  patch: (endpoint, body) => apiRequest(endpoint, { method: HttpMethod.PATCH, body }),
  delete: (endpoint) => apiRequest(endpoint, { method: HttpMethod.DELETE }),
};

export default api;
