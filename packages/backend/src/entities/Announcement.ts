import { Entity, Column, PrimaryColumn } from 'typeorm';

export type AnnouncementType = 'urgent' | 'warn' | 'generic';


@Entity()
export class Announcement {
    @PrimaryColumn()
    id: string;

    @Column({
        type: 'enum',
        enum: ['urgent', 'warn', 'generic'],
        default: 'generic'
    })
    target: AnnouncementType;

    @Column()
    content: string;

    @Column()
    createdAt: string;

    @Column()
    validUntil: string;

    // todo: many users
    @Column()
    readBy: string;
}
