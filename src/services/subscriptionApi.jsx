import httpRequest from "@configs/httpRequest";

const subscriptionApi = {
  // get current subscription
  getSubscriptionByUserId: async (userId) => {
    try {
      const response = await httpRequest.get(`/subscription/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching subscription:", error);
      return error.response.data
    }
  },
  createPlan: async (data) => {
    try {
      const response = await httpRequest.post(`/plan`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating plan:", error);
      throw error;
    }
  },
  deletePlan: async (planId) => {
    try {
      const response = await httpRequest.delete(`/plan/${planId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting plan:", error);
      throw error;
    }
  },
  updatePlan: async (planId, data) => {
    try {
      const response = await httpRequest.put(`/plan/${planId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating plan:", error);
      throw error;
    }
  },
  getPlanById: async (id) => {
    try {
      const response = await httpRequest.get(`/plan/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching plan by ID:", error);
      throw error;
    }
  },
};

export { subscriptionApi };
