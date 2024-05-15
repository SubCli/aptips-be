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
import { LinkService } from './link.service';
import { LinkDto } from 'src/link/dto/link.dto';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from 'src/link/dto/update-link.dto';

@ApiTags('links')
@Controller('api/link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Post()
  @ApiOperation({ summary: 'Create link' })
  @ApiResponse({ status: 200, description: 'Success.', type: LinkDto })
  @ApiResponse({ status: 500, description: 'Error.' })
  @ApiResponse({ status: 400, description: 'Error: Bad Request.' })
  async create(@Body() createLinkDto: CreateLinkDto) {
    try {
      return this.linkService.create(createLinkDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message); // Throwing NotFoundException to be caught by NestJS error handling
      }
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all of a link' })
  @ApiResponse({ status: 200, description: 'Success.', type: [LinkDto] })
  @ApiResponse({ status: 500, description: 'Error.' })
  findAll() {
    try {
      return this.linkService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get info of a link' })
  @ApiParam({ name: 'id', type: String, description: 'Link ID' })
  @ApiResponse({ status: 200, description: 'Success.', type: LinkDto })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Error.' })
  findOne(@Param('id') id: string) {
    try {
      return this.linkService.findOne(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message); // Throwing NotFoundException to be caught by NestJS error handling
      }
      // Handle other types of errors here
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a link' })
  @ApiParam({ name: 'id', type: String, description: 'Link ID' })
  @ApiBody({ type: UpdateLinkDto })
  @ApiResponse({ status: 200, description: 'Success.', type: LinkDto })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Error.' })
  @ApiResponse({ status: 400, description: 'Error: Bad Request.' })
  async update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    try {
      return this.linkService.update(+id, updateLinkDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message); // Throwing NotFoundException to be caught by NestJS error handling
      }
      // Handle other types of errors here
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a link' })
  @ApiParam({ name: 'id', type: String, description: 'Link ID' })
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Error.' })
  remove(@Param('id') id: string) {
    try {
      return this.linkService.remove(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message); // Throwing NotFoundException to be caught by NestJS error handling
      }
      // Handle other types of errors here
      throw error;
    }
  }
}
