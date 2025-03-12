import typeorm, {
	Entity,
	Column,
	PrimaryColumn,
	ManyToOne,
	JoinColumn
} from 'typeorm';
import { User } from './User.js';

@Entity()
export class Ask {
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
	cw: string;

	@Column()
	content: string;

	@Column({ nullable: true })
	nickname: string;

	@Column({ nullable: false, default: 'public' })
	visibility: string;

	@Column()
	createdAt: string;

	@Column({ nullable: true })
	response: string;
}
