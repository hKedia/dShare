import web3 from "./web3";
import FileFactory from "./build/FileFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(FileFactory.interface),
  "0x39729184918f094A70E00A752aF14b44d4983Df9"
);

export default instance;
