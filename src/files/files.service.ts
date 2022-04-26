import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PublicFile from './entity/PublicFile.entity';
import { FilesRepository } from './files.repository';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FilesRepository)
    private filesRepository: FilesRepository,
  ) {}

  async uploadPublicFile(
    dataBuffer: Buffer,
    filename: string,
  ): Promise<PublicFile> {
    return this.filesRepository.uploadPublicFile(dataBuffer, filename);
  }

  async deletePublicFile(fileId: string): Promise<{ isDeleted: string }> {
    return this.filesRepository.deletePublicFile(fileId);
  }
}
