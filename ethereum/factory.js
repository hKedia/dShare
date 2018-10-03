import web3 from "./web3";
import FileFactory from "./build/FileFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(FileFactory.interface),
  "0xA68A3a482E9D73106675bc01f1E6d96c4623b181"
);

export default instance;
