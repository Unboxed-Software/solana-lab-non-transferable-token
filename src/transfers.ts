import {
	Cluster,
	Connection,
	PublicKey,
	Keypair,
	TransactionSignature,
	Signer,
	LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import {TOKEN_2022_PROGRAM_ID, transferChecked} from '@solana/spl-token'

export async function tryTransfer(
	cluster: Cluster,
	connection: Connection,
	payer: Keypair,
	mint: PublicKey,
	sourceAccount: PublicKey,
	destinationAccount: PublicKey,
	sourceOwner: PublicKey,
	decimals: number,
	signers?: Signer[] | undefined
): Promise<TransactionSignature> {
	console.log('Trying transferring non-transferrable mint...')
	const signature = await transferChecked(
		connection,
		payer,
		sourceAccount,
		mint,
		destinationAccount,
		sourceOwner,
		1 * LAMPORTS_PER_SOL,
		decimals,
		signers,
		{commitment: 'finalized'},
		TOKEN_2022_PROGRAM_ID
	)
	console.log(
		`Check the transaction at: https://explorer.solana.com/tx/${signature}?cluster=${cluster}`
	)

	return signature
}
