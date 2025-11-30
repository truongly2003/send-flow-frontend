import httpRequest from "@configs/httpRequest";

const campaignApi = {
  getAllCampaign: async (userId) => {
    try {
      const response = await httpRequest.get(`/campaign/${userId}`, {
     
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      throw error;
    }
  },
  createCampaign: async (data) => {
    try {
      const response = await httpRequest.post(`/campaign`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating campaign:", error);
      return error.response.data;
    }
  },
  deleteCampaign: async (campaignId) => {
    try {
      const response = await httpRequest.delete(`/campaign/${campaignId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting campaign:", error);
      throw error;
    }
  },
  updateCampaign: async (campaignId, data) => {
    try {
      const response = await httpRequest.put(`/campaign/${campaignId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating campaign:", error);
      throw error;
    }
  },

  // send campain mail
  sendCampaignMail: async (campaignId)=>{
    try {
      const response=await httpRequest.post(`/campaign/${campaignId}/send`)
      return response.data
    } catch (error) {
      console.error("Error send campaing mail:",error)
      return error.response.data;
    }
  }

};

export { campaignApi };
