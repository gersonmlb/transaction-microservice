import { Body, Controller, Put, Post, Param, Inject } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { ClientKafka } from '@nestjs/microservices';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private transactionService: TransactionsService,

    @Inject('TRANSACTIONSERVICE')
    private readonly client: ClientKafka,
  ) {}

  @Post()
  create(@Body() body: any) {
    return this.transactionService.create(body);
  }

  @Put(':id')
  update(
    @Param('id')
    id: number,

    @Body()
    body: any,
  ) {
    return this.transactionService.update(id, body);
  }
}
