import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private UsersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(authCredentialDto: AuthCredentialDto) {
    const { username, password } = authCredentialDto;

    //hash
    const salt = await bcrypt.genSalt();
    const hashedPasword = await bcrypt.hash(password, salt);

    const user = this.UsersRepository.create({
      username,
      password: hashedPasword,
    });
    try {
      await this.UsersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('Username Already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
    return user;
  }

  async signIn(authCredentialDto: AuthCredentialDto) {
    const { username, password } = authCredentialDto;
    const user = await this.UsersRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    } else throw new UnauthorizedException('Incorrect credentials');
  }
}
