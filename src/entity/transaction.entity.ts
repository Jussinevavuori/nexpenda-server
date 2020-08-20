import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { User } from "./user.entity";
import * as yup from "yup";
import { v4 as uuid } from "uuid";

export type TransactionConstructable = {
  comment?: string | null | undefined;
  id?: string | null | undefined;
  uid: string;
  date: number;
  category: string;
  integerAmount: number;
};

@Entity("transactions")
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  uid!: string;

  @Column("integer")
  integerAmount!: number;

  @Column()
  category!: string;

  @Column({ nullable: true })
  comment?: string;

  @Column("bigint")
  date!: number;

  /**
   * Schema for transaction constructable
   */
  static constructableSchema: yup.ObjectSchema<TransactionConstructable> = yup
    .object({
      uid: yup.string().defined().required(),
      date: yup.number().defined().required(),
      category: yup.string().defined().required().min(1),
      integerAmount: yup.number().defined().required().integer(),
      comment: yup.string().optional().nullable(),
      id: yup.string().optional().nullable(),
    })
    .defined()
    .required();

  /**
   * Transaction constructable validation
   */
  static isTransactionConstructable(arg: any): arg is TransactionConstructable {
    return (
      !Array.isArray(arg) && Transaction.constructableSchema.isValidSync(arg)
    );
  }

  /**
   * Transaction constructable array validation
   */
  static isTransactionConstructableArray(
    arg: any
  ): arg is TransactionConstructable[] {
    return (
      Array.isArray(arg) && arg.every(Transaction.isTransactionConstructable)
    );
  }

  /**
   * Generating a constructable, synchronously without fetching the user
   */
  static fromConstructable(
    constructable: TransactionConstructable,
    user: User
  ) {
    const transaction = new Transaction();
    transaction.uid = user.id;
    transaction.id = constructable.id || uuid();
    transaction.integerAmount = constructable.integerAmount;
    transaction.category = constructable.category;
    transaction.comment = constructable.comment || undefined;
    transaction.date = constructable.date;
    return transaction;
  }

  /**
   * Converting to a constructable
   */
  toConstructable(): TransactionConstructable {
    return {
      id: this.id,
      uid: this.uid,
      date: Number(this.date),
      comment: this.comment,
      category: this.category,
      integerAmount: this.integerAmount,
    };
  }
}
