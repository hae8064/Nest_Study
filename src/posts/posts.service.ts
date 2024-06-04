import { Injectable, NotFoundException } from '@nestjs/common';

// 콘트롤러에서 로직을 다루지 않고 서비스에서 로직을 다루는 이유 ?
// controller는 정확한 함수로 정의하는걸 말함

interface Post {
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

export interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

let posts: PostModel[] = [
  {
    id: 1,
    author: 'newjeans',
    title: '뉴진스 민지',
    content: 'dsadas',
    likeCount: 321,
    commentCount: 321312,
  },
  {
    id: 2,
    author: 'newjeans',
    title: '뉴진스 혜린',
    content: '혜린!!',
    likeCount: 321,
    commentCount: 321312,
  },
  {
    id: 3,
    author: 'blackpink',
    title: '블핑',
    content: '공연하느 로제',
    likeCount: 321,
    commentCount: 321312,
  },
];

@Injectable()
export class PostsService {
  getAllPost() {
    return posts;
  }

  getPostById(id: number) {
    const post = posts.find((post) => post.id === +id);

    if (!post) {
      // NotFoundException이란 ? 찾지 못했다라는 의미
      throw new NotFoundException();
    }
    return post;
  }

  createPost(author: string, title: string, content: string) {
    const post: PostModel = {
      id: posts[posts.length - 1].id + 1,
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    };

    posts = [...posts, post];

    return post;
  }

  updatePost(postId: number, author: string, title: string, content: string) {
    const post = posts.find((post) => post.id === postId);

    if (!post) {
      throw new NotFoundException();
    }

    if (author) {
      post.author = author;
    }

    if (title) {
      post.title = title;
    }

    if (content) {
      post.content = content;
    }

    posts = posts.map((prevPost) => (prevPost.id === postId ? post : prevPost));

    return post;
  }

  deletePost(postId: number) {
    const post = posts.find((post) => post.id === postId);

    if (!post) {
      // NotFoundException이란 ? 찾지 못했다라는 의미
      throw new NotFoundException();
    }

    posts = posts.filter((post) => post.id !== postId);

    return postId;
  }
}
