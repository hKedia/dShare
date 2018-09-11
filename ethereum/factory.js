import web3 from "./web3";
import FileFactory from "./build/FileFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(FileFactory.interface),
  "0x3dc56361eD6A4b426D418F928aF2B46c9D399b62"
);

export default instance;
