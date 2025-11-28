import httpRequest from "@configs/httpRequest";

const contactListApi = {
  getAllContactList: async (userId) => {
    try {
      const response = await httpRequest.get(`/contact-list/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching contact lists:", error);
      throw error;
    }
  },
  createContactList: async (data) => {
    try {
      const response = await httpRequest.post(`/contact-list`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating contact list:", error);
      throw error;
    }
  },
  deleteContactList: async (contactListId) => {
    try {
      const response = await httpRequest.delete(`/contact-list/${contactListId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting contact list:", error);
      throw error;
    }
  },
  updateContactList: async (contactListId, data) => {
    try {
      const response = await httpRequest.put(`/contact-list/${contactListId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating contact:", error);
      throw error;
    }
  },
  getContactById: async (contactListId) => {
    try {
      const response = await httpRequest.get(`/contact-list/${contactListId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching plan by ID:", error);
      throw error;
    }
  },
};

export { contactListApi };
