import web3 from "./web3";
import FileFactory from "./build/FileFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(FileFactory.interface),
  "0x8f1482406edf074b89baa438ff1312e649b6c358"
);

export default instance;
