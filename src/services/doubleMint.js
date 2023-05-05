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
      const res = await DoubleMinContract.methods.checkUserExists(pubkey).call();
      return { error: null, data: res };
    } catch (err) {
      return { error: err, data: null };
    }
  },

  async getMyFriendList(account) {
    try {
      const res = await DoubleMinContract.methods.getMyFriendList().call({ from: account });
      return { error: null, data: res };
    } catch (err) {
      return { error: err, data: null };
    }
  },

  async getUsername(address) {
    try {
      const res = await DoubleMinContract.methods.getUsername(address).call();
      return { error: null, data: res };
    } catch (err) {
      return { error: err, data: null };
    }
  },

  async readMessage(friend_key, account) {
    try {
      const res = await DoubleMinContract.methods.readMessage(friend_key).call({ from: account });
      return { error: null, data: res };
    } catch (err) {
      return { error: err, data: null };
    }
  },
  //  write contract
  async addFriend(account, friend_key, name) {
    try {
      const res = await DoubleMinContract.methods.addFriend(friend_key, name).send({ from: account });
      return { error: null, data: res };
    } catch (err) {
      return { error: err, data: null };
    }
  },

  async createAccount(account, name) {
    try {
      const res = await DoubleMinContract.methods.createAccount(name).send({ from: account });
      return { error: null, data: res };
    } catch (err) {
      return { error: err, data: null };
    }
  },

  async sendMessage(account, friend_key, _msg) {
    try {
      const res = await DoubleMinContract.methods.sendMessage(friend_key, _msg).send({ from: account });
      return { error: null, data: res };
    } catch (err) {
      return { error: err, data: null };
    }
  },
};

export default doubleMintServices;
