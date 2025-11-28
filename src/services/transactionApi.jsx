import httpRequest from "@configs/httpRequest";
const transactionApi = {
  getAllTransaction: async (page = 0, size = 3) => {
    try {
      const response = await httpRequest.get(
        `/transaction?page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  createUrlPayment: async (data) => {
    try {
      const response = await httpRequest.post(
        `/payment/vnpay/create-url`,
        data
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  returnUrl: async (params) => {
    try {
      const response = await httpRequest.get(`/payment/vnpay/return`,{params});
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  
  getStatus: async (id) => {
    try {
      const response = await httpRequest.get(`/payment/transaction/${id}/status`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
};
export { transactionApi };
