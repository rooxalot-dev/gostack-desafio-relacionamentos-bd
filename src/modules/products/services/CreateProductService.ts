import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';
import { thisExpression } from '@babel/types';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository') private productsRepository: IProductsRepository
  ) {}

  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const existingProduct = await this.productsRepository.findByName(name);

    if (existingProduct) {
      throw new AppError('There\'s alredy a product with the same name. Choose a new one!');
    }

    const createdProduct = await this.productsRepository.create({
      name, price, quantity
    });

    return createdProduct;
  }
}

export default CreateProductService;
