import { Controller, Get, Post, Body, Param, Query, Put, Delete } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  createOrUpdate(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.createOrUpdate(createMenuDto);
  }

  @Get()
  findAll(@Query('lowStock') lowStock?: string) {
    const stockNumber = lowStock ? parseInt(lowStock) : undefined;
    return this.menuService.findAll(stockNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }
}


