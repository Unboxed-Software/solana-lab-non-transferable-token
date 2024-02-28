import {Cluster, Connection, clusterApiUrl, Keypair} from '@solana/web3.js'
import {initializeKeypair} from './keypair-helpers'
import {createNonTransferrableMint} from './create-mint'
import {tryTransfer} from './transfers'
import {mintToken} from './mint-token'
import {createAccountForTransaction} from './create-account'

const CLUSTER: Cluster = 'devnet'

async function main() {
	/**
	 * Create a connection and initialize a keypair if one doesn't already exists.
	 * If a keypair exists, airdrop a sol if needed.
	 */
	const connection = new Connection(clusterApiUrl(CLUSTER))
	const mintOwnerUser = await initializeKeypair(connection)

	console.log(`public key: ${mintOwnerUser.publicKey.toBase58()}`)

	const mintKeypair = Keypair.generate()
	console.log('\nmint public key: ' + mintKeypair.publicKey.toBase58())

	/**
	 * Creating a non-transferrable token mint
	 */
	console.log()
	const decimals = 9

	await createNonTransferrableMint(
		CLUSTER,
		connection,
		mintOwnerUser,
		mintKeypair,
		decimals
	)

	/**
	 * Creating a source account for a transfer and minting 1 token to that account
	 */
	console.log()
	const sourceKeypair = Keypair.generate()
	const sourceAccount = await mintToken(
		connection,
		mintOwnerUser,
		mintKeypair.publicKey,
		sourceKeypair.publicKey
	)

	/**
	 * Creating a destination account for a transfer
	 */
	console.log()
	console.log('Creating a destination account...')
	const destinationKeypair = Keypair.generate()
	const destinationAccount = await createAccountForTransaction(
		connection,
		mintOwnerUser,
		mintKeypair.publicKey,
		sourceKeypair.publicKey,
		destinationKeypair
	)

	/**
	 * Trying transferring 1 token from source account to destination account.
	 *
	 * Should throw `SendTransactionError`
	 */
	console.log()
	await tryTransfer(
		CLUSTER,
		connection,
		mintOwnerUser,
		mintKeypair.publicKey,
		sourceAccount,
		destinationAccount,
		sourceKeypair.publicKey,
		decimals,
		[sourceKeypair, destinationKeypair]
	)
}

main()
