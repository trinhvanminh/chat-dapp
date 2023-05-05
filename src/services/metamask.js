const metamaskServices = {
  async getAccount() {
    const accounts = await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .catch((err) => {
        if (err.code === 4001) {
          console.log("Please connect to MetaMask.");
        } else {
          console.error(err);
        }
      });
    const account = accounts[0];
    return account;
  },

  async getBalance() {
    const balance = await window.ethereum.request({
      method: "eth_getBalance",
      params: ["address", "latest"],
    });
    return balance;
  },
};

export default metamaskServices;
