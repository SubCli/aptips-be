import { Link } from 'src/link/entities/link.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { name: 'wallet_address' })
  walletAddress: string;

  @Column('text', { name: 'email' })
  email: string;

  @Column('text', { name: 'avatar_url' })
  avatarUrl: string;

  @Column('text', { name: 'full_name' })
  fullName: string;

  @Column('text', { name: 'detail' })
  about: string;

  @OneToMany(() => Link, (link) => link.user)
  links: Link[];
}
