import * as crypto from 'crypto';

export class CryptoService{

	encrypt(text){
		const key = crypto.pbkdf2Sync(text, 'salt', 10000, 64, 'sha512')
		return key.toString('hex');
	}    
}
