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
    if (!isSourceExist) {
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
    if (createTransactionHistoryDto.note === undefined) {
      createTransactionHistoryDto.note = '';
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
      const link = await this.linkRepository.findOne({
        where: { id: source.linkId },
      });
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

    const TransactionHistoryDtos = [];
    for (let i = 0; i < transactionHistories.length; i++) {
      const transactionHistory = transactionHistories[i];
      const transactionHistoryDto = new TransactionHistoryDto();
      transactionHistoryDto.id = transactionHistory.id;
      transactionHistoryDto.sourceId = transactionHistory.sourceId;
      transactionHistoryDto.senderWallet = transactionHistory.senderWallet;
      transactionHistoryDto.receiver = transactionHistory.receiver;
      transactionHistoryDto.amount = transactionHistory.amount;
      transactionHistoryDto.timeStamp = transactionHistory.timeStamp;
      transactionHistoryDto.note = transactionHistory.note;
      transactionHistoryDto.name = transactionHistory.name;
      transactionHistoryDto.sourceName = isSourceExist.utmSource;
      TransactionHistoryDtos.push(transactionHistoryDto);
    }

    return TransactionHistoryDtos;
  }

  async getDonationsToLink(linkId: number): Promise<TransactionHistoryDto[]> {
    const link = await this.linkRepository.findOne({
      where: { id: linkId },
    });
    if (!link) {
      throw new NotFoundException(`Link with id ${linkId} not found`);
    }
    const sourceIds = (
      await this.sourceRepository.find({ where: { linkId } })
    ).map((source) => source.id);
    let transactions = [];
    for (let i = 0; i < sourceIds.length; i++) {
      const transactionsTmp: TransactionHistory[] =
        await this.transactionHistoryRepository.find({
          where: { sourceId: sourceIds[i] },
        });
      transactions.push(...transactionsTmp);
    }
    transactions = transactions.sort(
      (a, b) => b.timeStamp.getTime() - a.timeStamp.getTime(),
    );
    for (let i = 0; i < transactions.length; i++) {
      transactions[i].sourceName = link.name;
    }
    const a: TransactionHistoryDto[] = plainToInstance(
      TransactionHistoryDto,
      transactions,
      {
        excludeExtraneousValues: true,
      },
    );
    for (let i = 0; i < a.length; i++) {
      const source = await this.sourceRepository.findOne({
        where: { id: a[i].sourceId },
      });
      a[i].sourceName = source.utmSource;
    }
    return a;
  }

  async getDonationsToUser(
    userId: number,
  ): Promise<TransactionHistoryUserInfoDto[]> {
    console.log(userId);
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    console.log(user);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const links = await this.linkRepository.find({
      where: { userId: user.id },
    });
    const transactions = [];
    for (let i = 0; i < links.length; i++) {
      const sourceIds = (
        await this.sourceRepository.find({ where: { linkId: links[i].id } })
      ).map((source) => source.id);
      for (let j = 0; j < sourceIds.length; j++) {
        const transactionsTmp = await this.transactionHistoryRepository.find({
          where: { sourceId: sourceIds[j] },
        });
        transactions.push(...transactionsTmp);
      }
    }
    const transactionHistoryUserInfoDtos = [];
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
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
      const source = await this.sourceRepository.findOne({
        where: { id: transaction.sourceId },
      });
      transactionUserInfoDTO.sourceName = source.utmSource;
      transactionHistoryUserInfoDtos.push(transactionUserInfoDTO);
    }
    return transactionHistoryUserInfoDtos;
  }

  async getMonthRevenueOfSourceByLinkId(
    linkId: number,
  ): Promise<RevenueBySourceDto[]> {
    const link = await this.linkRepository.findOne({ where: { id: linkId } });
    if (!link) {
      throw new NotFoundException(`Link with id ${linkId} not found`);
    }
    const revenueBySourceDtos = [];
    const sources = await this.sourceRepository.find({ where: { linkId } });
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      const revenueBySourceDto = new RevenueBySourceDto();
      revenueBySourceDto.source = plainToInstance(SourceDto, source, {
        excludeExtraneousValues: true,
      });
      const transactionList = await this.transactionHistoryRepository.find({
        where: { sourceId: source.id },
      });
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
        } else {
          transactionPerMonthList.set(timeStamp, transactionList[i].amount);
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
      revenueBySourceDtos.push(revenueBySourceDto);
    }
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
    const links = await this.linkRepository.find({ where: { userId } });
    const sourceList = [];
    for (let i = 0; i < links.length; i++) {
      const sources = await this.sourceRepository.find({
        where: { linkId: links[i].id },
      });
      sourceList.push(...sources);
    }
    const transactionList = [];
    for (let i = 0; i < sourceList.length; i++) {
      const transactions = await this.transactionHistoryRepository.find({
        where: { sourceId: sourceList[i].id },
      });
      transactionList.push(...transactions);
    }
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
    const donations = [];
    for (let i = 0; i < Math.min(num, sortedUsers.length); i++) {
      users.push(sortedUsers[i][0]);
      donations.push(sortedUsers[i][1]);
    }
    const userDtos = [];
    for (let i = 0; i < users.length; i++) {
      const userDto = new UserDto();
      userDto.walletAddress = users[i];
      userDto.totalDonations = donations[i];
      userDtos.push(userDto);
    }
    return userDtos;
  }

  async getMonthRevenueOfAllSourceByUserId(
    userId: number,
  ): Promise<RevenueBySourceDto[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const links = await this.linkRepository.find({
      where: { userId: user.id },
    });
    const sourceList = [];
    for (let i = 0; i < links.length; i++) {
      const sources = await this.sourceRepository.find({
        where: { linkId: links[i].id },
      });
      sourceList.push(...sources);
    }
    const revenueBySourceDtos = [];
    for (let i = 0; i < sourceList.length; i++) {
      const source = sourceList[i];
      const revenueBySourceDto = new RevenueBySourceDto();
      revenueBySourceDto.source = plainToInstance(SourceDto, source, {
        excludeExtraneousValues: true,
      });
      const transactionList = await this.transactionHistoryRepository.find({
        where: { sourceId: source.id },
      });
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
        } else {
          transactionPerMonthList.set(timeStamp, transactionList[i].amount);
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
      revenueBySourceDtos.push(revenueBySourceDto);
    }
    return revenueBySourceDtos;
  }
}
