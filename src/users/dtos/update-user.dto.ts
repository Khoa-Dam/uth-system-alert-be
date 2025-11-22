import { IsEmail, IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../auth/enums/role.enum';

export class UpdateUserDto {
    @ApiPropertyOptional({ description: 'User full name', example: 'John Doe' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ description: 'User email address', example: 'john.doe@example.com' })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional({
        description: 'User role',
        example: 'Admin',
        enum: Role
    })
    @IsEnum(Role)
    @IsOptional()
    role?: Role;
}

