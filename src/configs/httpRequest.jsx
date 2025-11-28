import axios from "axios";
const httpRequest = axios.create({
  baseURL: "https://send-flow-6.onrender.com/send-flow/api",
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshSubscribers = [];
const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

httpRequest.interceptors.request.use((config) => {
  const user=JSON.parse(localStorage.getItem("user"))
  const token = user?.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }else{
    delete config.headers.Authorization;
  }
  return config;
});

httpRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(httpRequest(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const res = await axios.post("http://localhost:8080/api/auth/refresh", {
          refreshToken,
        });

        const newToken = res.data.accessToken;
        if (!newToken) {
          throw new Error("No access token received from refresh");
        }

        localStorage.setItem("accessToken", newToken);
        httpRequest.defaults.headers.Authorization = `Bearer ${newToken}`;

        onRefreshed(newToken);
        return httpRequest(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");

        sessionStorage.removeItem("google_oauth_handled");
        sessionStorage.removeItem("facebook_oauth_handled");
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default httpRequest;

// Ví dụ minh họa thời gian
// Thời gian	Sự kiện	isRefreshing	refreshSubscribers
// T0	/users gửi, nhận 401, bắt đầu làm mới	true	[]
// T0 + 0.1s	/posts gửi, nhận 401, đợi	true	[callback_posts]
// T0 + 0.2s	/comments gửi, nhận 401, đợi	true	[callback_posts, callback_comments]
// T0 + 1s	Token mới "xyz789", gọi onRefreshed	true	[callback_posts, callback_comments] → []
// T0 + 1.1s	Gửi lại /users, /posts, /comments	false	[]
