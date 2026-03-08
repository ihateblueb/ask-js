import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class AskModInfo {
	@PrimaryColumn()
	id: string;

	@Column()
	ip: string;

	@Column({ nullable: true })
	userId: string;
}
