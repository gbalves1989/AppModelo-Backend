import DiskStorageProvider from '../../shared/providers/Storage/DiskStorageProvider'
import S3StorageProvider from '../../shared/providers/Storage/S3StorageProvider'

export class UploadHelpers {
  private s3Provider = new S3StorageProvider()
  private diskProvider = new DiskStorageProvider()

  public async delete(avatar: string): Promise<void> {
    if (process.env.STORAGE_DRIVER === 's3') {
      await this.s3Provider.deleteFile(avatar)
    } else {
      await this.diskProvider.deleteFile(avatar)
    }
  }

  public async save(avatar: string): Promise<string> {
    if (process.env.STORAGE_DRIVER === 's3') {
      return await this.s3Provider.saveFile(avatar)
    } else {
      return await this.diskProvider.saveFile(avatar)
    }
  }
}
