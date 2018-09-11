import web3 from "./web3";
import FileFactory from "./build/FileFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(FileFactory.interface),
  "0x94582863732De446339Bd31C892464d0F91b7A2E"
);

export default instance;
