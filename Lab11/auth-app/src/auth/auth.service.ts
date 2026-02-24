import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from "src/database.service";

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwtService: JwtService
  ) {}

  async register(
    name: string,
    email: string,
    password: string,
    role: string
  ) {
    const existing: any = await this.db.query(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.db.query(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [name, email, hashedPassword, role]
    );

    return { message: 'User registered successfully' };
  }

  async login(email: string, password: string) {
    const users: any = await this.db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      throw new UnauthorizedException('Invalid email');
    }

    const user = users[0];

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = {
      user_id: user.user_id,
      role: user.role
    };

    const token = this.jwtService.sign(payload);

    return { token };
  }

  async createStaffWithUser(data: {
  name: string;
  email: string;
  password: string;
  role: 'staff' | 'meeting_convener';
  mobile?: string;
  remarks?: string;
}) {
  const { name, email, password, role, mobile, remarks } = data;

  const existing: any = await this.db.query(
    'SELECT user_id FROM users WHERE email = ?',
    [email]
  );

  if (existing.length > 0) {
    throw new BadRequestException('Email already exists');
  }

 
  await this.db.query('START TRANSACTION',[]);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Insert into users
    const userResult: any = await this.db.query(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [name, email, hashedPassword, role]
    );

    const userId = userResult.insertId;

    await this.db.query(
      `INSERT INTO Staff (StaffName, MobileNo, EmailAddress, Remarks, user_id)
       VALUES (?, ?, ?, ?, ?)`,
      [name, mobile || null, email, remarks || null, userId]
    );

    await this.db.query('COMMIT',[]);

    return { message: 'Staff and user created successfully' };
  } catch (err) { 
    await this.db.query('ROLLBACK',[]);
    throw err;
  }
}

}
