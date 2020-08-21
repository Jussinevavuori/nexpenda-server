import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { User } from "./user.entity";
import * as yup from "yup";
import { v4 as uuid } from "uuid";
import { InvalidRequestDataError } from "../errors/InvalidRequestDataError";
import {
  PostTransactionConstructableSchema,
  PatchTransactionConstructableSchema,
  PutTransactionConstructableSchema,
  ResponseTransactionConstructableSchema,
} from "../controllers/schemas/transactionConstructable.schema";
import { connection } from "../server";

function getTransactionRepository() {
  if (connection) {
    return connection.getRepository(Transaction);
  }
}

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

  static async createFromPostConstructable(
    form: PostTransactionConstructableSchema,
    user: User
  ) {
    const transaction = new Transaction();

    if (form.uid && form.uid !== user.id) {
      throw new InvalidRequestDataError(
        "Cannot create transaction with foreign user ID"
      );
    }

    transaction.id = form.id || uuid();
    transaction.uid = user.id;
    transaction.integerAmount = form.integerAmount;
    transaction.category = form.category;
    transaction.comment = form.comment;
    transaction.date = form.date;

    const createdTransaction = await transaction.save();

    return createdTransaction;
  }

  static async createFromPutConstructable(
    id: string,
    form: PutTransactionConstructableSchema,
    user: User
  ) {
    const transaction = new Transaction();

    if (form.id && form.id !== transaction.id) {
      throw new InvalidRequestDataError(
        "Mismatching transaction IDs in URL and request body"
      );
    }

    if (form.uid && form.uid !== user.id) {
      throw new InvalidRequestDataError(
        "Cannot create transaction with foreign user ID"
      );
    }

    transaction.id = id;
    transaction.uid = user.id;
    transaction.integerAmount = form.integerAmount;
    transaction.category = form.category;
    transaction.comment = form.comment;
    transaction.date = form.date;

    const createdTransaction = await transaction.save();

    return createdTransaction;
  }

  async updateWithPutConstructable(form: PutTransactionConstructableSchema) {
    const transaction = new Transaction();

    if (form.id && form.id !== this.id) {
      throw new InvalidRequestDataError(
        "Mismatching transaction IDs in URL and request body"
      );
    }

    if (form.uid && form.uid !== this.uid) {
      throw new InvalidRequestDataError(
        "Cannot create transaction with foreign user ID"
      );
    }

    const repository = getTransactionRepository();

    if (repository) {
      await repository.update(this.id, {
        integerAmount: form.integerAmount,
        category: form.category,
        comment: form.comment ?? (null as any),
        date: form.date,
      });

      return this;
    }
  }

  async updateWithPatchConstructable(
    form: PatchTransactionConstructableSchema
  ) {
    if (form.id && form.id !== this.id) {
      throw new InvalidRequestDataError(
        "Mismatching transaction IDs in URL and request body"
      );
    }

    if (form.uid && form.uid !== this.uid) {
      throw new InvalidRequestDataError(
        "Cannot update transaction to foreign user ID"
      );
    }

    const repository = getTransactionRepository();

    if (repository) {
      await repository.update(this.id, {
        integerAmount: form.integerAmount,
        category: form.category,
        comment: form.comment as any,
        date: form.date,
      });

      return this;
    }
  }

  toResponseConstructable(): ResponseTransactionConstructableSchema {
    return {
      id: this.id,
      uid: this.uid,
      date: Number(this.date),
      comment: this.comment ?? undefined,
      category: this.category,
      integerAmount: this.integerAmount,
    };
  }
}
