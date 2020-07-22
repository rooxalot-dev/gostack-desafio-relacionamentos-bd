import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository') private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository') private productsRepository: IProductsRepository,
    @inject('CustomersRepository') private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const existingCustomer = await this.customersRepository.findById(customer_id);

    if (!existingCustomer) {
      throw new AppError('The informed customer does not exist!');
    }

    const productsIds = products.map(p => ({ id: p.id }));
    const existingProducts = await this.productsRepository.findAllById(productsIds);

    if (existingProducts.length !== productsIds.length) {
      throw new AppError('Some of the informed products does not exist!');
    }

    const hasExcedingQuantity = existingProducts.some(existingProduct => products.find(p => p.id === existingProduct.id && p.quantity > existingProduct.quantity));
    if (hasExcedingQuantity) {
      throw new AppError('Insuficient stock for some products!');
    }

    const orderProducts = products.map(product => {
      const existingProduct = existingProducts.find(p => p.id === product.id);

      return {
        product_id: product.id,
        quantity: product.quantity,
        price: existingProduct ? existingProduct.price : 0,
        remainingQuantity: existingProduct ? existingProduct.quantity - product.quantity : 0
      };
    });

    const createdOrder = await this.ordersRepository.create({
      customer: existingCustomer,
      products: orderProducts
    });

    const updateProducts = orderProducts.map(op => ({ id: op.product_id, quantity: op.remainingQuantity }))
    await this.productsRepository.updateQuantity(updateProducts);

    return createdOrder;
  }
}

export default CreateOrderService;
