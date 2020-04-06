import MulterGoogleCloudStorage, { removeFile as GCSRemoveFile } from './google-cloud-storage';

export class Multer{

	storageGCS = () => ({ storage: new MulterGoogleCloudStorage({ acl: 'publicread' }) })

	removeFile(url: string){
		return new Promise((resolve, reject) => {
			GCSRemoveFile(url.split('/')[3]);
			resolve();
		});
	}
}
	
export default new Multer();