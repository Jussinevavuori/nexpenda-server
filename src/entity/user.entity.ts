import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
} from "typeorm";
import { Profile } from "passport-google-oauth";
import * as bcrypt from "bcryptjs";
import * as yup from "yup";

type UserConstructable = {
  id: string;
  displayName?: string | undefined | null;
  email?: string | undefined | null;
  googleId?: string | undefined | null;
  photoUrl?: string | undefined | null;
};

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: true })
  displayName?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  googleId?: string;

  @Column({ nullable: true })
  photoUrl?: string;

  /**
   * Hashing the password before insertion to database
   */
  @BeforeInsert()
  async beforeInsertHashPassword() {
    const unhashedPassword = this.password;
    if (unhashedPassword) {
      const hashedPassword = await bcrypt.hash(unhashedPassword, 12);
      this.password = hashedPassword;
    }
  }

  /**
   * Validating a password
   */
  async validatePassword(password: string) {
    if (!this.password) return false;
    return bcrypt.compare(password, this.password);
  }

  /**
   * Converting a user to a user constructable for sending to the client.
   * Hides sensitive information, such as the password
   */
  toConstructable() {
    return {
      id: this.id,
      displayName: this.displayName,
      email: this.email,
      googleId: this.googleId,
      photoUrl: this.photoUrl,
    };
  }

  /**
   * Constructable schema
   */
  static constructableSchema: yup.ObjectSchema<UserConstructable> = yup
    .object({
      id: yup.string().defined().required(),
      displayName: yup.string().optional().nullable(),
      email: yup.string().optional().nullable(),
      googleId: yup.string().optional().nullable(),
      photoUrl: yup.string().optional().nullable(),
    })
    .defined();

  /**
   * Constructable validator
   */
  static isUserConstructable(arg: any): arg is UserConstructable {
    return this.constructableSchema.isValidSync(arg) && !Array.isArray(arg);
  }

  /**
   * Generating a new user from email and password
   */
  static fromEmailPassword(args: { email: string; password: string }) {
    const user = new User();

    user.email = args.email;
    user.password = args.password;
    user.displayName = args.email;

    return user;
  }

  /**
   * Generating a new user from a Google profile
   */
  static fromGoogleProfile(profile: Profile) {
    const user = new User();

    // Apply basic details
    user.displayName = profile.displayName;
    user.googleId = profile.id;

    // Apply any email if available (should only exists one)
    if (profile.emails) {
      user.email = profile.emails[0].value;
    }

    // Apply any photos if available
    if (profile.photos) {
      user.photoUrl = profile.photos[0].value;
    }

    return user;
  }
}
