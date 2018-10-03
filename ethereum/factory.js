import web3 from "./web3";
import FileFactory from "./build/FileFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(FileFactory.interface),
  "0xe8214fd895538231a4c96f5e165Df39B8b23b0e5"
);

export default instance;
