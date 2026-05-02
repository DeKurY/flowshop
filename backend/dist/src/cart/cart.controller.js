"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cart_service_1 = require("./cart.service");
const dto_1 = require("./dto");
let CartController = class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }
    getCart(userId, sessionId) {
        if (userId) {
            return this.cartService.getCart(userId);
        }
        return this.cartService.getGuestCart(sessionId ?? 'anonymous');
    }
    addItem(dto, userId, sessionId) {
        if (userId) {
            return this.cartService.addItem(userId, dto);
        }
        return this.cartService.addGuestItem(sessionId ?? 'anonymous', dto);
    }
    updateItem(itemId, dto, userId) {
        return this.cartService.updateItem(userId, itemId, dto);
    }
    removeItem(itemId, userId) {
        return this.cartService.removeItem(userId, itemId);
    }
    clearCart(userId, sessionId) {
        if (userId) {
            return this.cartService.clearCart(userId);
        }
        return this.cartService.clearGuestCart(sessionId ?? 'anonymous');
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current cart' }),
    (0, swagger_1.ApiHeader)({ name: 'x-user-id', required: false, description: 'Authenticated user ID' }),
    (0, swagger_1.ApiHeader)({ name: 'x-session-id', required: false, description: 'Guest session ID' }),
    __param(0, (0, common_1.Headers)('x-user-id')),
    __param(1, (0, common_1.Headers)('x-session-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add item to cart' }),
    (0, swagger_1.ApiHeader)({ name: 'x-user-id', required: false }),
    (0, swagger_1.ApiHeader)({ name: 'x-session-id', required: false }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-user-id')),
    __param(2, (0, common_1.Headers)('x-session-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AddToCartDto, String, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "addItem", null);
__decorate([
    (0, common_1.Patch)(':itemId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update cart item quantity' }),
    (0, swagger_1.ApiHeader)({ name: 'x-user-id', required: true }),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('x-user-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateCartItemDto, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)(':itemId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove item from cart' }),
    (0, swagger_1.ApiHeader)({ name: 'x-user-id', required: true }),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, common_1.Headers)('x-user-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({ summary: 'Clear entire cart' }),
    (0, swagger_1.ApiHeader)({ name: 'x-user-id', required: false }),
    (0, swagger_1.ApiHeader)({ name: 'x-session-id', required: false }),
    __param(0, (0, common_1.Headers)('x-user-id')),
    __param(1, (0, common_1.Headers)('x-session-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "clearCart", null);
exports.CartController = CartController = __decorate([
    (0, swagger_1.ApiTags)('Cart'),
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map