import { Link } from 'src/link/entities/link.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64, name: 'wallet_address' })
  walletAddress: string;

  @Column({ length: 64, name: 'email' })
  email: string;

  @Column('text', { name: 'avatar_url' })
  avatarUrl: string;

  @OneToMany(() => Link, (link) => link.user)
  links: Link[];
}
