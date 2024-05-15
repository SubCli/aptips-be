import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { LinkDto } from 'src/link/dto/link.dto';
import { CreateLinkDto } from './dto/create-link.dto';
// import { UpdateLinkDto } from './dto/update-link.dto';
import { Link } from 'src/link/entities/link.entity';
import { UpdateLinkDto } from 'src/link/dto/update-link.dto';
@Injectable()
export class LinkService {
  constructor(
    @Inject('LINK_REPOSITORY')
    private linkRepository: Repository<Link>,
  ) {}

  async create(createLinkDto: CreateLinkDto): Promise<LinkDto> {
    const link = this.linkRepository.create(createLinkDto);
    const newLink = await this.linkRepository.save(link);
    return plainToInstance(LinkDto, newLink, { excludeExtraneousValues: true });
  }

  async findAll(): Promise<LinkDto[]> {
    const links: Link[] = await this.linkRepository.find();
    return plainToInstance(LinkDto, links, { excludeExtraneousValues: true });
  }

  async findOne(id: number): Promise<LinkDto> {
    const link = await this.linkRepository.findOne({ where: { id } });
    if (!link) {
      throw new NotFoundException(`Link with id ${id} not found`);
    }
    return link;
  }

  async update(id: number, updateLinkDto: UpdateLinkDto): Promise<LinkDto> {
    const link = await this.linkRepository.findOne({ where: { id } });
    if (!link) {
      throw new NotFoundException(`Link with id ${id} not found`);
    }
    Object.keys(updateLinkDto).forEach((key) => {
      if (updateLinkDto[key] !== null && updateLinkDto[key] !== undefined) {
        link[key] = updateLinkDto[key];
      }
    });
    // Update other properties as needed
    const updatedLink = await this.linkRepository.save(link);
    return plainToInstance(LinkDto, updatedLink, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.linkRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Link with id ${id} not found`);
    }
  }
}
