import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserDto } from 'src/user/dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 200, description: 'Success.', type: UserDto })
  @ApiResponse({ status: 500, description: 'Error.' })
  @ApiResponse({ status: 400, description: 'Error: Bad Request.' })
  create(@Body() createUserDto: CreateUserDto) {
    try {
      return this.userService.create(createUserDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all of a user' })
  @ApiResponse({ status: 200, description: 'Success.', type: [UserDto] })
  @ApiResponse({ status: 500, description: 'Error.' })
  findAll() {
    try {
      return this.userService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get info of a user' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Success.', type: UserDto })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Error.' })
  findOne(@Param('id') id: string) {
    try {
      return this.userService.findOne(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message); // Throwing NotFoundException to be caught by NestJS error handling
      }
      // Handle other types of errors here
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a user' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Success.', type: UserDto })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Error.' })
  @ApiResponse({ status: 400, description: 'Error: Bad Request.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return this.userService.update(+id, updateUserDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message); // Throwing NotFoundException to be caught by NestJS error handling
      }
      // Handle other types of errors here
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Error.' })
  remove(@Param('id') id: string) {
    try {
      return this.userService.remove(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message); // Throwing NotFoundException to be caught by NestJS error handling
      }
      // Handle other types of errors here
      throw error;
    }
  }

  @Get('donate-all-time/value/:id')
  @ApiOperation({ summary: 'Get all-time donation amount of a user' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Success.', type: Number })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Error.' })
  getDonationAllTime(@Param('id') id: number) {
    try {
      return this.userService.getDonationAllTime(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message); // Throwing NotFoundException to be caught by NestJS error handling
      }
      // Handle other types of errors here
      throw error;
    }
  }
  @Get('donate-all-time/num/:id')
  @ApiOperation({ summary: 'Get all-time number of donation of a user' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Success.', type: Number })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Error.' })
  getNumberDonationAllTime(@Param('id') id: number) {
    try {
      return this.userService.getNumDonationAllTime(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message); // Throwing NotFoundException to be caught by NestJS error handling
      }
      // Handle other types of errors here
      throw error;
    }
  }

  @Get('wallet/:walletAddress')
  @ApiOperation({ summary: 'Get user info by wallet address' })
  @ApiParam({
    name: 'walletAddress',
    type: String,
    description: 'User Wallet Address',
  })
  @ApiResponse({ status: 200, description: 'Success.', type: UserDto })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Error.' })
  getUserInfoByWalletAddress(@Param('walletAddress') walletAddress: string) {
    try {
      return this.userService.getUserInfoByWalletAddress(walletAddress);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message); // Throwing NotFoundException to be caught by NestJS error handling
      }
      // Handle other types of errors here
      throw error;
    }
  }
}
