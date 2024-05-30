import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { UserDto } from 'src/user/dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { Link } from 'src/link/entities/link.entity';
@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    @Inject('LINK_REPOSITORY')
    private linkRepository: Repository<Link>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const user = this.userRepository.create(createUserDto);
    const newUser = await this.userRepository.save(user);
    return plainToInstance(UserDto, newUser, { excludeExtraneousValues: true });
  }

  async findAll(): Promise<UserDto[]> {
    const users: User[] = await this.userRepository.find();
    return plainToInstance(UserDto, users, { excludeExtraneousValues: true });
  }

  async findOne(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return plainToInstance(UserDto, user, { excludeExtraneousValues: true });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    Object.keys(updateUserDto).forEach((key) => {
      if (updateUserDto[key] !== null && updateUserDto[key] !== undefined) {
        user[key] = updateUserDto[key];
      }
    });
    // Update other properties as needed
    const updatedUser = await this.userRepository.save(user);
    return plainToInstance(UserDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async getDonationAllTime(id: number): Promise<number> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const links = await this.linkRepository.find({ where: { userId: id } });
    const totalDonation = links.reduce((accumulator, { totalDonations }) => {
      return accumulator + totalDonations;
    }, 0);

    return totalDonation;
  }

  async getNumDonationAllTime(id: number): Promise<number> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const links = await this.linkRepository.find({ where: { userId: id } });
    const totalNumberDonation = links.reduce(
      (accumulator, { totalNumberDonations }) => {
        return accumulator + totalNumberDonations;
      },
      0,
    );

    return totalNumberDonation;
  }

  async getUserInfoByWalletAddress(walletAddress: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { walletAddress },
    });
    if (!user) {
      throw new NotFoundException(
        `User with wallet address ${walletAddress} not found`,
      );
    }
    return plainToInstance(UserDto, user, { excludeExtraneousValues: true });
  }
}
