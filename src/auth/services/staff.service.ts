import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginStaffDto } from '../dto/login-staff.dto';

@Injectable()
export class StaffService {
  private readonly staffEmail = 'admin@example.com';
  private readonly staffPassword = '$2b$10$67API36OSSMsd9OFX0BFJeAtH.XbWBt5DioycaoODi2TEhc7hOT4m';

  constructor(private readonly jwtService: JwtService) {} 

  async login(loginDto: LoginStaffDto) {
    if (loginDto.email !== this.staffEmail)
      throw new UnauthorizedException('Invalid credentials');

    const passwordMatches = await bcrypt.compare(loginDto.password, this.staffPassword);
    if (!passwordMatches)
      throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: loginDto.email, role: 'staff' };
    const token = this.jwtService.sign(payload);  

    return { accessToken: token, staff: { email: this.staffEmail } };
  }
}

