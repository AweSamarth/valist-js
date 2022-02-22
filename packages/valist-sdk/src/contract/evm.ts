import { ContractAPI } from './index';
import { Contract, PopulatedTransaction } from 'ethers';
import { BigNumberish } from 'ethers';
import { JsonRpcProvider, Web3Provider, TransactionReceipt } from '@ethersproject/providers';
import { sendMetaTx } from './metatx';

import * as valist_contract from './artifacts/Valist.sol/Valist.json';
import * as license_contract from './artifacts/ERC-1155/SoftwareLicense.sol/SoftwareLicense.json';

export type EVM_Provider = Web3Provider | JsonRpcProvider;

export class EVM_Options {
	public valistAddress: string = '';
	public licenseAddress: string = '';
	public metaTx: boolean = true;
}

export class EVM implements ContractAPI {
	valist: Contract;
	license: Contract;
	provider: Web3Provider | JsonRpcProvider;
	options: EVM_Options;

	constructor(options: EVM_Options, web3Provider: Web3Provider | JsonRpcProvider) {
		const signer = web3Provider.getSigner();
		this.valist = new Contract(options.valistAddress, valist_contract.abi, signer);
		this.license = new Contract(options.licenseAddress, license_contract.abi, signer);
		this.provider = web3Provider;
		this.options = options;
	}

	async createTeam(teamName: string, metaURI: string, beneficiary: string, members: string[]): Promise<string> {
		const tx = await this.valist.populateTransaction.createTeam(teamName, metaURI, beneficiary, members);
		return await this.sendTx('createTeam', tx);
	}

	async createProject(teamName: string, projectName: string, metaURI: string, members: string[]): Promise<string> {
		const tx = await this.valist.populateTransaction.createProject(teamName, projectName, metaURI, members);
		return await this.sendTx('createProject', tx);
	}

	async createRelease(teamName: string, projectName: string, releaseName: string, metaURI: string): Promise<string> {
		const tx = await this.valist.populateTransaction.createRelease(teamName, projectName, releaseName, metaURI);
		return await this.sendTx('createRelease', tx);
	}

	async addTeamMember(teamName: string, address: string): Promise<string> {
		const tx = await this.valist.populateTransaction.addTeamMember(teamName, address);
		return await this.sendTx('addTeamMember', tx);
	}

	async removeTeamMember(teamName: string, address: string): Promise<string> {
		const tx = await this.valist.populateTransaction.removeTeamMember(teamName, address);
		return await this.sendTx('removeTeamMember', tx);
	}

	async addProjectMember(teamName: string, projectName: string, address: string): Promise<string> {
		const tx = await this.valist.populateTransaction.addProjectMember(teamName, projectName, address);
		return await this.sendTx('addProjectMember', tx);
	}

	async removeProjectMember(teamName: string, projectName: string, address: string): Promise<string> {
		const tx = await this.valist.populateTransaction.removeProjectMember(teamName, projectName, address);
		return await this.sendTx('removeProjectMember', tx);
	}

	async setTeamMetaURI(teamName: string, metaURI: string): Promise<string> {
		const tx = await this.valist.populateTransaction.setTeamMetaURI(teamName, metaURI);
		return await this.sendTx('setTeamMetaURI', tx);
	}

	async setProjectMetaURI(teamName: string, projectName: string, metaURI: string): Promise<string> {
		const tx = await this.valist.populateTransaction.setProjectMetaURI(teamName, projectName, metaURI);
		return await this.sendTx('setProjectMetaURI', tx);
	}

	async setTeamBeneficiary(teamName: string, beneficiary: string): Promise<string> {
		const teamID = await this.valist.getTeamID(teamName);
		const tx = await this.valist.populateTransaction.setTeamBeneficiary(teamID, beneficiary);
		return await this.sendTx('setTeamBeneficiary', tx);
	}

	async approveRelease(teamName: string, projectName: string, releaseName: string): Promise<string> {
		const tx = await this.valist.populateTransaction.approveRelease(teamName, projectName, releaseName);
		return await this.sendTx('approveRelease', tx);
	}

	async rejectRelease(teamName: string, projectName: string, releaseName: string): Promise<string> {
		const tx = await this.valist.populateTransaction.rejectRelease(teamName, projectName, releaseName);
		return await this.sendTx('rejectRelease', tx);
	}

	async getLatestReleaseName(teamName: string, projectName: string): Promise<string> {
		return await this.valist.getLatestRelease(teamName, projectName);
	}

	async getTeamMetaURI(teamName: string): Promise<string> {
		return await this.valist.getTeamMetaURI(teamName);
	}

	async getProjectMetaURI(teamName: string, projectName: string): Promise<string> {
		return await this.valist.getProjectMetaURI(teamName, projectName);
	}

	async getReleaseMetaURI(teamName: string, projectName: string, releaseName: string): Promise<string> {
		return await this.valist.getReleaseMetaURI(teamName, projectName, releaseName);
	}

	async getTeamNames(page: BigNumberish, size: BigNumberish): Promise<string[]> {
		return await this.valist.getTeamNames(page, size);
	}

	async getProjectNames(teamName: string, page: BigNumberish, size: BigNumberish): Promise<string[]> {
		return await this.valist.getProjectNames(teamName, page, size);
	}

	async getReleaseNames(teamName: string, projectName: string, page: BigNumberish, size: BigNumberish): Promise<string[]> {
		return await this.valist.getReleaseNames(teamName, projectName, page, size);
	}

	async getTeamMembers(teamName: string, page: BigNumberish, size: BigNumberish): Promise<string[]> {
		return await this.valist.getTeamMembers(teamName, page, size);
	}

	async getTeamBeneficiary(teamName: string): Promise<string> {
		const teamID = await this.valist.getTeamID(teamName);
		return await this.valist.getTeamBeneficiary(teamID);
	}

	async getProjectMembers(teamName: string, projectName: string, page: BigNumberish, size: BigNumberish): Promise<string[]> {
		return await this.valist.getProjectMembers(teamName, projectName, page, size);
	}

	async getReleaseApprovers(teamName: string, projectName: string, releaseName: string, page: BigNumberish, size: BigNumberish): Promise<string[]> {
		return await this.valist.getReleaseApprovers(teamName, projectName, releaseName, page, size);
	}

	async getReleaseRejectors(teamName: string, projectName: string, releaseName: string, page: BigNumberish, size: BigNumberish): Promise<string[]> {
		return await this.valist.getReleaseRejectors(teamName, projectName, releaseName, page, size);
	}

	async getTeamID(teamName: string): Promise<BigNumberish> {
		return await this.valist.getTeamID(teamName);
	}

	async getProjectID(teamID: BigNumberish, projectName: string): Promise<BigNumberish> {
		return await this.valist.getProjectID(teamID, projectName);
	}

	async getReleaseID(projectID: BigNumberish, releaseName: string): Promise<BigNumberish> {
		return await this.valist.getReleaseID(projectID, releaseName);
	}

	async createLicense(teamName: string, projectName: string, licenseName: string, metaURI: string, mintPrice: BigNumberish): Promise<string> {
		const tx = await this.license.populateTransaction.createLicense(teamName, projectName, licenseName, metaURI, mintPrice);
		return await this.sendTx('createLicense', tx);
	}

	async mintLicense(teamName: string, projectName: string, licenseName: string, recipient: string): Promise<string> {
		const tx = await this.license.populateTransaction.mintLicense(teamName, projectName, licenseName, recipient);
		return await this.sendTx('mintLicense', tx);
	}

	async getLicenseMetaURI(teamName: string, projectName: string, licenseName: string): Promise<string> {
		const teamID = await this.getTeamID(teamName);
		const projectID = await this.getProjectID(teamID, projectName);
		const licenseID = this.getLicenseID(projectID, licenseName);
		return await this.license.metaByID(licenseID);
	}

	async getProjectLicenses(teamName: string, projectName: string, page: BigNumberish, size: BigNumberish): Promise<BigNumberish[]> {
		const teamID = await this.getTeamID(teamName);
		const projectID = await this.getProjectID(teamID, projectName);
		return await this.license.getLicensesByProjectID(projectID, page, size);
	}

	async getLicenseID(projectID: BigNumberish, licenseName: string): Promise<BigNumberish> {
		return await this.license.getLicenseID(projectID, licenseName);
	}

	private async sendTx(functionName: string, tx: PopulatedTransaction): Promise<string> {
		if (this.options.metaTx) return await sendMetaTx(this.provider, functionName, tx);
	
		tx.gasLimit = await this.provider.estimateGas(tx);
		tx.gasPrice = await this.provider.getGasPrice();

		const gasLimit = tx.gasLimit.toHexString();
		const gasPrice = tx.gasPrice.toHexString();

		return await this.provider.send('eth_sendTransaction', [{...tx, gasLimit, gasPrice}]);
	}
}

export const deployedAddresses: {[chainID: number]: string} = {
	// Deterministic Ganache
	1337: '0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab',
	// Mumbai testnet
	80001: '0x9569bEb0Eba900495cF58028DB094D824d0AE850',
	// Polygon mainnet
	// 137: '',
};