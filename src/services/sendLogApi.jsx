import httpRequest from "@configs/httpRequest";

const sendLogApi = {
  getAllCampaign: async (compaignId, page = 0, size = 10) => {
    try {
      const response = await httpRequest.get(`/sendlog/${compaignId}`, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }
  },
};
export { sendLogApi };
