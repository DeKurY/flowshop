import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Headers,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current cart' })
  @ApiHeader({ name: 'x-user-id', required: false, description: 'Authenticated user ID' })
  @ApiHeader({ name: 'x-session-id', required: false, description: 'Guest session ID' })
  getCart(
    @Headers('x-user-id') userId?: string,
    @Headers('x-session-id') sessionId?: string,
  ) {
    if (userId) {
      return this.cartService.getCart(userId);
    }
    return this.cartService.getGuestCart(sessionId ?? 'anonymous');
  }

  @Post()
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiHeader({ name: 'x-user-id', required: false })
  @ApiHeader({ name: 'x-session-id', required: false })
  addItem(
    @Body() dto: AddToCartDto,
    @Headers('x-user-id') userId?: string,
    @Headers('x-session-id') sessionId?: string,
  ) {
    if (userId) {
      return this.cartService.addItem(userId, dto);
    }
    return this.cartService.addGuestItem(sessionId ?? 'anonymous', dto);
  }

  @Patch(':itemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiHeader({ name: 'x-user-id', required: true })
  updateItem(
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
    @Headers('x-user-id') userId: string,
  ) {
    return this.cartService.updateItem(userId, itemId, dto);
  }

  @Delete(':itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiHeader({ name: 'x-user-id', required: true })
  removeItem(
    @Param('itemId') itemId: string,
    @Headers('x-user-id') userId: string,
  ) {
    return this.cartService.removeItem(userId, itemId);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear entire cart' })
  @ApiHeader({ name: 'x-user-id', required: false })
  @ApiHeader({ name: 'x-session-id', required: false })
  clearCart(
    @Headers('x-user-id') userId?: string,
    @Headers('x-session-id') sessionId?: string,
  ) {
    if (userId) {
      return this.cartService.clearCart(userId);
    }
    return this.cartService.clearGuestCart(sessionId ?? 'anonymous');
  }
}
