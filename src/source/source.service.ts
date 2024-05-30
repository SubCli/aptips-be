import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { SourceDto } from 'src/source/dto/source.dto';
import { CreateSourceDto } from './dto/create-source.dto';
// import { UpdateSourceDto } from './dto/update-source.dto';
import { Source } from 'src/source/entities/source.entity';
import { UpdateSourceDto } from 'src/source/dto/update-source.dto';
import { Link } from 'src/link/entities/link.entity';

@Injectable()
export class SourceService {
  constructor(
    @Inject('SOURCE_REPOSITORY')
    private sourceRepository: Repository<Source>,
    @Inject('LINK_REPOSITORY')
    private linkRepository: Repository<Link>,
  ) {}

  async create(createSourceDto: CreateSourceDto): Promise<SourceDto> {
    const isLinkExist = await this.linkRepository.findOne({
      where: { id: createSourceDto.linkId },
    });
    if (!isLinkExist) {
      throw new NotFoundException(
        `Link with id ${createSourceDto.linkId} not found`,
      );
    }
    const isSourceExist = await this.sourceRepository.findOne({
      where: {
        linkId: createSourceDto.linkId,
        utmSource: createSourceDto.utmSource,
      },
    });
    if (isSourceExist) {
      // throw new NotFoundException(
      //   `Source with linkId ${createSourceDto.linkId} and utmSource ${createSourceDto.utmSource} already exists`,
      // );
      return plainToInstance(SourceDto, isSourceExist, {
        excludeExtraneousValues: true,
      });
    }
    const source = this.sourceRepository.create(createSourceDto);
    const newSource = await this.sourceRepository.save(source);
    return plainToInstance(SourceDto, newSource, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<SourceDto[]> {
    const sources: Source[] = await this.sourceRepository.find();
    return plainToInstance(SourceDto, sources, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number): Promise<SourceDto> {
    const source = await this.sourceRepository.findOne({ where: { id } });
    if (!source) {
      throw new NotFoundException(`Source with id ${id} not found`);
    }
    return source;
  }

  async update(
    id: number,
    updateSourceDto: UpdateSourceDto,
  ): Promise<SourceDto> {
    if (updateSourceDto.linkId) {
      const isLinkExist = await this.linkRepository.findOne({
        where: { id: updateSourceDto.linkId },
      });
      if (!isLinkExist) {
        throw new NotFoundException(
          `Link with id ${updateSourceDto.linkId} not found`,
        );
      }
    }
    const source = await this.sourceRepository.findOne({ where: { id } });
    if (!source) {
      throw new NotFoundException(`Source with id ${id} not found`);
    }
    Object.keys(updateSourceDto).forEach((key) => {
      if (updateSourceDto[key] !== null && updateSourceDto[key] !== undefined) {
        source[key] = updateSourceDto[key];
      }
    });
    // Update other properties as needed
    const updatedSource = await this.sourceRepository.save(source);
    return plainToInstance(SourceDto, updatedSource, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.sourceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Source with id ${id} not found`);
    }
  }

  async getSourcesByLink(linkId: number): Promise<SourceDto[]> {
    const link = await this.linkRepository.findOne({
      where: { id: linkId },
    });
    if (!link) {
      throw new NotFoundException(`Link with id ${linkId} not found`);
    }
    const sources: Source[] = link.sources;
    return plainToInstance(SourceDto, sources, {
      excludeExtraneousValues: true,
    });
  }
}
