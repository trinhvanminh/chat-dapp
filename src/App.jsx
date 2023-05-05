import React from "react";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { NavBar, ChatCard, Message, AddNewChat } from "./components/Components.js";
import { DoubleMintABI, contractAddress } from "./constants/contracts/index.js";
import Web3 from "web3";
import doubleMintServices from "./services/doubleMint.js";

// Add the contract address inside the quotes
const CONTRACT_ADDRESS = contractAddress;

export default function App(props) {
  const [friends, setFriends] = useState(null);
  const [myName, setMyName] = useState(null);
  const [myPublicKey, setMyPublicKey] = useState(null);
  const [activeChat, setActiveChat] = useState({
    friendname: null,
    publicKey: null,
  });
  const [activeChatMessages, setActiveChatMessages] = useState(null);
  const [showConnectButton, setShowConnectButton] = useState("block");
  const [myContract, setMyContract] = useState(null);

  // Save the contents of abi in a variable
  const contractABI = DoubleMintABI;

  // Login to Metamask and check the if the user exists else creates one
  async function login() {
    let res = await connectToMetamask();
    if (res === true) {
      const web3 = new Web3(window.ethereum);

      const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
      setMyContract(contract);
      const accounts = await web3.eth.requestAccounts();
      let result = await doubleMintServices.checkUserExists(accounts[0]);
      let username;
      if (result.data) username = (await doubleMintServices.getUsername(accounts[0])).data;
      else {
        username = prompt("Enter a username", "Guest");
        if (username === "") username = "Guest";
        await doubleMintServices.createAccount(accounts[0], username);
      }
      setMyName(username);
      setMyPublicKey(accounts[0]);
      setShowConnectButton("none");
    } else {
      alert("Couldn't connect to Metamask");
    }
  }

  // Check if the Metamask connects
  async function connectToMetamask() {
    try {
      await window.ethereum.enable();
      return true;
    } catch (err) {
      return false;
    }
  }

  // Add a friend to the users' Friends List
  async function addChat(name, publicKey) {
    try {
      let result = await doubleMintServices.checkUserExists(publicKey);
      if (!result.data) {
        alert("Address not found: Ask them to join the app :)");
        return;
      }
      try {
        await doubleMintServices.addFriend(myPublicKey, publicKey, name);
        const frnd = { name: name, publicKey: publicKey };
        setFriends(friends.concat(frnd));
      } catch (err) {
        console.log("err", err);
        alert("Friend already added! You can't be friends with the same person twice ;P");
      }
    } catch (err) {
      alert("Invalid address!");
    }
  }

  // Sends messsage to an user
  async function sendMessage(data) {
    if (!(activeChat && activeChat.publicKey)) return;
    const recieverAddress = activeChat.publicKey;
    await doubleMintServices.sendMessage(myPublicKey, recieverAddress, data);
  }

  // Fetch chat messages with a friend
  async function getMessage(friendsPublicKey) {
    let nickname;
    let messages = [];
    friends.forEach((item) => {
      if (item.publicKey === friendsPublicKey) nickname = item.name;
    });
    // Get messages
    const result = await doubleMintServices.readMessage(friendsPublicKey, myPublicKey);
    console.log("result.data", result.data);
    // [BUGS=========][TODO]
    result.data.forEach((item) => {
      const timestamp = new Date(1000 * parseInt(item[1])).toUTCString();
      if (typeof item[2] === "string")
        messages.push({
          publicKey: item[0],
          timeStamp: timestamp,
          data: item[2],
        });
    });
    setActiveChat({ friendname: nickname, publicKey: friendsPublicKey });
    setActiveChatMessages(messages);
  }

  // This executes every time page renders and when myPublicKey or myContract changes
  useEffect(() => {
    async function loadFriends() {
      let friendList = [];
      // Get Friends
      try {
        const result = await doubleMintServices.getMyFriendList(myPublicKey);
        result.data.forEach((item) => {
          friendList.push({ publicKey: item[0], name: item[1] });
        });
      } catch (err) {
        friendList = null;
      }
      setFriends(friendList);
    }
    loadFriends();
  }, [myPublicKey, doubleMintServices]);

  // Makes Cards for each Message
  const Messages = activeChatMessages
    ? activeChatMessages.map((message) => {
        let margin = "5%";
        let sender = activeChat.friendname;
        if (message.publicKey === myPublicKey) {
          margin = "15%";
          sender = "You";
        }
        return <Message marginLeft={margin} sender={sender} data={message.data} timeStamp={message.timeStamp} />;
      })
    : null;

  // Displays each card
  const chats = friends
    ? friends.map((friend) => {
        return (
          <ChatCard
            publicKey={friend.publicKey}
            name={friend.name}
            getMessages={(key) => getMessage(key)}
            key={friend.publicKey}
          />
        );
      })
    : null;

  return (
    <Container style={{ padding: "0px", border: "1px solid grey" }}>
      {/* This shows the navbar with connect button */}
      <NavBar username={myName} login={async () => login()} showButton={showConnectButton} />
      <Row>
        {/* Here the friends list is shown */}
        <Col style={{ paddingRight: "0px", borderRight: "2px solid #000000" }}>
          <div
            style={{
              backgroundColor: "#DCDCDC",
              height: "100%",
              overflowY: "auto",
            }}
          >
            <Row style={{ marginRight: "0px" }}>
              <Card
                style={{
                  width: "100%",
                  alignSelf: "center",
                  marginLeft: "15px",
                }}
              >
                <Card.Header>Chats</Card.Header>
              </Card>
            </Row>
            {chats}
            <AddNewChat myContract={myContract} addHandler={(name, publicKey) => addChat(name, publicKey)} />
          </div>
        </Col>
        <Col xs={8} style={{ paddingLeft: "0px" }}>
          <div style={{ backgroundColor: "#DCDCDC", height: "100%" }}>
            {/* Chat header with refresh button, username and public key are rendered here */}
            <Row style={{ marginRight: "0px" }}>
              <Card
                style={{
                  width: "100%",
                  alignSelf: "center",
                  margin: "0 0 5px 15px",
                }}
              >
                <Card.Header>
                  {activeChat.friendname} : {activeChat.publicKey}
                  <Button
                    style={{ float: "right" }}
                    variant="warning"
                    onClick={() => {
                      if (activeChat && activeChat.publicKey) getMessage(activeChat.publicKey);
                    }}
                  >
                    Refresh
                  </Button>
                </Card.Header>
              </Card>
            </Row>
            {/* The messages will be shown here */}
            <div className="MessageBox" style={{ height: "400px", overflowY: "auto" }}>
              {Messages}
            </div>
            {/* The form with send button and message input fields */}
            <div
              className="SendMessage"
              style={{
                borderTop: "2px solid black",
                position: "relative",
                bottom: "0px",
                padding: "10px 45px 0 45px",
                margin: "0 95px 0 0",
                width: "97%",
              }}
            >
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(document.getElementById("messageData").value);
                  document.getElementById("messageData").value = "";
                }}
              >
                <Form.Row className="align-items-center">
                  <Col xs={9}>
                    <Form.Control id="messageData" className="mb-2" placeholder="Send Message" />
                  </Col>
                  <Col>
                    <Button
                      className="mb-2"
                      style={{ float: "right" }}
                      onClick={() => {
                        sendMessage(document.getElementById("messageData").value);
                        document.getElementById("messageData").value = "";
                      }}
                    >
                      Send
                    </Button>
                  </Col>
                </Form.Row>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
