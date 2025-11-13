import { Controller, Get, Post, Body, Param, Query, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenuResponseDto } from './dto/menu-response.dto';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({ summary: 'Create or update a menu item' })
  @ApiResponse({ status: 201, description: 'Menu item created/updated', type: MenuResponseDto })
  createOrUpdate(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.createOrUpdate(createMenuDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all menu items' })
  @ApiQuery({ name: 'lowStock', required: false, description: 'Filter items with stock less than or equal to this value' })
  @ApiResponse({ status: 200, description: 'List of menu items', type: [MenuResponseDto] })
  findAll(@Query('lowStock') lowStock?: string) {
    const stockNumber = lowStock ? parseInt(lowStock) : undefined;
    return this.menuService.findAll(stockNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a menu item by ID' })
  @ApiResponse({ status: 200, description: 'Menu item details', type: MenuResponseDto })
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a menu item by ID' })
  @ApiResponse({ status: 200, description: 'Updated menu item', type: MenuResponseDto })
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a menu item by ID' })
  @ApiResponse({ status: 200, description: 'Menu item deleted' })
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }
}




