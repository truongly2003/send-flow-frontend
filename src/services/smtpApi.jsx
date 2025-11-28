import httpRequest from "@configs/httpRequest";

const smtpApi = {
  saveSmtp: async (data) => {
    try {
      const response = await httpRequest.post(`/smtp/save`, data);
      return response.data;
    } catch (error) {
      console.error("Error save smtp:", error);
      throw error;
    }
  },
  testSmtp: async (data) => {
    try {
      const response = await httpRequest.post(`/smtp/test`, data);
      return response.data;
    } catch (error) {
      console.error("Error test smtp:", error);
      throw error;
    }
  },
};

export { smtpApi };
