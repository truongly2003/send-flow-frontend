import httpRequest from "@configs/httpRequest";

const notificationApi = {
  getAllNotificationByUserId: async (userId) => {
    try {
      const response = await httpRequest.get(`/notification/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching notification:", error);
      throw error;
    }
  },
  deleteById: async (notificationId) => {
    try {
      const response = await httpRequest.delete(
        `/notification/${notificationId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },
  deleteAll: async (userId) => {
    try {
      const response = await httpRequest.delete(`/notification/${userId}/all`);
      return response.data;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },
  isRead: async (notificationId) => {
    try {
      const response = await httpRequest.put(
        `/notification/${notificationId}/read`
      );
      return response.data;
    } catch (error) {
      console.error("Error read notification:", error);
      throw error;
    }
  },
  isReadAll: async (userId) => {
    try {
      const response = await httpRequest.put(
        `/notification/${userId}/read-all`
      );
      return response.data;
    } catch (error) {
      console.error("Error read notification:", error);
      throw error;
    }
  },
};

export { notificationApi };
