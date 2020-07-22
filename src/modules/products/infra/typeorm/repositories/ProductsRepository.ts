import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({ name, price, quantity });
    const newProduct = await this.ormRepository.save(product);

    return newProduct;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = this.ormRepository.findOne({
      where: {
        name
      }
    });

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const ids = products.map(p => p.id);

    const foundProducts = await this.ormRepository.findByIds(ids);

    return foundProducts;
  }

  public async updateQuantity(products: IUpdateProductsQuantityDTO[]): Promise<Product[]> {
    const updatePromises = products.map(productUpdate => {
      const createUpdateProduct = this.ormRepository.create({ id: productUpdate.id, quantity: productUpdate.quantity });
      return this.ormRepository.save(createUpdateProduct);
    });

    const updatedProducts = await Promise.all(updatePromises);

    return updatedProducts;
  }
}

export default ProductsRepository;
