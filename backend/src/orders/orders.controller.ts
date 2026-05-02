import { Controller, Get, Post, Param, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new order',
    description:
      'Create order with delivery details, message card, and anonymous delivery option.',
  })
  @ApiHeader({ name: 'x-user-id', required: true, description: 'Authenticated user ID' })
  create(
    @Body() dto: CreateOrderDto,
    @Headers('x-user-id') userId: string,
  ) {
    return this.ordersService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List user orders' })
  @ApiHeader({ name: 'x-user-id', required: true })
  findAll(@Headers('x-user-id') userId: string) {
    return this.ordersService.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiHeader({ name: 'x-user-id', required: true })
  findOne(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
  ) {
    return this.ordersService.findOne(id, userId);
  }
}
