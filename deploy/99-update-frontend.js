const { ethers, network } = require("hardhat")
const fs = require("fs")
const FRONTEND_ADDRESS_FILE = "../nextjs-sclottery-fcc/constants/contractAddress.json"
const FRONTEND_ABI_FILE = "../nextjs-sclottery-fcc/constants/abi.json"

module.exports = async function () {
    if (process.env.UPDATE_FRONTEND) {
        console.log("Updating front-end...")
        await updateContractAddress()
        await updateAbi()
        console.log("Front-end written!")
    }
}

async function updateAbi() {
    const lottery = await ethers.getContract("Lottery")
    fs.writeFileSync(FRONTEND_ABI_FILE, lottery.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddress() {
    const lottery = await ethers.getContract("Lottery")
    const chainId = network.config.chainId.toString()
    const currentAddress = JSON.parse(fs.readFileSync(FRONTEND_ADDRESS_FILE, "utf8"))
    if (chainId in currentAddress) {
        if (!currentAddress[chainId].includes(lottery.address)) {
            currentAddress[chainId].push(lottery.address)
        }
    } else {
        currentAddress[chainId] = [lottery.address]
    }
    fs.writeFileSync(FRONTEND_ADDRESS_FILE, JSON.stringify(currentAddress))
}

module.exports.tags = ["all", "frontend"]
