import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { TransactionHistoryDto } from './dto/transaction-history.dto';
import { CreateTransactionHistoryDto } from './dto/create-transaction-history.dto';
// import { UpdateTransactionHistoryDto } from './dto/update-transactionHistory.dto';
import { TransactionHistory } from './entities/transaction-history.entity';
import { UpdateTransactionHistoryDto } from './dto/update-transaction-history.dto';
@Injectable()
export class TransactionHistoryService {
  constructor(
    @Inject('TRANSACTION_HISTORY_REPOSITORY')
    private transactionHistoryRepository: Repository<TransactionHistory>,
  ) {}

  async create(
    createTransactionHistoryDto: CreateTransactionHistoryDto,
  ): Promise<TransactionHistoryDto> {
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
}
