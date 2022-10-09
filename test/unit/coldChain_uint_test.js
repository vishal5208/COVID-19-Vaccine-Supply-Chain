const { assert, expect } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { keccak256 } = require("@ethersproject/keccak256")
const { toUtf8Bytes } = require("@ethersproject/strings")

const {
    localChains,
    VACCINE_BRANDS,
    ModeEnums,
    StatusEnums,
} = require("../../helper-hardhat-config")

describe("ColdChain Uint Test", function () {
    let coldChain, deployer, defaultEntities, defaultVaccineBatches

    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer

        await deployments.fixture(["coldChain"])

        coldChain = await ethers.getContract("ColdChain", deployer)

        // Actors of our game
        const accounts = await ethers.getSigners()
        defaultEntities = {
            internationalDistributor: { id: accounts[1], mode: ModeEnums.VERIFIER.val },
            localDistributor: { id: accounts[2], mode: ModeEnums.VERIFIER.val },
            borderAgent: { id: accounts[3], mode: ModeEnums.VERIFIER.val },

            inspector: { id: accounts[4], mode: ModeEnums.ISSUER.val },
            immunizer: { id: accounts[5], mode: ModeEnums.ISSUER.val },

            manufacturerA: { id: accounts[6], mode: ModeEnums.PROVER.val },
            manufacturerB: { id: accounts[7], mode: ModeEnums.PROVER.val },
            traveller: { id: accounts[8], mode: ModeEnums.PROVER.val },
        }

        // Batches of vaccines that we have
        defaultVaccineBatches = {
            0: { brand: VACCINE_BRANDS.Pfizer, manufacturer: defaultEntities.manufacturerA.id },
            1: { brand: VACCINE_BRANDS.Janssen, manufacturer: defaultEntities.manufacturerA.id },
            2: { brand: VACCINE_BRANDS.Moderna, manufacturer: defaultEntities.manufacturerA.id },
            3: { brand: VACCINE_BRANDS.Sputnik, manufacturer: defaultEntities.manufacturerB.id },
            4: { brand: VACCINE_BRANDS.Moderna, manufacturer: defaultEntities.manufacturerB.id },
            5: { brand: VACCINE_BRANDS.Pfizer, manufacturer: defaultEntities.manufacturerB.id },
        }
    })

    describe("addEntity", function () {
        it("Should add Entities(actors of our game) successfully and emits events", async function () {
            for (const entity in defaultEntities) {
                const { id, mode } = defaultEntities[entity]
                const tx = await coldChain.addEntity(id.address, mode)

                // check for the event emit
                await expect(tx).to.emit(coldChain, "AddEntity")

                // check that the values matches correctly
                const retrievedEntity = await coldChain.entities(id.address)
                assert.equal(id.address, retrievedEntity.id)
                assert.equal(retrievedEntity.mode.toString(), ModeEnums[mode].pos)
            }
        })
    })

    describe("addVaccineBatch", function () {
        it("Should add vaccine batches successfully", async function () {
            console.log(deployer)
            for (let i = 0; i < Object.keys(defaultVaccineBatches).length; i++) {
                const { brand, manufacturer } = defaultVaccineBatches[i]
                const tx = await coldChain.addVaccineBatch(brand, manufacturer.address)

                // check for the event emit
                await expect(tx).to.emit(coldChain, "AddVaccineBatch")

                // check that the values matches correctly
                const retrievedVaccineBatch = await coldChain.vaccineBatches(i)
                assert.equal(i, retrievedVaccineBatch.id)
                assert.equal(brand, retrievedVaccineBatch.brand)
                assert.equal(manufacturer.address, retrievedVaccineBatch.manufacturer)
                assert.equal(undefined, retrievedVaccineBatch.certificateIds)
            }
        })
    })

    describe("issueCertificate", function () {
        it("Should sign a message and store as a certificate from the issuer to the prover", async function () {
            const { inspector, manufacturerA } = defaultEntities
            const tx1 = await coldChain.addEntity(inspector.id.address, inspector.mode)
            const tx2 = await coldChain.addEntity(manufacturerA.id.address, manufacturerA.mode)

            const vaccineBatchId = 0
            const signer = inspector.id

            const message = `Inspector (${inspector.id.address}) has certified vaccine batch #${vaccineBatchId} for Manufaturer (${manufacturerA.id.address}).`

            const signature = await signer.signMessage(keccak256(toUtf8Bytes(message)))

            // address _issuer,
            // address _prover,
            // string memory _status,
            // uint256 vaccineBatchId,
            // bytes memory signature

            const tx = await coldChain.issueCertificate(
                inspector.id.address,
                manufacturerA.id.address,
                StatusEnums.MANUFACTURED.val,
                vaccineBatchId,
                signature
            )

            const retrievedCertificate = await coldChain.certificates(0)
            assert.equal(retrievedCertificate.id, 0)

            await expect(tx).to.emit(coldChain, "IssueCertificate")
        })
    })
})
