import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";

@Entity()
export class ConvoNode {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  feId!: string;
  @Column()
  name!: string;
  @Column({ nullable: true })
  depth!: number;
  @Column({ nullable: true })
  parentId!: string;

  @ManyToOne(() => ConvoNode, (node) => node.nodes)
  @JoinColumn({ name: "parentId" })
  parent!: ConvoNode;
  @OneToMany(() => ConvoNode, (node) => node.nodes)
  chats!: ConvoNode[];
  @OneToMany(() => ConvoNode, (node) => node.parent)
  nodes!: ConvoNode[];
}
