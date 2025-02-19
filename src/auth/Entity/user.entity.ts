import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name?: string;  // Made it optional

    @Column({
        type: 'varchar',
        length: 12,
        unique: true,
    })
    mobile: string;  // Changed to string for flexibility with phone numbers

    @Column({ unique: true, nullable: true })  // Email can be optional
    email?: string;  // Made it optional

    @Column({ default: true })
    isActive: boolean;  // Default to true

    @Column({ nullable: true })
    password?: string;  // Assuming password is required
}
