type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    body?: unknown;
};
class ApiClient {
    private async fetch<T>(
        endPoint: string,
        options: FetchOptions = {},
    ): Promise<T> {
        const { method = "GET", headers = {}, body } = options;
        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers
        };
        const response = await fetch(`/api/${endPoint}`, {
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined,
        })

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed: ${response.status} ${errorText}`);
        }

        if (response.status === 204) {
            return {} as T; // Return empty object for no content responses
        }

        const data = await response.json();
        return data;
    }

   public async getVideos(){
        return this.fetch('videos');
   }

    // public async getVideoById(id: string) {
    //       return this.fetch(`videos/${id}`);
    //  }
    
     public async uploadVideo(file: File) {
          const formData = new FormData();
          formData.append("file", file);
          return this.fetch('upload', {
                method: 'POST',
                body: formData,
          });
     }
    
    //  public async deleteVideo(id: string) {
    //       return this.fetch(`videos/${id}`, { method: 'DELETE' });
    //  }

    // Similar methods can be added for other API endpoints

}

export const apiClient = new ApiClient();