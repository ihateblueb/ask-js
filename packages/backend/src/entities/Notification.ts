import typeorm, {
	Entity,
	Column,
	PrimaryColumn,
	ManyToOne,
	JoinColumn
} from 'typeorm';
import { Comment } from './Comment.js';
import { User } from './User.js';
import { Ask } from './Ask.js';

export type NotificationType = 'ask' | 'comment';

@Entity()
export class Notification {
	@PrimaryColumn()
	id: string;

	// users

	@Column({ select: false })
	toId: string;

	@ManyToOne(() => User, (user) => user, {
		onDelete: 'CASCADE'
	})
	@JoinColumn({ name: 'toId' })
	to: typeorm.Relation<User>;

	@Column({ select: false, nullable: true })
	fromId: string;

	@ManyToOne(() => User, (user) => user, {
		onDelete: 'CASCADE',
		nullable: true
	})
	@JoinColumn({ name: 'fromId' })
	from: typeorm.Relation<User>;

	// type

	@Column({
		type: 'enum',
		enum: ['ask', 'comment'],
		default: null
	})
	type: NotificationType;

	// objects

	@Column({ select: false, nullable: true })
	commentId: string;

	@ManyToOne(() => Comment, (comment) => comment, {
		onDelete: 'CASCADE',
		nullable: true
	})
	@JoinColumn({ name: 'commentId' })
	comment: typeorm.Relation<Comment>;

	@Column({ select: false, nullable: true })
	askId: string;

	@ManyToOne(() => Ask, (ask) => ask, {
		onDelete: 'CASCADE',
		nullable: true
	})
	@JoinColumn({ name: 'askId' })
	ask: typeorm.Relation<Ask>;

	// rest of it

	@Column({ default: false })
	read: boolean;

	@Column()
	createdAt: string;
}
