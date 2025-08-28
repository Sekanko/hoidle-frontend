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
    this.cache = new Map();
    this.cacheDate = this.#getWarsawDate();
  }

  async get(endpoint) {
    return await this.#fetchData(endpoint);
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
    const cacheKey = endpoint + JSON.stringify(options);

    if (this.#isCasheSatle) {
      this.cache.clear();
      this.cacheDate = this.#getWarsawDate;
    }

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

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

    this.cache.set(cacheKey, data);

    return data;
  }

  #isCasheSatle() {
    return this.cacheDate === this.#getWarsawDate();
  }

  #getWarsawDate() {
    return new Date().toLocaleDateString("pl-PL", {
      timeZone: "Europe/Warsaw",
    });
  }
}

export default ApiClient;
