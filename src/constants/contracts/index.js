export const DoubleMintABI = [
  {
    inputs: [
      { internalType: "address", name: "friend_key", type: "address" },
      { internalType: "string", name: "name", type: "string" },
    ],
    name: "addFriend",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "pubkey", type: "address" }],
    name: "checkUserExists",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "name", type: "string" }],
    name: "createAccount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getMyFriendList",
    outputs: [
      {
        components: [
          { internalType: "address", name: "pubkey", type: "address" },
          { internalType: "string", name: "name", type: "string" },
        ],
        internalType: "struct DoubleMint.friend[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "pubkey", type: "address" }],
    name: "getUsername",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "friend_key", type: "address" }],
    name: "readMessage",
    outputs: [
      {
        components: [
          { internalType: "address", name: "sender", type: "address" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "string", name: "msg", type: "string" },
        ],
        internalType: "struct DoubleMint.message[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "friend_key", type: "address" },
      { internalType: "string", name: "_msg", type: "string" },
    ],
    name: "sendMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const contractAddress = "0x8D6D12Fe0462Eaf888265091585402f7D0Ed0959";

export const contractRPC = "https://data-seed-prebsc-1-s1.binance.org:8545";
