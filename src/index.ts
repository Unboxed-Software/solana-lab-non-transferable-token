import {Cluster, Connection, clusterApiUrl, Keypair} from '@solana/web3.js'
import {initializeKeypair} from '@solana-developers/helpers'
import dotenv from 'dotenv'
dotenv.config()

const CLUSTER: Cluster = 'devnet'

async function main() {
	/**
	 * Create a connection and initialize a keypair if one doesn't already exists.
	 * If a keypair exists, airdrop a sol if needed.
	 */
	const connection = new Connection(clusterApiUrl(CLUSTER))
	const payer = await initializeKeypair(connection)

	console.log(`public key: ${payer.publicKey.toBase58()}`)

	const mintKeypair = Keypair.generate()
	const mint = mintKeypair.publicKey
	console.log(
		'\nmint public key: ' + mintKeypair.publicKey.toBase58() + '\n\n'
	)

	// CREATE MINT

	// CREATE SOURCE ACCOUNT AND MINT TOKEN

	// CREATE DESTINATION ACCOUNT FOR TRANSFER

	// TRY TRANSFER
}

main()
