import MulterGoogleCloudStorage, { removeFile as GCSRemoveFile } from './google-cloud-storage';

export class Multer{

	storageGCS = (path: string) => ({ storage: new MulterGoogleCloudStorage({ acl: 'publicread' }, path )})

	removeFile(url: string){
		return new Promise((resolve, reject) => {
			GCSRemoveFile(url.split('/')[3]);
			resolve();
		});
	}
}
	
export default new Multer();