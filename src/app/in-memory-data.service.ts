import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { CommentInterface } from './comment-interface';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const comments = [
      {
        id: 12,
        parentId: null,
        userId: 2,
        author: 'John',
        content:
          'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aperiam suscipit at asperiores officia saepe dolor. Id ea facere dolorum quo laudantium quas in harum, rem reiciendis asperiores quae nam. Magnam!',
        date: '03.05.2023',
        replies: [],
        repliesIds: [13, 14, 15],
        avatar: 'assets/img/avatar.png',
      },
      {
        id: 13,
        parentId: 12,
        userId: 2,
        author: 'Peter',
        content:
          'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorem et repudiandae obcaecati consequatur eveniet quaerat ratione architecto voluptatum corporis fugiat, dolor veritatis libero. Eveniet vitae, quae facere ratione ipsum voluptates.',
        date: '03.05.2023',
        replies: [],
        repliesIds: [],
        avatar: 'assets/img/avatar.png',
      },
      {
        id: 14,
        parentId: 12,
        userId: 4,
        author: 'Bob',
        content:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores quod praesentium numquam et neque possimus laborum minima sit sequi enim exercitationem est deleniti, rem id esse, omnis quia provident velit.',
        date: '01.02.2023',
        replies: [],
        repliesIds: [],
        avatar: 'assets/img/avatar.png',
      },
      {
        id: 15,
        parentId: 12,
        userId: 5,
        author: 'Frank',
        content:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque consectetur totam libero saepe? Voluptatibus aut, officia, voluptatem excepturi impedit eius commodi, corporis a libero explicabo dolorum! Quos dignissimos soluta odit!',
        date: '03.05.2023',
        replies: [],
        repliesIds: [],
        avatar: 'assets/img/avatar.png',
      },
      {
        id: 16,
        parentId: null,
        userId: 6,
        author: 'Joseph',
        content:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Totam, aliquid cupiditate! Explicabo est impedit mollitia dignissimos recusandae non omnis beatae cum eaque, quisquam velit aliquam necessitatibus ea, laudantium, ipsam veniam.',
        date: '02.05.2023',
        replies: [],
        repliesIds: [],
        avatar: 'assets/img/avatar.png',
      },
      {
        id: 17,
        parentId: null,
        userId: 7,
        author: 'Emma',
        content:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, quibusdam molestiae. Necessitatibus corporis ipsa totam fugit, hic numquam quo iste corrupti cum sit natus magni consectetur deleniti? Provident, necessitatibus cupiditate!',
        date: '01.05.2023',
        replies: [],
        repliesIds: [],
        avatar: 'assets/img/avatar.png',
      },
      {
        id: 18,
        parentId: null,
        userId: 8,
        author: 'Stan',
        content:
          'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolore excepturi nesciunt ea animi impedit labore molestias, dignissimos reprehenderit sint aut cum, quaerat ut id pariatur harum aspernatur ipsum libero repellat?',
        date: '02.05.2022',
        replies: [],
        repliesIds: [],
        avatar: 'assets/img/avatar.png',
      },
      {
        id: 19,
        parentId: null,
        userId: 9,
        author: 'George',
        content:
          'Lorem, ipsum dolor sit amet consectetur adipisicing elit. In tenetur, similique nostrum id fuga molestias! Necessitatibus delectus commodi aspernatur, dolorem eum deserunt quibusdam officiis amet provident eligendi maiores nesciunt alias.',
        date: '04.05.2021',
        replies: [],
        repliesIds: [],
        avatar: 'assets/img/avatar.png',
      },
      {
        id: 20,
        parentId: null,
        userId: 0,
        author: 'Larry',
        content:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Expedita illum incidunt, aperiam sunt rem at ipsam, commodi ullam asperiores aut quisquam tenetur? Ipsum molestias animi debitis illum ducimus. Temporibus, consequatur!',
        date: '01.05.2020',
        replies: [],
        repliesIds: [],
        avatar: 'assets/img/avatar.png',
      },
    ];
    return { comments };
  }

  // Overrides the genId method to ensure that a comment always has an id.
  // If the comments array is empty,
  // the method below returns the initial number (11).
  // if the comments array is not empty, the method below returns the highest
  // comment id + 1.
  genId(comments: CommentInterface[]): number {
    return comments.length > 0
      ? Math.max(...comments.map((comment) => comment.id)) + 1
      : 11;
  }
}
