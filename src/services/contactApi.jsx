import httpRequest from "@configs/httpRequest";

const contactApi = {
  getAllContact: async (listContactId, page = 0, size = 10) => {
    try {
      const response = await httpRequest.get(`/contact/list/${listContactId}`, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }
  },
  createContact: async (data) => {
    try {
      const response = await httpRequest.post(`/contact`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating contact:", error);
      throw error;
    }
  },
  deleteContact: async (contactId) => {
    try {
      const response = await httpRequest.delete(`/contact/${contactId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting contact:", error);
      throw error;
    }
  },
  updateContact: async (contactId, data) => {
    try {
      const response = await httpRequest.put(`/contact/${contactId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating contact:", error);
      throw error;
    }
  },
  getContactById: async (contactId) => {
    try {
      const response = await httpRequest.get(`/contact/${contactId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching plan by ID:", error);
      throw error;
    }
  },
};

export { contactApi };
