const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/FileFactory.json");
const compiledFile = require("../ethereum/build/File.json");

let accounts;
let factory;
let fileAddress;
let file;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  // Deploying a Contract
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "3000000" });

  await factory.methods
    .createFile(
      "0x200dc507434b4d6e73e2009e5d827848f744fc2bd495e48aa9b0501e43eefc03",
      "18",
      "32",
      "0x61B9E580EB08A94F9fFA44eF8320DB2fEc3D98e2"
    )
    .send({ from: accounts[0], gas: "2000000" });

  [fileAddress] = await factory.methods
    .getUploadedFiles()
    .call({ from: accounts[0] });

  // Accessing a already deployed contract
  file = await new web3.eth.Contract(
    JSON.parse(compiledFile.interface),
    fileAddress
  );
});

describe("Files", () => {
  it("deploys a factory and a file", () => {
    assert.ok(factory.options.address);
    assert.ok(file.options.address);
  });

  it("marks file creator as manager", async () => {
    const manager = await file.methods.manager().call();
    assert.equal(accounts[0], manager);
  });
});
