import typeorm, {
	Entity,
	Column,
	PrimaryColumn,
	ManyToOne,
	JoinColumn
} from 'typeorm';
import { User } from './User.js';

@Entity()
export class BannedSender {
	@PrimaryColumn()
	id: string;

	@Column({ select: false })
	toId: string;

	@ManyToOne(() => User, (user) => user, {
		onDelete: 'CASCADE'
	})
	@JoinColumn({ name: 'toId' })
	to: typeorm.Relation<User>;

	@Column({ nullable: true })
	ip: string;

	@Column({ select: false, nullable: true })
	userId: string;

	@ManyToOne(() => User, (user) => user, {
		onDelete: 'CASCADE'
	})
	@JoinColumn({ name: 'userId' })
	user: typeorm.Relation<User>;
}
