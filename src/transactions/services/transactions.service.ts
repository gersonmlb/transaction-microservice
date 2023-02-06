import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Transaction } from '../entities/transaction.entity';
import {
  ClientKafka,
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { CreateTransactionInput } from '../dto/create-transaction.input';

@Injectable()
export class TransactionsService implements OnModuleInit {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,

    @Inject('TRANSACTIONSERVICE')
    private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('transaction.validate');
  }

  async creategraphql(
    transaction: CreateTransactionInput,
  ): Promise<Transaction> {
    const newTransaction = this.transactionRepo.create(transaction);
    newTransaction.transactionStatus = 'pending';
    const response_save = await this.transactionRepo.save(newTransaction);

    const transactionId = response_save.transactionId;
    const transactionAmount = response_save.value;
    console.log('transactionValidation', transactionId, transactionAmount);

    this.client.emit('transaction.validate', {
      transactionId,
      transactionAmount,
    });
    return response_save;
  }

  async create(body: CreateTransactionInput) {
    // TO DO FALTA
    const newTransaction = this.transactionRepo.create(body);
    newTransaction.transactionStatus = 'pending';
    const response_save = await this.transactionRepo.save(newTransaction);

    const transactionId = response_save.transactionId;
    const transactionAmount = response_save.value;
    console.log('transactionValidation', transactionId, transactionAmount);

    // console.log('1111transactionValidation', response.value);

    this.client.emit('transaction.validate', {
      transactionId,
      transactionAmount,
    });

    // this.transactionValidation();
    // return response_save;
  }

  async update(id: any, body: any) {
    const transaction = await this.transactionRepo.findOne({
      where: {
        transactionId: id,
      },
    });
    this.transactionRepo.merge(transaction, body);
    return this.transactionRepo.save(transaction);
  }

  // @MessagePattern('transaction.validate.response')
  // transactionValidation(
  //   @Ctx()
  //   context: KafkaContext,
  // ) {
  //   const response = context.getMessage();
  //   console.log('transaction a secas en transactionValidation', response);
  //   // const transactionId = transaction.transactionId;
  //   // const transactionAmount = transaction.value;
  //   // console.log('transactionValidation', transactionId, transactionAmount);

  //   console.log('1111transactionValidation', response.value);

  //   // return this.client.emit('transaction.validate', {
  //   //   transactionId,
  //   //   transactionAmount,
  //   // });
  // }

  // // TO DO FALTA
  // @MessagePattern('transaction.validate')
  // transactionValidate(
  //   @Payload()
  //   transaction: any,
  //   @Ctx()
  //   context: KafkaContext,
  // ) {
  //   const originalMessage = context.getMessage();
  //   console.log(
  //     '+++++++++++++++++++++++++++transaction service+++++++++++++++++++++++++++',
  //   );
  //   console.log('transaction service', transaction);
  //   const response =
  //     `Receiving a new message from topic: medium.rocks: ` +
  //     JSON.stringify(originalMessage.value);
  //   console.log(response);
  //   return response;
  // }
}
