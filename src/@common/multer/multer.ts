import MulterGoogleCloudStorage from './google-cloud-storage';

export class Multer{

	private storage = new MulterGoogleCloudStorage({ acl: 'publicread' })

	storageGCS = () => ({ storage: this.storage } )

	removeFile(url: string){
		return new Promise((resolve, reject) => {
			this.storage._removeFile(url.split('/')[3])
			//GCSRemoveFile(url.split('/')[3]);
			resolve();
		});
	}
}
	
export default new Multer();