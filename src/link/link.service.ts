import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { LinkDto } from 'src/link/dto/link.dto';
import { CreateLinkDto } from './dto/create-link.dto';
// import { UpdateLinkDto } from './dto/update-link.dto';
import { Link } from 'src/link/entities/link.entity';
import { UpdateLinkDto } from 'src/link/dto/update-link.dto';
import { User } from 'src/user/entities/user.entity';
import { Source } from 'src/source/entities/source.entity';
import { UserDto } from 'src/user/dto/user.dto';
import { TransactionHistory } from 'src/transaction-history/entities/transaction-history.entity';
@Injectable()
export class LinkService {
  constructor(
    @Inject('LINK_REPOSITORY')
    private linkRepository: Repository<Link>,
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    @Inject('SOURCE_REPOSITORY')
    private sourceRepository: Repository<Source>,
  ) {}

  async create(createLinkDto: CreateLinkDto): Promise<LinkDto> {
    const isUserExist = await this.userRepository.findOne({
      where: { id: createLinkDto.userId },
    });
    if (!isUserExist) {
      throw new NotFoundException(
        `User with id ${createLinkDto.userId} not found`,
      );
    }
    const link = this.linkRepository.create(createLinkDto);
    const newLink = await this.linkRepository.save(link);
    const defaultSource = this.sourceRepository.create({
      linkId: newLink.id,
      utmSource: 'default',
    });
    await this.sourceRepository.save(defaultSource);
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
    if (updateLinkDto.userId) {
      const isUserExist = await this.userRepository.findOne({
        where: { id: updateLinkDto.userId },
      });
      if (!isUserExist) {
        throw new NotFoundException(
          `User with id ${updateLinkDto.userId} not found`,
        );
      }
    }
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

  async get5MostDonated(): Promise<LinkDto[]> {
    const links = await this.linkRepository
      .createQueryBuilder('link')
      .orderBy('link.totalDonations', 'DESC')
      .limit(5)
      .getMany();
    return plainToInstance(LinkDto, links, { excludeExtraneousValues: true });
  }

  async getUserDonateToLink(linkId: number): Promise<UserDto[]> {
    const link = await this.linkRepository.findOne({
      where: { id: linkId },
    });
    if (!link) {
      throw new NotFoundException(`Link with id ${linkId} not found`);
    }
    const sources = link.sources || [];
    const transactions = [];
    for (const source of sources) {
      transactions.push(...(source.transactionHistories || []));
    }
    const userDtos = transactions.map((transaction: TransactionHistory) => {
      const userDto = new UserDto();
      userDto.walletAddress = transaction.senderWallet;
      return userDto;
    });
    return userDtos;
  }

  async getLinkByLinkCode(linkCode: string): Promise<LinkDto> {
    const link = await this.linkRepository.findOne({
      where: { linkCode },
    });
    if (!link) {
      throw new NotFoundException(`Link with link code ${linkCode} not found`);
    }
    return plainToInstance(LinkDto, link, { excludeExtraneousValues: true });
  }

  async getLinkByUserId(userId: number): Promise<LinkDto[]> {
    const links = await this.linkRepository.find({
      where: { userId },
    });
    return plainToInstance(LinkDto, links, { excludeExtraneousValues: true });
  }
}
