import {
	Cluster,
	Connection,
	clusterApiUrl,
	Keypair,
	LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import {initializeKeypair} from './keypair-helpers'
import {createNonTransferableMint} from './create-mint'
import {
	TOKEN_2022_PROGRAM_ID,
	createAccount,
	mintTo,
	transferChecked,
} from '@solana/spl-token'

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

	/**
	 * Creating a non-transferable token mint
	 */
	const decimals = 9

	await createNonTransferableMint(
		CLUSTER,
		connection,
		payer,
		mintKeypair,
		decimals
	)

	/**
	 * Creating a source account for a transfer and minting 1 token to that account
	 */
	console.log('Creating a source account...')
	const sourceKeypair = Keypair.generate()
	const sourceAccount = await createAccount(
		connection,
		payer,
		mint,
		sourceKeypair.publicKey,
		undefined,
		{commitment: 'finalized'},
		TOKEN_2022_PROGRAM_ID
	)

	console.log('Minting 1 token...\n\n')
	const amount = 1 * LAMPORTS_PER_SOL
	await mintTo(
		connection,
		payer,
		mint,
		sourceAccount,
		payer,
		amount,
		[payer],
		{commitment: 'finalized'},
		TOKEN_2022_PROGRAM_ID
	)

	/**
	 * Creating a destination account for a transfer
	 */
	console.log('Creating a destination account...\n\n')
	const destinationKeypair = Keypair.generate()
	const destinationAccount = await createAccount(
		connection,
		payer,
		mintKeypair.publicKey,
		destinationKeypair.publicKey,
		undefined,
		{commitment: 'finalized'},
		TOKEN_2022_PROGRAM_ID
	)

	/**
	 * Trying transferring 1 token from source account to destination account.
	 *
	 * Should throw `SendTransactionError`
	 */
	console.log('Trying transferring non-transferable mint...')
	try {
		const signature = await transferChecked(
			connection,
			payer,
			sourceAccount,
			mint,
			destinationAccount,
			sourceAccount,
			amount,
			decimals,
			[sourceKeypair, destinationKeypair],
			{commitment: 'finalized'},
			TOKEN_2022_PROGRAM_ID
		)
		console.log(
			`Check the transaction at: https://explorer.solana.com/tx/${signature}?cluster=${CLUSTER}`
		)
	} catch (e) {
		console.log(
			'This transfer is failing because the mint is non-transferable. Check out the program logs: ',
			(e as any).logs,
			'\n\n'
		)
	}
}

main()
