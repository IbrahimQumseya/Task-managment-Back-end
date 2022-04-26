import { S3 } from 'aws-sdk';
import { EntityRepository, Repository } from 'typeorm';
import PublicFile from './entity/PublicFile.entity';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';

@EntityRepository(PublicFile)
export class FilesRepository extends Repository<PublicFile> {
  async deletePublicFile(fileId: string): Promise<{ isDeleted: string }> {
    const file = await this.findOne({ id: fileId });
    const s3 = new S3();
    await s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.key,
      })
      .promise();
    try {
      await this.delete(fileId);
      return { isDeleted: `File name of ${file.key} is Deleted` };
    } catch (error) {}
  }

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: dataBuffer,
        Key: `${filename}-${uuid()}`,
      })
      .promise();
    const newFile = this.create({
      key: uploadResult.Key,
      url: uploadResult.Location,
    });
    await this.save(newFile);
    return newFile;
  }
}
