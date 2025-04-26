import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UsedUsernames {
	@PrimaryColumn()
	username: string;
}
