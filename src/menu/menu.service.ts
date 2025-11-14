import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Menu, MenuDocument } from './schemas/menu.schema';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(@InjectModel(Menu.name) private menuModel: Model<MenuDocument>) {}

 
  async createOrUpdate(createMenuDto: CreateMenuDto): Promise<Menu> {
    if (createMenuDto.stock !== undefined && createMenuDto.stock < 0)
      throw new BadRequestException('Stock must be positive');

    const existing = await this.menuModel.findOne({ name: createMenuDto.name }).exec();
    if (existing) {
      Object.assign(existing, createMenuDto);
      return existing.save();
    }

    const menu = new this.menuModel(createMenuDto);
    return menu.save();
  }


  async findAll(lowStock?: number): Promise<Menu[]> {
    if (lowStock !== undefined) {
      return this.menuModel.find({ stock: { $lte: lowStock } }).exec();
    }
    return this.menuModel.find().exec();
  }

  async findOne(id: string): Promise<Menu> {
    const menu = await this.menuModel.findById(id).exec();
    if (!menu) throw new NotFoundException('Menu item not found');
    return menu;
  }

  async update(id: string, updateMenuDto: UpdateMenuDto) {

  if (updateMenuDto.stock !== undefined && updateMenuDto.stock < 0) {
    throw new BadRequestException('Stock must be positive');
  }

  const updatedItem = await this.menuModel
    .findByIdAndUpdate(id, updateMenuDto, { new: true })
    .exec();

  if (!updatedItem) {
    throw new NotFoundException('Menu item not found');
  }

  return updatedItem;
}



 async remove(id: string) {
  const deletedItem = await this.menuModel.findByIdAndDelete(id).exec();
  if (!deletedItem) {
    throw new NotFoundException('Menu item not found');
  }
  return { message: 'Menu item deleted successfully' };
}



async getAvailableMenu(): Promise<Menu[]> {
  return this.menuModel.find({ isAvailable: true }).exec();
}

}

