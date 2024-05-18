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
import { SourceService } from './source.service';
import { SourceDto } from 'src/source/dto/source.dto';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from 'src/source/dto/update-source.dto';
// import { UpdateSourceDto } from './dto/update-source.dto';

@ApiTags('sources')
@Controller('api/source')
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Post()
  @ApiOperation({ summary: 'Create source' })
  @ApiResponse({ status: 200, description: 'Success.', type: SourceDto })
  @ApiResponse({ status: 500, description: 'Error.' })
  @ApiResponse({ status: 400, description: 'Error: Bad Request.' })
  create(@Body() createSourceDto: CreateSourceDto) {
    try {
      return this.sourceService.create(createSourceDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message); // Throwing NotFoundException to be caught by NestJS error handling
      }
      // Handle other types of errors here
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all of a source' })
  @ApiResponse({ status: 200, description: 'Success.', type: [SourceDto] })
  @ApiResponse({ status: 500, description: 'Error.' })
  findAll() {
    try {
      return this.sourceService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get info of a source' })
  @ApiParam({ name: 'id', type: Number, description: 'Source ID' })
  @ApiResponse({ status: 200, description: 'Success.', type: SourceDto })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Error.' })
  findOne(@Param('id') id: number) {
    try {
      return this.sourceService.findOne(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message); // Throwing NotFoundException to be caught by NestJS error handling
      }
      // Handle other types of errors here
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a source' })
  @ApiParam({ name: 'id', type: Number, description: 'Source ID' })
  @ApiBody({ type: UpdateSourceDto })
  @ApiResponse({ status: 200, description: 'Success.', type: SourceDto })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Error.' })
  @ApiResponse({ status: 400, description: 'Error: Bad Request.' })
  update(@Param('id') id: number, @Body() updateSourceDto: UpdateSourceDto) {
    try {
      return this.sourceService.update(+id, updateSourceDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message); // Throwing NotFoundException to be caught by NestJS error handling
      }
      // Handle other types of errors here
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a source' })
  @ApiParam({ name: 'id', type: Number, description: 'Source ID' })
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Error.' })
  remove(@Param('id') id: number) {
    try {
      return this.sourceService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message); // Throwing NotFoundException to be caught by NestJS error handling
      }
      // Handle other types of errors here
      throw error;
    }
  }

  @Get('sources-of-link/:id')
  @ApiOperation({ summary: 'Get sources of link' })
  @ApiParam({ name: 'id', type: Number, description: 'Link ID' })
  @ApiResponse({ status: 200, description: 'Success.', type: [SourceDto] })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Error.' })
  getSourcesByLink(@Param('id') id: number) {
    try {
      return this.sourceService.getSourcesByLink(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message); // Throwing NotFoundException to be caught by NestJS error handling
      }
      // Handle other types of errors here
      throw error;
    }
  }
}
