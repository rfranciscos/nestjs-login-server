import {
  Controller,
  Body,
  Post,
  HttpException,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from '@user/dto/user.create.dto';
import { RegistrationStatus } from './interfaces/registration-status.interface';
import { AuthService } from './auth.service';
import { LoginStatus } from './interfaces/login-status.interface';
import { LoginUserDto } from '../users/dto/user-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegistrationStatus> {
    const result: RegistrationStatus = await this.authService.register(
      createUserDto,
    );

    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto): Promise<LoginStatus> {
    return await this.authService.login(loginUserDto);
  }

  @Get('account-verification')
  public async emailConfirmation(@Query() query): Promise<void> {
    console.log(query.id);
  }
}
