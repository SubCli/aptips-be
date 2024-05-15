import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserProviders } from 'src/user/entities/user.provider';
import { DatabaseModule } from '../database.module';
@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [...UserProviders, UserService],
})
export class UserModule {}
