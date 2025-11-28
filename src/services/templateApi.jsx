import httpRequest from "@configs/httpRequest";

const templateApi = {
  getAllTemplate: async (userId) => {
    try {
      const response = await httpRequest.get(`/template?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching templates:", error);
      throw error;
    }
  },
  createTemplate: async (data) => {
    try {
      const response = await httpRequest.post(`/template`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating template:", error);
      throw error;
    }
  },
  deleteTemplate: async (templateId) => {
    try {
      const response = await httpRequest.delete(`/template/${templateId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting template:", error);
      throw error;
    }
  },
  updateTemplate: async (templateId, data) => {
    try {
      const response = await httpRequest.put(`/template/${templateId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating template:", error);
      throw error;
    }
  },
  gettemplateById: async (templateId) => {
    try {
      const response = await httpRequest.get(`/template/${templateId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching template by ID:", error);
      throw error;
    }
  },
};

export { templateApi };
