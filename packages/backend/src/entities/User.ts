import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
	@PrimaryColumn()
	id: string;

	@Column()
	username: string;

	@Column({ nullable: true })
	displayName: string;

	@Column({ nullable: true })
	avatar: string;

	@Column({ nullable: true })
	prompt: string;

	@Column({ default: false })
	approved: boolean;

	@Column({ default: true })
	acceptingAsks: boolean;

	@Column({ default: true })
	showResponses: boolean;

	@Column({ default: false })
	admin: boolean;
}
