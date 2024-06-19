import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostModel } from '../posts.service';
import { PostsModel } from './posts.entity';

@Entity()
export class TagModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => PostsModel)
  posts: PostModel[];

  @Column()
  name: string;
}
