import { Field, InputType } from '@nestjs/graphql';

// No se necesita el resto de valores porque se van a generar solos

@InputType()
export class CreateTransactionInput {
  @Field()
  accountExternalIdDebit: string;

  @Field()
  accountExternalIdCredit: string;

  @Field()
  tranferTypeId: number;

  @Field()
  value: number;
}
