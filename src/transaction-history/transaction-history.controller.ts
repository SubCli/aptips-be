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
import { TransactionHistoryService } from './transaction-history.service';
import { TransactionHistoryDto } from './dto/transaction-history.dto';
import { CreateTransactionHistoryDto } from './dto/create-transaction-history.dto';
import { UpdateTransactionHistoryDto } from './dto/update-transaction-history.dto';
// import { UpdateTransactionHistoryDto } from './dto/update-transactionHistory.dto';

@ApiTags('transaction-historys')
@Controller('api/transaction-history')
export class TransactionHistoryController {
  constructor(
    private readonly transactionHistoryService: TransactionHistoryService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create transactionHistory' })
  @ApiResponse({
    status: 200,
    description: 'Success.',
    type: TransactionHistoryDto,
  })
  @ApiResponse({ status: 500, description: 'Error.' })
  @ApiResponse({ status: 400, description: 'Error: Bad Request.' })
  create(@Body() createTransactionHistoryDto: CreateTransactionHistoryDto) {
    try {
      return this.transactionHistoryService.create(createTransactionHistoryDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all of a transactionHistory' })
  @ApiResponse({
    status: 200,
    description: 'Success.',
    type: [TransactionHistoryDto],
  })
  @ApiResponse({ status: 500, description: 'Error.' })
  findAll() {
    try {
      return this.transactionHistoryService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get info of a transactionHistory' })
  @ApiParam({ name: 'id', type: String, description: 'TransactionHistory ID' })
  @ApiResponse({
    status: 200,
    description: 'Success.',
    type: TransactionHistoryDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Error.' })
  findOne(@Param('id') id: string) {
    try {
      return this.transactionHistoryService.findOne(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message); // Throwing NotFoundException to be caught by NestJS error handling
      }
      // Handle other types of errors here
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a transactionHistory' })
  @ApiParam({ name: 'id', type: String, description: 'TransactionHistory ID' })
  @ApiBody({ type: UpdateTransactionHistoryDto })
  @ApiResponse({
    status: 200,
    description: 'Success.',
    type: TransactionHistoryDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Error.' })
  @ApiResponse({ status: 400, description: 'Error: Bad Request.' })
  update(
    @Param('id') id: string,
    @Body() updateTransactionHistoryDto: UpdateTransactionHistoryDto,
  ) {
    try {
      return this.transactionHistoryService.update(
        +id,
        updateTransactionHistoryDto,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message); // Throwing NotFoundException to be caught by NestJS error handling
      }
      // Handle other types of errors here
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transactionHistory' })
  @ApiParam({ name: 'id', type: String, description: 'TransactionHistory ID' })
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Error.' })
  remove(@Param('id') id: string) {
    try {
      return this.transactionHistoryService.remove(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message); // Throwing NotFoundException to be caught by NestJS error handling
      }
      // Handle other types of errors here
      throw error;
    }
  }
}
