import typeorm, {
	Entity,
	Column,
	PrimaryColumn,
	ManyToOne,
	JoinColumn
} from 'typeorm';
import { User } from './User.js';

@Entity()
export class Invite {
	@PrimaryColumn()
	id: string;

	@Column({ select: false, nullable: true })
	usedById: string;

	@ManyToOne(() => User, (user) => user, {
		onDelete: 'CASCADE',
		nullable: true
	})
	@JoinColumn({ name: 'usedById' })
	usedBy: typeorm.Relation<User>;

	@Column()
	code: string;

	@Column()
	creator: string;

	@Column()
	createdAt: string;
}
