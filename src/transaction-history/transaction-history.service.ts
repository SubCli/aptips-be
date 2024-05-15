import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { TransactionHistoryDto } from './dto/transaction-history.dto';
import { CreateTransactionHistoryDto } from './dto/create-transaction-history.dto';
// import { UpdateTransactionHistoryDto } from './dto/update-transactionHistory.dto';
import { TransactionHistory } from './entities/transaction-history.entity';
import { UpdateTransactionHistoryDto } from './dto/update-transaction-history.dto';
import { Source } from 'src/source/entities/source.entity';
import { Link } from 'src/link/entities/link.entity';
import { User } from 'src/user/entities/user.entity';
@Injectable()
export class TransactionHistoryService {
  constructor(
    @Inject('TRANSACTION_HISTORY_REPOSITORY')
    private transactionHistoryRepository: Repository<TransactionHistory>,

    @Inject('SOURCE_REPOSITORY')
    private sourceRepository: Repository<Source>,

    @Inject('LINK_REPOSITORY')
    private linkRepository: Repository<Link>,

    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async create(
    createTransactionHistoryDto: CreateTransactionHistoryDto,
  ): Promise<TransactionHistoryDto> {
    const isSourceExist = await this.transactionHistoryRepository.findOne({
      where: { id: createTransactionHistoryDto.sourceId },
    });
    if (isSourceExist) {
      throw new NotFoundException(
        `Source with id ${createTransactionHistoryDto.sourceId} not found`,
      );
    }
    const transactionHistory = this.transactionHistoryRepository.create(
      createTransactionHistoryDto,
    );
    const newTransactionHistory =
      await this.transactionHistoryRepository.save(transactionHistory);
    return plainToInstance(TransactionHistoryDto, newTransactionHistory, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<TransactionHistoryDto[]> {
    const transactionHistories: TransactionHistory[] =
      await this.transactionHistoryRepository.find();
    return plainToInstance(TransactionHistoryDto, transactionHistories, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number): Promise<TransactionHistoryDto> {
    const transactionHistory = await this.transactionHistoryRepository.findOne({
      where: { id },
    });
    if (!transactionHistory) {
      throw new NotFoundException(`TransactionHistory with id ${id} not found`);
    }
    return transactionHistory;
  }

  async update(
    id: number,
    updateTransactionHistoryDto: UpdateTransactionHistoryDto,
  ): Promise<TransactionHistoryDto> {
    if (updateTransactionHistoryDto.sourceId) {
      const isSourceExist = await this.transactionHistoryRepository.findOne({
        where: { id: updateTransactionHistoryDto.sourceId },
      });
      if (isSourceExist) {
        throw new NotFoundException(
          `Source with id ${updateTransactionHistoryDto.sourceId} not found`,
        );
      }
    }
    const transactionHistory = await this.transactionHistoryRepository.findOne({
      where: { id },
    });
    if (!transactionHistory) {
      throw new NotFoundException(`TransactionHistory with id ${id} not found`);
    }
    Object.keys(updateTransactionHistoryDto).forEach((key) => {
      if (
        updateTransactionHistoryDto[key] !== null &&
        updateTransactionHistoryDto[key] !== undefined
      ) {
        transactionHistory[key] = updateTransactionHistoryDto[key];
      }
    });
    // Update other properties as needed
    const updatedTransactionHistory =
      await this.transactionHistoryRepository.save(transactionHistory);
    return plainToInstance(TransactionHistoryDto, updatedTransactionHistory, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.transactionHistoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`TransactionHistory with id ${id} not found`);
    }
  }

  async getDonationsToSource(
    sourceId: number,
  ): Promise<TransactionHistoryDto[]> {
    const isSourceExist = await this.sourceRepository.findOne({
      where: { id: sourceId },
    });
    if (!isSourceExist) {
      throw new NotFoundException(`Source with id ${sourceId} not found`);
    }
    const transactionHistories: TransactionHistory[] =
      await this.transactionHistoryRepository.find({
        where: { sourceId: sourceId },
      });
    return plainToInstance(TransactionHistoryDto, transactionHistories, {
      excludeExtraneousValues: true,
    });
  }

  async getDonationsToLink(linkId: number): Promise<TransactionHistoryDto[]> {
    const isLinkExist = await this.linkRepository.findOne({
      where: { id: linkId },
    });
    if (!isLinkExist) {
      throw new NotFoundException(`Link with id ${linkId} not found`);
    }
    const sourceIds = (
      await this.sourceRepository.find({ where: { linkId } })
    ).map((source) => source.id);
    const transactions = await this.transactionHistoryRepository
      .createQueryBuilder('transaction')
      .where('transaction.sourceId IN (...:sourceId)', { sourceIds })
      .getMany();

    return plainToInstance(TransactionHistoryDto, transactions, {
      excludeExtraneousValues: true,
    });
  }

  async getDonationsToUser(userId: number): Promise<TransactionHistoryDto[]> {
    const isUserExist = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!isUserExist) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const linkIds = (await this.linkRepository.find({ where: { userId } })).map(
      (link) => link.id,
    );
    const sourceIds = (
      await this.sourceRepository
        .createQueryBuilder('source')
        .where('source.linkId IN (...:linkId)', { linkIds })
        .getMany()
    ).map((source) => source.id);

    const transactions = await this.transactionHistoryRepository
      .createQueryBuilder('transaction')
      .where('transaction.sourceId IN (...:sourceId)', { sourceIds })
      .getMany();
    return plainToInstance(TransactionHistoryDto, transactions, {
      excludeExtraneousValues: true,
    });
  }
}
