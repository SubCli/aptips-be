import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { TransactionHistoryDto } from './dto/transaction-history.dto';
import { CreateTransactionHistoryDto } from './dto/create-transaction-history.dto';
// import { UpdateTransactionHistoryDto } from './dto/update-transactionHistory.dto';
import { TransactionHistory } from './entities/transaction-history.entity';
import { TransactionHistoryUserInfoDto } from 'src/transaction-history/dto/transaction-history-userinfo.dto';
import { UpdateTransactionHistoryDto } from './dto/update-transaction-history.dto';
import { Source } from 'src/source/entities/source.entity';
import { Link } from 'src/link/entities/link.entity';
import { User } from 'src/user/entities/user.entity';
import { UserDto } from 'src/user/dto/user.dto';
import { RevenueBySourceDto } from 'src/transaction-history/dto/revenue-by-source.dto';
import { SourceDto } from 'src/source/dto/source.dto';
import { RevenueByMonth } from 'src/transaction-history/dto/revenue-by-month.dto';
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

    @Inject('DATA_SOURCE')
    private dataSource: DataSource,
  ) {}

  async create(
    createTransactionHistoryDto: CreateTransactionHistoryDto,
  ): Promise<TransactionHistoryDto> {
    const isSourceExist = await this.sourceRepository.findOne({
      where: { id: createTransactionHistoryDto.sourceId },
    });
    if (isSourceExist) {
      throw new NotFoundException(
        `Source with id ${createTransactionHistoryDto.sourceId} not found`,
      );
    }

    const isReceiverExist = await this.userRepository.findOne({
      where: { id: createTransactionHistoryDto.receiver },
    });
    if (!isReceiverExist) {
      throw new NotFoundException(
        `User with id ${createTransactionHistoryDto.receiver} not found`,
      );
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const transactionHistory = this.transactionHistoryRepository.create(
        createTransactionHistoryDto,
      );
      const newTransactionHistory =
        await queryRunner.manager.save(transactionHistory);
      const source = isSourceExist;
      source.totalDonations += newTransactionHistory.amount;
      source.totalNumberDonations += 1;
      await queryRunner.manager.save(source);
      const link = source.link;
      link.totalDonations += newTransactionHistory.amount;
      link.totalNumberDonations += 1;
      await queryRunner.manager.save(link);
      await queryRunner.commitTransaction();
      return plainToInstance(TransactionHistoryDto, newTransactionHistory, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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
    const transactionHistoryDTO = plainToInstance(
      TransactionHistoryDto,
      transactionHistory,
      {
        excludeExtraneousValues: true,
      },
    );
    transactionHistoryDTO.sourceName = transactionHistory.source.utmSource;
    return transactionHistoryDTO;
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
    let transactionHistories: TransactionHistory[] =
      await this.transactionHistoryRepository.find({
        where: { sourceId: sourceId },
      });
    transactionHistories = transactionHistories.sort(
      (a, b) => b.timeStamp.getTime() - a.timeStamp.getTime(),
    );
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
    let transactions = await this.transactionHistoryRepository
      .createQueryBuilder('transaction')
      .where('transaction.sourceId IN (...:sourceId)', { sourceIds })
      .getMany();
    transactions = transactions.sort(
      (a, b) => b.timeStamp.getTime() - a.timeStamp.getTime(),
    );
    return plainToInstance(TransactionHistoryDto, transactions, {
      excludeExtraneousValues: true,
    });
  }

  async getDonationsToUser(
    userId: number,
  ): Promise<TransactionHistoryUserInfoDto[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const links = user.links || [];
    const transactions = links.reduce((transactionList, { sources }) => {
      sources.forEach(({ transactionHistories }) => {
        transactionList.push(...transactionHistories);
      });
      return transactionList;
    }, []);
    const transactionHistoryUserInfoDtos = transactions.map(
      (transaction: TransactionHistory) => {
        const transactionUserInfoDTO = new TransactionHistoryUserInfoDto();
        transactionUserInfoDTO.id = transaction.id;
        transactionUserInfoDTO.sourceId = transaction.sourceId;
        const senderInfo = new UserDto();
        senderInfo.walletAddress = transaction.senderWallet;
        transactionUserInfoDTO.senderInfo = senderInfo;
        transactionUserInfoDTO.receiverInfo = plainToInstance(
          UserDto,
          transaction.receiveUser,
          { excludeExtraneousValues: true },
        );
        transactionUserInfoDTO.amount = transaction.amount;
        transactionUserInfoDTO.timeStamp = transaction.timeStamp;
        transactionUserInfoDTO.name = transaction.name;
        transactionUserInfoDTO.note = transaction.note;
        return transactionUserInfoDTO;
      },
    );
    return transactionHistoryUserInfoDtos;
  }

  async getMonthRevenueOfSourceByLinkId(
    linkId: number,
  ): Promise<RevenueBySourceDto[]> {
    const link = await this.linkRepository.findOne({ where: { id: linkId } });
    if (!link) {
      throw new NotFoundException(`Link with id ${linkId} not found`);
    }
    const sources = link.sources || [];
    const revenueBySourceDtos = sources.map((source) => {
      const revenueBySourceDto = new RevenueBySourceDto();
      revenueBySourceDto.source = plainToInstance(SourceDto, source, {
        excludeExtraneousValues: true,
      });
      const transactionList = source.transactionHistories || [];

      const transactionPerMonthList = new Map<string, number>();
      for (let i = 0; i < transactionList.length; i++) {
        const month = transactionList[i].timeStamp.getMonth() + 1;
        const year = transactionList[i].timeStamp.getFullYear();
        const timeStamp = `${year}-${month}`;
        if (transactionPerMonthList.has(timeStamp)) {
          transactionPerMonthList.set(
            timeStamp,
            transactionPerMonthList.get(timeStamp) + transactionList[i].amount,
          );
        }
      }
      const revenueByMonthList = [];
      for (const [key, value] of transactionPerMonthList) {
        const revenueByMonth = new RevenueByMonth();
        const [year, month] = key.split('-');
        revenueByMonth.year = +year;
        revenueByMonth.month = +month;
        revenueByMonth.revenue = value;
        revenueByMonthList.push(revenueByMonth);
      }
      revenueBySourceDto.totalRevenueByMonthList = revenueByMonthList.sort(
        (a, b) => a.year - b.year || a.month - b.month,
      );
      return revenueBySourceDto;
    });
    return revenueBySourceDtos;
  }

  async getMostSenderUsers(userId: number, num: number): Promise<UserDto[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    if (num <= 0) {
      throw new NotFoundException('Number of users must be greater than 0');
    }
    if (num > 10) {
      num = 10;
    }
    const links = user.links || [];
    const sourceList = [];
    for (let i = 0; i < links.length; i++) {
      sourceList.push(...links[i].sources);
    }
    const transactionList = sourceList.reduce((transactionList, source) => {
      transactionList.push(...source.transactionHistories);
      return transactionList;
    }, []);
    const transactionPerUser = new Map<string, number>();
    for (let i = 0; i < transactionList.length; i++) {
      const sender = transactionList[i].senderWallet;
      if (transactionPerUser.has(sender)) {
        transactionPerUser.set(
          sender,
          transactionPerUser.get(sender) + transactionList[i].amount,
        );
      } else {
        transactionPerUser.set(sender, transactionList[i].amount);
      }
    }
    const sortedUsers = Array.from(transactionPerUser.entries()).sort(
      (a, b) => b[1] - a[1],
    );
    const users = [];
    for (let i = 0; i < Math.min(num, sortedUsers.length); i++) {
      users.push(sortedUsers[i][0]);
    }
    const userDtos =
      users.map((user) => {
        const userDto = new UserDto();
        userDto.walletAddress = user;
        return userDto;
      }) || [];
    return userDtos;
  }

  async getMonthRevenueOfAllSourceByUserId(
    userId: number,
  ): Promise<RevenueBySourceDto[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const links = user.links || [];
    const sourceList = [];
    for (let i = 0; i < links.length; i++) {
      sourceList.push(...links[i].sources);
    }
    const revenueBySourceDtos = sourceList.map((source) => {
      const revenueBySourceDto = new RevenueBySourceDto();
      revenueBySourceDto.source = plainToInstance(SourceDto, source, {
        excludeExtraneousValues: true,
      });
      const transactionList = source.transactionHistories || [];

      const transactionPerMonthList = new Map<string, number>();
      for (let i = 0; i < transactionList.length; i++) {
        const month = transactionList[i].timeStamp.getMonth() + 1;
        const year = transactionList[i].timeStamp.getFullYear();
        const timeStamp = `${year}-${month}`;
        if (transactionPerMonthList.has(timeStamp)) {
          transactionPerMonthList.set(
            timeStamp,
            transactionPerMonthList.get(timeStamp) + transactionList[i].amount,
          );
        }
      }
      const revenueByMonthList = [];
      for (const [key, value] of transactionPerMonthList) {
        const revenueByMonth = new RevenueByMonth();
        const [year, month] = key.split('-');
        revenueByMonth.year = +year;
        revenueByMonth.month = +month;
        revenueByMonth.revenue = value;
        revenueByMonthList.push(revenueByMonth);
      }
      revenueBySourceDto.totalRevenueByMonthList = revenueByMonthList.sort(
        (a, b) => a.year - b.year || a.month - b.month,
      );
      return revenueBySourceDto;
    });
    return revenueBySourceDtos;
  }
}
