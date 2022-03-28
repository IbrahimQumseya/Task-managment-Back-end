import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesRepository } from './files.repository';
import { FilesService } from './files.service';

@Module({
  imports: [TypeOrmModule.forFeature([FilesRepository])],
  providers: [FilesService],
})
export class FilesModule {}
