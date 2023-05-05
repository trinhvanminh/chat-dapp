import Web3 from "web3";
import {
  DoubleMintABI,
  contractAddress,
  // contractRPC,
} from "../constants/contracts";

const web3 = new Web3(window.ethereum); // using when test by ethereum
// const web3 = new Web3(contractRPC); // using when test by RPC server

const DoubleMinContract = new web3.eth.Contract(DoubleMintABI, contractAddress);

const doubleMintServices = {
  //  read contract
  async checkUserExists(pubkey) {
    try {
      const res = await DoubleMinContract.methods
        .checkUserExists(pubkey)
        .call();
      return { error: null, data: res.data };
    } catch (err) {
      return { error: err.response.data, data: null };
    }
  },

  async getMyFriendList() {
    try {
      const res = await DoubleMinContract.methods.getMyFriendList().call();
      return { error: null, data: res.data };
    } catch (err) {
      return { error: err.response.data, data: null };
    }
  },

  async getUsername() {
    try {
      const res = await DoubleMinContract.methods.getUsername().call();
      return { error: null, data: res.data };
    } catch (err) {
      return { error: err.response.data, data: null };
    }
  },

  async readMessage(friend_key) {
    try {
      const res = await DoubleMinContract.methods
        .readMessage(friend_key)
        .call();
      return { error: null, data: res.data };
    } catch (err) {
      return { error: err.response.data, data: null };
    }
  },
  //  write contract
  async addFriend(account, friend_key, name, callback) {
    try {
      const res = await DoubleMinContract.methods
        .addFriend(friend_key, name)
        .send({ from: account }, callback);
      return { error: null, data: res.data };
    } catch (err) {
      return { error: err.response.data, data: null };
    }
  },

  async createAccount(account, name, callback) {
    try {
      const res = await DoubleMinContract.methods
        .createAccount(name)
        .send({ from: account }, callback);
      return { error: null, data: res.data };
    } catch (err) {
      return { error: err.response.data, data: null };
    }
  },

  async sendMessage(account, friend_key, _msg, callback) {
    try {
      const res = await DoubleMinContract.methods
        .sendMessage(friend_key, _msg)
        .send({ from: account }, callback);
      return { error: null, data: res.data };
    } catch (err) {
      return { error: err.response.data, data: null };
    }
  },
};

export default doubleMintServices;
