import httpRequest from "@configs/httpRequest";

const userApi = {
  // ==== admin ====
  getAllUser: async () => {
    try {
      const response = await httpRequest.get(`/user/admin`);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // ==== client ====
  // login
  login: async (data) => {
    try {
      const response = await httpRequest.post(`/auth/login`, data);
      return response.data;
    } catch (error) {
      return {
        code: error.response?.status || 5000,
        message: error.response?.data?.message || error.message,
        data: null,
      };
    }
  },
  // register
  register: async (data) => {
    try {
      const response = await httpRequest.post(`/user/register`, data);
      return response.data;
    } catch (error) {
      console.log("Register error");
      throw error;
    }
  },
  // verify otp
  verifyOtp: async (email, otp) => {
    try {
      const response = await httpRequest.post(
        `/user/verify-otp?email=${email}&otp=${otp}`,
        otp
      );
      return response.data;
    } catch (error) {
      console.log("Verify error");
      throw error;
    }
  },
  // update user
  updateUser: async (userId, data) => {
    try {
      const response = await httpRequest.put(`/user/${userId}`, data);
      return response.data;
    } catch (error) {
      console.log("Update error");
      throw error;
    }
  },
  // get user by id
  getUserById: async (userId) => {
    try {
      const response = await httpRequest.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      console.log("Fetch error");
      throw error;
    }
  },
  // change password
  changePassword: async (userId, data) => {
    try {
      const response = await httpRequest.put(
        `/password/change-password?userId=${userId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.log("Change error");
      throw error;
    }
  },
  // forget password
  forgetPassword: async (email) => {
    try {
      const response = await httpRequest.post(
        `/password/forget-password?email=${email}`
      );
      return response.data;
    } catch (error) {
      console.log("Forget error");
      throw error;
    }
  },
  // reset password
  resetPassword: async (data) => {
    try {
      const response = await httpRequest.post(`/password/reset-password`, data);
      return response.data;
    } catch (error) {
      console.log("Reset error");
      throw error;
    }
  },
};

export { userApi };
