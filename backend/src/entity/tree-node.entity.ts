import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TreeNode {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  type!: string;
  @Column()
  name!: string;
  @Column({ nullable: true })
  text!: string;
  @Column({ nullable: true })
  parent_id!: number;
  @Column({ nullable: true })
  lexType!: string;
  @Column({ nullable: true })
  depth!: number;
  @Column({ nullable: true })
  lexDepth!: number;
  content!: TreeNode[];
  sections!: TreeNode[];
  subNodes!: TreeNode[];
  @Column({ nullable: true })
  generated!: boolean;
}
