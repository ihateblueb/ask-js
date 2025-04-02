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
    type: AnnouncementType;

    @Column()
    content: string;

    @Column()
    createdAt: string;

    @Column()
    validUntil: string;
}
