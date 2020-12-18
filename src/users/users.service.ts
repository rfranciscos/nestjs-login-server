import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { UserEntity } from '@user/entity/user.entity';
import { toUserDto } from '@shared/mapper';
import { CreateUserDto } from './dto/user.create.dto';
import { LoginUserDto } from './dto/user-login.dto';
import { comparePasswords } from '@shared/utils';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UsersService {
  private emailService: EmailService;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {
    this.emailService = new EmailService();
  }

  async findOne(options?: Record<string, unknown>): Promise<UserDto> {
    const user = await this.userRepo.findOne(options);
    return toUserDto(user);
  }

  async findByLogin({ username, password }: LoginUserDto): Promise<UserDto> {
    const user = await this.userRepo.findOne({ where: { username } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    // compare passwords
    const areEqual = await comparePasswords(user.password, password);

    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return toUserDto(user);
  }

  async findByPayload({ username }: any): Promise<UserDto> {
    return await this.findOne({ where: { username } });
  }

  async create(userDto: CreateUserDto): Promise<UserDto> {
    const { username, password, email } = userDto;

    // check if the user exists in the db
    const userInDb = await this.userRepo.findOne({ where: { username } });
    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const user: UserEntity = await this.userRepo.create({
      username,
      password,
      email,
    });

    await this.userRepo.save(user);
    this.emailService.send({
      Source: '',
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: 'Confirmação de e-mail',
          Charset: 'utf-8',
        },
        Body: {
          Text: {
            Data: `Olá, ${username}!\nObrigado pelo seu cadastro em nossa plataforma.\nSegue link para hablitar sua conta `,
            Charset: 'utf-8',
          },
        },
      },
      ConfigurationSetName: 'Empresa',
    });
    return toUserDto(user);
  }

  async accountVerification(id: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    await this.userRepo.update({ id }, { status: true });
  }

  private _sanitizeUser(user: UserEntity) {
    delete user.password;
    return user;
  }
}
