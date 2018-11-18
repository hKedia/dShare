import web3 from "./web3";
import FileFactory from "./build/FileFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(FileFactory.interface),
  process.env.FACTORY_CONTRACT_ADDRESS
);

export default instance;
