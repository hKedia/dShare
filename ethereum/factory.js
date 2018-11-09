import web3 from "./web3";
import FileFactory from "./build/FileFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(FileFactory.interface),
  "0x67E103943a35Dc478594381ffc667CCCe6d162E2"
);

export default instance;
