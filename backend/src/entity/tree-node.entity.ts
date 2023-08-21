import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TreeNode {
  @PrimaryColumn()
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
}
