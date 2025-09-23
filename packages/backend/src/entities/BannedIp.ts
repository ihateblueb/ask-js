import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class BannedIp {
	@PrimaryColumn()
	id: string;

	@Column()
	ip: string;

	@Column({ nullable: true })
	userId: string;

	@Column({ nullable: true })
	reason: string;
}
