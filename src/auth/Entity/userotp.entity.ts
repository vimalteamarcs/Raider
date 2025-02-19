import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_otp')
export class UserOtp {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 4 })
    otp: string;  // Changed to string to handle leading zeros and more flexibility

    @Column({
        type: 'varchar',
        length: 12,
        unique: true,
    })
    mobile: string;  // Changed to string for flexibility and handling large numbers

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
