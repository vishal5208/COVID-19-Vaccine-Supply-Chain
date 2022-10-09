const { verify } = require("../utils/verify")
const { localChains } = require("../helper-hardhat-config")
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const coldChain = await deploy("ColdChain", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: 1,
    })

    if (!localChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(coldChain.address, [])
    }
}

module.exports.tags = ["coldChain"]
