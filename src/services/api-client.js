class ApiClient {
  static instance = null;

  static getInstance() {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }
  constructor() {
    if (ApiClient.instance) {
      throw new Error("Use ApiClient.getInstance");
    }

    this.baseUrl = import.meta.env.VITE_API_URL;
  }

  async get(endpoint) {
    return this.#fetchData(endpoint);
  }

  async post(endpoint, body) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
    return await this.#fetchData(endpoint, options);
  }

  async #fetchData(endpoint, options = undefined) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, options);

    if (!response.ok)
      throw new Error(
        `Api error at ${endpoint}: ${response.status} ${response.statusText}`
      );
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return data;
  }
}

export default ApiClient;
