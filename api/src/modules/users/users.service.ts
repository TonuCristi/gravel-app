import { BadRequestException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { PrismaService } from '../../core/prisma/prisma.service.js';
import { CreateUserInput } from './types/create-user.input.js';
import { PrismaClientKnownRequestError } from '../../generated/prisma/internal/prismaNamespace.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateUserInput) {
    const passwordHash = await bcrypt.hash(input.password, 10);

    try {
      const foundUser = await this.prisma.user.create({
        data: { ...input, password: passwordHash },
        omit: { password: true },
      });

      return foundUser;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Email already exists!');
      }

      throw error;
    }
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
  }
}

// User methods
// create
// update
// delete
// findById
// findByEmail
// find
