const { ethers } = require("hardhat")

const networkConfig = {
    default: {
        name: "hardhat",
    },
    31337: {
        name: "localhost",
    },
    5: {
        name: "goerli",
    },
}

const localChains = ["hardhat", "localhost"]

// brand names
const VACCINE_BRANDS = {
    Pfizer: "Pfizer-BioNTech",
    Moderna: "Moderna",
    Janssen: "Johnson & Johnson's Janssen",
    Sputnik: "Sputnik V",
}

// different roles(modes)
const ModeEnums = {
    ISSUER: { val: "ISSUER", pos: 0 },
    PROVER: { val: "PROVER", pos: 1 },
    VERIFIER: { val: "VERIFIER", pos: 2 },
}

// status of ceriticate
const StatusEnums = {
    MANUFACTURED: { val: "MANUFACTURED", pos: 0 },
    DELIVERING_INTERNATIONAL: { val: "DELIVERING_INTERNATIONAL", pos: 1 },
    STORED: { val: "STORED", pos: 2 },
    DELIVERING_LOCAL: { val: "DELIVERING_LOCAL", pos: 3 },
    DELIVERED: { val: "DELIVERED", pos: 4 },
}

module.exports = {
    networkConfig,
    localChains,
    VACCINE_BRANDS,
    ModeEnums,
    StatusEnums,
}
